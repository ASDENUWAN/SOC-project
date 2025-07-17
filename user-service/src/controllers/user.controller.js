import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { s3 } from "../utils/s3.js"; // v3 S3Client
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

// GET /profile
export const getProfile = (req, res) => {
  const { passwordHash, ...userData } = req.user.toJSON();
  res.json(userData);
};

// PUT /profile
export const updateProfile = async (req, res) => {
  try {
    const { name, mobile, address } = req.body;
    const updates = { name, mobile, address };
    const oldUrl = req.user.profilePicUrl;

    // 1) New upload?
    if (req.file) {
      // a) Delete old object if exists
      if (oldUrl) {
        // extract key from URL (assuming `https://bucket.s3.amazonaws.com/<key>`)
        const oldKey = oldUrl.split("/").pop();
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: oldKey,
          })
        );
      }
      // b) Save new URL
      updates.profilePicUrl = req.file.location;

      // 2) Removal requested?
    } else {
      if (oldUrl) {
        const oldKey = oldUrl.split("/").pop();
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: oldKey,
          })
        );
      }
      updates.profilePicUrl = null;
    }

    // 3) Apply updates
    await req.user.update(updates);

    // 4) Return sanitized user
    const { passwordHash, ...userData } = req.user.toJSON();
    res.json(userData);
  } catch (err) {
    console.error("❌ updateProfile error:", err);
    res.status(500).json({ message: "Couldn’t update profile" });
  }
};

// Admin: GET /users
export const listUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(
    users.map((u) => {
      const { passwordHash, ...rest } = u.toJSON();
      return rest;
    })
  );
};

// Admin: PUT /users/:id/approve (for creators)
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
  await user.destroy();
  res.json({ message: "User deleted" });
};
