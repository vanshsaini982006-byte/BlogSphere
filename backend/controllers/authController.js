import { validationResult } from "express-validator";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }

  const { name, username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const field = existingUser.email === email ? "Email" : "Username";
    return res.status(400).json({ success: false, message: `${field} is already registered` });
  }

  const user = await User.create({ name, username, email, password });
  const token = generateToken(user._id);

  res.status(201).json({ success: true, message: "Registration successful", token, user: user.toSafeObject() });
});

// @desc    Login user
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }

  const { identifier, password } = req.body; // identifier = email or username

  const user = await User.findOne({
    $or: [{ email: identifier?.toLowerCase() }, { username: identifier?.toLowerCase() }],
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = generateToken(user._id);
  res.json({ success: true, message: "Login successful", token, user: user.toSafeObject() });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

// @desc    Logout (client discards token; endpoint provided for completeness)
// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});
