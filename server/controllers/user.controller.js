// controllers/user.controller.js
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import errorHandler from "./error.controller.js";
import _ from "lodash";
const { extend } = _;

// CREATE
const create = async (req, res) => {
  try {
    // strip out client-sent _id
    delete req.body._id;
    
    const user = new User(req.body);
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(201).json(safeUser);
  } catch (err) {
    // catch duplicate‐email
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res
        .status(400)
        .json({ error: "Email already exists. Pick a different name." });
    }
    return res
      .status(400)
      .json({ error: errorHandler.getErrorMessage(err) });
  }
};

// LOGIN
const login = async (req, res) => {
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

// READ PROFILE
const readProfile = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).select("-password -__v");
    if (!user)
      return res.status(400).json({ error: "Could not retrieve user" });
    res.json(user);
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

// LIST — populates clinic details
const list = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password -__v")
      .populate({
        path: "clinicID",
        select: "-__v",
      });
    res.json(users);
  } catch (err) {
    return res
      .status(400)
      .json({ error: errorHandler.getErrorMessage(err) });
  }
};

// READ SINGLE
const read = (req, res) => res.json(req.profile);

// UPDATE
const update = async (req, res) => {
  try {
    // do not allow email change via update
    delete req.body.email;

    let user = req.profile;
    user = extend(user, req.body);
    user.updatedAt = new Date();
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;
    res.json(safeUser);
  } catch (err) {
    return res
      .status(400)
      .json({ error: errorHandler.getErrorMessage(err) });
  }
};


// find by ID middleware
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
  userByID,
};
