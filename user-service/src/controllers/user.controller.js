import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { s3 } from "../utils/s3.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

// GET /profile
export const getProfile = (req, res) => {
  const { passwordHash, ...userData } = req.user.toJSON();
  res.json(userData);
};

// PUT /profile
// PUT /profile
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      mobile,
      address,
      removePic,
      currentPassword, // optional, required if changing password
      newPassword, // optional
      confirmPassword, // optional: match check
    } = req.body;

    const updates = {};
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
      if (!ok) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      updates.passwordHash = newHash; // NEVER store plain password
    }

    // ===== Profile picture (upload/replace/remove) =====
    const oldUrl = req.user.profilePicUrl;

    if (req.file) {
      // replace: delete old then store new
      if (oldUrl) {
        const oldKey = oldUrl.split("/").pop();
        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.S3_BUCKET,
              Key: oldKey,
            })
          );
        } catch (_) {}
      }
      updates.profilePicUrl = req.file.location;
    } else if (removePic === "true" || removePic === true) {
      // explicit remove
      if (oldUrl) {
        const oldKey = oldUrl.split("/").pop();
        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.S3_BUCKET,
              Key: oldKey,
            })
          );
        } catch (_) {}
      }
      updates.profilePicUrl = null;
    }

    // Persist
    await req.user.update(updates);

    // Return sanitized user
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

// Admin: PUT /users/:id/approve (legacy)
export const approveCreator = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user || user.role !== "creator")
    return res.status(404).json({ message: "Creator not found" });
  await user.update({ status: "approved" });
  res.json({ message: "Creator approved" });
};

// Admin: DELETE /users/:id
export const deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const oldUrl = user.profilePicUrl;
  if (oldUrl) {
    const oldKey = oldUrl.split("/").pop();
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: oldKey,
      })
    );
  }

  await user.destroy();
  res.json({ message: "User deleted" });
};

// DELETE /profile (self)
export const deleteMyProfile = async (req, res) => {
  try {
    const oldUrl = req.user.profilePicUrl;
    if (oldUrl) {
      const oldKey = oldUrl.split("/").pop();
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: oldKey,
        })
      );
    }

    await req.user.destroy();
    res.clearCookie("token", {
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

// DELETE /creators/:id
export const deleteCreator = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user || user.role !== "creator") {
    return res.status(404).json({ message: "Creator not found" });
  }

  if (user.profilePicUrl) {
    const oldKey = user.profilePicUrl.split("/").pop();
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: oldKey,
      })
    );
  }

  await user.destroy();
  res.json({ message: "Creator deleted" });
};
