// src/middleware/auth.js

import jwt from "jsonwebtoken";
import config from "../server/config.js";            // ← your single source of truth
import User   from "../server/models/user.model.js";

const SECRET = config.jwtSecret;                    // must be set in your .env

/**
 * Middleware to verify the JWT token and authenticate the user.
 */
export const ensureAuth = async (req, res, next) => {
  try {
    const header = req.get("Authorization");
    if (!header) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Malformed Authorization header" });
    }

    let payload;
    try {
      payload = jwt.verify(token, SECRET);
    } catch (err) {
      const msg = err.name === "TokenExpiredError"
        ? "Token expired"
        : "Invalid token";
      return res.status(401).json({ error: msg });
    }

    const user = await User.findById(payload.sub).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // attach a minimal user object for downstream handlers
    req.user = { id: user._id, userType: user.userType };
    next();

  } catch (err) {
    // catch any unexpected errors (e.g. database down)
    next(err);
  }
};

/**
 * Middleware to enforce role-based access control.
 * Usage: requireRole(["admin","manager"])
 */
export const requireRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.userType)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};
