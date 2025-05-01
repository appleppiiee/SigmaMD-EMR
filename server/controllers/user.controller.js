// ===== controllers/user.controller.js =====
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import errorHandler from "./error.controller.js";
import _ from "lodash";
const { extend } = _;

const create = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(201).json(safeUser);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(400).json({ error: "User not found." });
    if (user.password !== password) return res.status(400).json({ error: "Incorrect password." });

    const token = jwt.sign({ _id: user._id }, "sigma-secret", { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        userType: user.userType
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
};

const readProfile = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).select("-password -__v");
    if (!user) return res.status(400).json({ error: "Could not retrieve user" });
    res.json(user);
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

const list = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -__v");
    res.json(users);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const read = (req, res) => {
  return res.json(req.profile);
};

const update = async (req, res) => {
  try {
    let user = req.profile;
    user = extend(user, req.body);
    user.updatedAt = new Date();
    await user.save();
    user.password = undefined;
    res.json(user);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const remove = async (req, res) => {
  try {
    const user = req.profile;
    await user.deleteOne();
    res.json({ message: "User deleted successfully!" });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany();
    res.json({ message: "All users deleted successfully!" });
  } catch (err) {
    return res.status(500).json({ error: "Error deleting all users" });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).select("-password -__v");
    if (!user) return res.status(400).json({ error: "User not found" });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

export {
  create,
  login,
  readProfile,
  list,
  read,
  update,
  remove,
  deleteAllUsers,
  userByID
};
