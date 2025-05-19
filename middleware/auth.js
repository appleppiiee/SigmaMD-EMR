// src/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../server/models/user.model.js";

const SECRET = process.env.JWT_SECRET || "sigma-secret";

export const ensureAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }

  let payload;
  try {
    payload = jwt.verify(auth.replace("Bearer ", ""), SECRET);
  } catch {
    return res.status(403).json({ error: "Invalid token." });
  }

  const user = await User.findById(payload.sub).select("-password");
  if (!user) {
    return res.status(401).json({ error: "User not found." });
  }

  req.user = { id: user._id, userType: user.userType };
  next();
};

export const requireRole = roles => (req, res, next) => {
  if (!roles.includes(req.user.userType)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};
