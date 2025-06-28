// controllers/user.controller.js
import User from "../models/user.model.js";
import Clinic from "../models/clinic.model.js";
import jwt from "jsonwebtoken";
import errorHandler from "./error.controller.js";
import _ from "lodash";
const { extend } = _;

// ── SIGNUP ──────────────────────────────────────
// POST /api/users/signup
// Creates (if needed) the default clinic, then the user under that clinic
export const signup = async (req, res) => {
  try {
    // 1) ensure default clinic
    const defaultName = "clinic 1";
    let clinic = await Clinic.findOne({ name: defaultName });
    if (!clinic) {
      clinic = await Clinic.create({
        name: defaultName,
        nameaddress: defaultName,
        mobileNo: "00000000"
      });
    }

    // 2) create user
    delete req.body._id;
    const user = new User({ ...req.body, clinicID: clinic._id });
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;
    return res.status(201).json(safeUser);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ error: "Email already exists." });
    }
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// ── CREATE (admin) ─────────────────────────────
// POST /api/users
export const create = async (req, res) => {
  try {
    delete req.body._id;
    const user = new User(req.body);
    await user.save();
    const safe = user.toObject();
    delete safe.password;
    return res.status(201).json(safe);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ error: "Email already exists." });
    }
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// ── LOGIN ───────────────────────────────────────
// POST /api/users/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ error: "User not found." });
    if (user.password !== password)
      return res.status(400).json({ error: "Incorrect password." });

    const token = jwt.sign({ _id: user._id }, "sigma-secret", {
      expiresIn: "7d",
    });
    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        userType: user.userType,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
};

// ── READ PROFILE ───────────────────────────────
// GET /api/users/me
export const readProfile = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).select("-password -__v");
    if (!user) return res.status(400).json({ error: "User not found." });
    return res.json(user);
  } catch {
    return res.status(400).json({ error: "Could not retrieve user." });
  }
};

// ── LIST ALL ───────────────────────────────────
// GET /api/users
export const list = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password -__v")
      .populate({ path: "clinicID", select: "-__v" });
    return res.json(users);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// ── LIST PHYSICIANS ────────────────────────────
// GET /api/users/physicians
export const listPhysicians = async (req, res) => {
  try {
    const physicians = await User.find({ userType: "physician", status: "a" })
      .select("firstName lastName specialization")
      .lean();
    return res.json(physicians);
  } catch (err) {
    console.error("listPhysicians error:", err);
    return res.status(500).json({ error: "Failed to fetch physicians" });
  }
};

// ── READ SINGLE ────────────────────────────────
// GET /api/users/:userId
export const read = (req, res) => res.json(req.profile);

// ── UPDATE ────────────────────────────────────
// PUT /api/users/:userId
export const update = async (req, res) => {
  try {
    delete req.body.email;
    let user = req.profile;
    user = extend(user, req.body);
    user.updatedAt = new Date();
    await user.save();
    const safe = user.toObject();
    delete safe.password;
    return res.json(safe);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// ── PARAM MIDDLEWARE ──────────────────────────
export const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).select("-password -__v");
    if (!user) return res.status(400).json({ error: "User not found" });
    req.profile = user;
    next();
  } catch {
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};
