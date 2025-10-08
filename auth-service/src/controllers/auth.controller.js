import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { title, name, email, password, role, mobile, address } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      title,
      name,
      email,
      passwordHash,
      role,
      mobile: mobile || null,
      address: role === "creator" ? address : null,
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// auth service: controllers/auth.controller.js (signin)
export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "creator" && user.status !== "approved") {
      if (user.status === "pending") {
        return res
          .status(403)
          .json({ message: "Your creator account is still pending approval." });
      } else if (user.status === "rejected") {
        return res
          .status(403)
          .json({ message: "Your creator account registration was rejected." });
      }
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) return res.status(401).json({ message: "Wrong credentials" });

    // ✅ Put everything other services need into the token
    const payload = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      title: user.title,
      // optionally:
      // profilePicUrl: user.profilePicUrl,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    // use a consistent cookie name across services
    const cookieName = process.env.JWT_COOKIE_NAME || "access_token";
    const oneDayMs = 24 * 60 * 60 * 1000;
    res.cookie(cookieName, token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDayMs),
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    const { passwordHash, ...safeUser } = user.toJSON();
    return res.status(200).json({ user: safeUser, token, role: user.role });
  } catch (err) {
    console.error("Error in signin:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const logout = (req, res) => {
  // Clear the cookie set at signin()
  res
    .clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};
