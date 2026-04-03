import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { toPublicUser } from "../utils/userResponse.js";
import { httpError } from "../utils/httpError.js";

function signToken(userId) {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export async function register(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(httpError("Please provide name, email, and password", 400));
  }

  const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists",
    });
  }

  const user = await User.create({
    name: String(name).trim(),
    email,
    password,
  });

  const token = signToken(user._id);
  res.status(201).json({
    success: true,
    token,
    user: toPublicUser(user),
  });
}

export async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(httpError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select(
    "+password"
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const match = await user.comparePassword(password);
  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = signToken(user._id);
  res.json({
    success: true,
    token,
    user: toPublicUser(user),
  });
}

export async function me(req, res, next) {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(httpError("User not found", 401));
  }
  res.json({
    success: true,
    user: toPublicUser(user),
  });
}
