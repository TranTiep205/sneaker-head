const { validationResult } = require("express-validator");
const User = require("../models/User");

async function register(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, password, role } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail }).lean();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const user = await User.create({
      name: String(name || "").trim(),
      email: normalizedEmail,
      password: String(password || ""),
      role: role === "admin" ? "admin" : "user",
    });

    return res.status(201).json({
      success: true,
      message: "Register successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register failed:", error);
    return res.status(500).json({
      success: false,
      message: "Register failed",
    });
  }
}

async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(String(password || ""));
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = user.getSignedJwtToken();

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
}

module.exports = {
  register,
  login,
};
