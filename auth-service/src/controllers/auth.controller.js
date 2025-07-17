import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, mobile, address } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Basic validation
  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // 2) Lookup user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3) If Creator, check approval status
    if (user.role === "creator" && user.status !== "approved") {
      // You can customize messaging per status
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

    // 4) Verify password
    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: "Wrong credentials" });
    }

    // 5) Generate JWT
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    // 6) Send cookie
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    res.cookie("access_token", token, {
      httpOnly: true,
      expires: expiry,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // 7) Return safe user object + token
    const { passwordHash, ...safeUser } = user.toJSON();
    return res.status(200).json({ user: safeUser, token, role: user.role });
  } catch (err) {
    console.error("Error in signin:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};
