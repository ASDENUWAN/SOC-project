import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { s3 } from "../utils/s3.js";
import { putObjectFromBuffer, deleteObjectByKey } from "../utils/s3.js";

// GET /profile
export const getProfile = (req, res) => {
  const { passwordHash, ...userData } = req.user.toJSON();
  res.json(userData);
};
// GET /public/creators
export const listPublicCreators = async (req, res) => {
  const creators = await User.findAll({
    where: { role: "creator", status: "approved" },
    order: [["createdAt", "DESC"]],
    attributes: [
      "id",
      "title",
      "name",
      "email",
      "mobile",
      "profilePicUrl",
      "createdAt",
      "rating",
    ],
  });
  res.json(creators.map((c) => c.toJSON()));
};

// PUT /profile
export const updateProfile = async (req, res) => {
  try {
    const {
      title,
      name,
      mobile,
      address,
      removePic, // "true"/"1"/true to remove
      currentPassword, // optional
      newPassword, // optional
      confirmPassword, // optional
    } = req.body;

    const updates = {};
    if (typeof title === "string") {
      const allowed = ["Mr", "Ms", "Mrs", "Dr"];
      if (!allowed.includes(title)) {
        return res.status(400).json({ message: "Invalid title" });
      }
      updates.title = title;
    }
    if (typeof name === "string") updates.name = name;
    if (typeof mobile === "string") updates.mobile = mobile;
    if (typeof address === "string") updates.address = address;

    // ===== Password change (optional) =====
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          message: "Provide currentPassword, newPassword and confirmPassword",
        });
      }
      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "New password and confirmation do not match" });
      }
      if (newPassword.length < 4) {
        return res
          .status(400)
          .json({ message: "New password must be at least 4 characters" });
      }
      const ok = await bcrypt.compare(currentPassword, req.user.passwordHash);
      if (!ok)
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });

      updates.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // ===== Profile picture (upload/replace/remove) =====
    const wantsRemove =
      String(removePic).toLowerCase() === "true" || removePic === "1";
    const hadOldKey = req.user.profilePicKey;

    // Case A: New file uploaded -> upload new, then delete old
    if (req.file && req.file.buffer) {
      const { key, url } = await putObjectFromBuffer({
        buffer: req.file.buffer,
        contentType: req.file.mimetype,
        keyPrefix: "profiles",
        userId: req.user.id,
      });
      updates.profilePicUrl = url;
      updates.profilePicKey = key;

      // persist first so DB always has a valid image
      await req.user.update(updates);

      // delete old (best-effort)
      if (hadOldKey) {
        try {
          await deleteObjectByKey(hadOldKey);
        } catch (e) {
          /* log only */
        }
      }
    }
    // Case B: removePic=true and no new file -> delete from S3 and clear fields
    else if (wantsRemove && hadOldKey) {
      await deleteObjectByKey(hadOldKey);
      updates.profilePicUrl = null;
      updates.profilePicKey = null;
      await req.user.update(updates);
    }
    // Case C: just field updates (no pic change)
    else {
      await req.user.update(updates);
    }

    const userJson = req.user.toJSON();
    delete userJson.passwordHash;
    return res.json(userJson);
  } catch (err) {
    console.error("❌ updateProfile error:", err);
    return res.status(500).json({ message: "Couldn’t update profile" });
  }
};
// Admin: GET /users
export const listUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash"] },
  });
  res.json(users.map((u) => u.toJSON()));
};

// Admin: GET /students
export const listStudents = async (req, res) => {
  const students = await User.findAll({
    where: { role: "student" },
    order: [["createdAt", "DESC"]],
    attributes: { exclude: ["passwordHash"] },
  });
  res.json(students.map((s) => s.toJSON()));
};

// Admin: PUT /users/:id/approve (legacy)
export const approveCreator = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user || user.role !== "creator")
    return res.status(404).json({ message: "Creator not found" });
  await user.update({ status: "approved" });
  res.json({ message: "Creator approved" });
};

// Admin: DELETE /users/:id  (delete profile pic first)
export const deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.profilePicKey) {
    try {
      await deleteObjectByKey(user.profilePicKey);
    } catch (e) {
      /* log only */
    }
  }
  await user.destroy();
  res.json({ message: "User deleted" });
};

// DELETE /profile (self)
export const deleteMyProfile = async (req, res) => {
  try {
    if (req.user.profilePicKey) {
      try {
        await deleteObjectByKey(req.user.profilePicKey);
      } catch (e) {
        /* log only */
      }
    }
    await req.user.destroy();
    res.clearCookie(process.env.JWT_COOKIE_NAME || "token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Account deleted" });
  } catch (err) {
    console.error("❌ deleteMyProfile error:", err);
    res.status(500).json({ message: "Couldn’t delete account" });
  }
};

/* ============
   Creators API
   ============ */

// GET /creators  -> { pending: [...], others: [...] }
export const listCreatorsGrouped = async (req, res) => {
  const creators = await User.findAll({
    where: { role: "creator" },
    order: [["createdAt", "DESC"]],
    attributes: { exclude: ["passwordHash"] },
  });

  const pending = [];
  const others = [];

  creators.forEach((c) => {
    const item = c.toJSON();
    const createdMs = new Date(item.createdAt).getTime();
    item.isNew =
      item.status === "pending" ||
      Date.now() - createdMs < 7 * 24 * 60 * 60 * 1000;

    if (item.status === "pending") pending.push(item);
    else others.push(item);
  });

  res.json({ pending, others });
};

// PUT /creators/:id/status  body: { status }
export const setCreatorStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["pending", "approved", "rejected"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const user = await User.findByPk(id);
  if (!user || user.role !== "creator") {
    return res.status(404).json({ message: "Creator not found" });
  }

  await user.update({ status });
  const { passwordHash, ...safe } = user.toJSON();
  res.json(safe);
};

// PUT /creators/:id/rating  body: { rating: 1..5 }
export const setCreatorRating = async (req, res) => {
  const { id } = req.params;
  let { rating } = req.body;

  rating = parseFloat(rating);
  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const user = await User.findByPk(id);
  if (!user || user.role !== "creator") {
    return res.status(404).json({ message: "Creator not found" });
  }

  await user.update({ rating });
  res.json({ id: user.id, rating: user.rating });
};

// Creators API: unchanged except delete
export const deleteCreator = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user || user.role !== "creator") {
    return res.status(404).json({ message: "Creator not found" });
  }

  if (user.profilePicKey) {
    try {
      await deleteObjectByKey(user.profilePicKey);
    } catch (e) {
      /* log only */
    }
  }
  await user.destroy();
  res.json({ message: "Creator deleted" });
};
