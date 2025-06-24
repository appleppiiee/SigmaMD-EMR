// src/middleware/auth.js

import jwt from "jsonwebtoken";
import User from "../server/models/user.model.js";

// Use environment variable for JWT secret or default to 'sigma-secret'
const SECRET = process.env.JWT_SECRET || "sigma-secret";

/**
 * Middleware to verify the JWT token and authenticate the user.
 */
export const ensureAuth = async (req, res, next) => {
  const auth = req.headers.authorization;

  // Check if the Authorization header exists and follows 'Bearer <token>' format
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }

  let payload;
  try {
    // Remove 'Bearer ' prefix and verify the token using the secret
    payload = jwt.verify(auth.replace("Bearer ", ""), SECRET);
  } catch {
    // If verification fails, respond with a 403 Forbidden
    return res.status(403).json({ error: "Invalid token." });
  }

  // Look up the user in the database using the token's subject (user ID)
  const user = await User.findById(payload.sub).select("-password");

  // If the user no longer exists, respond with a 401 Unauthorized
  if (!user) {
    return res.status(401).json({ error: "User not found." });
  }

  // Attach user data (excluding sensitive fields) to the request object
  req.user = { id: user._id, userType: user.userType };

  // Proceed to the next middleware or route handler
  next();
};

/**
 * Middleware to enforce role-based access control.
 * Only allows users with specified roles to proceed.
 */
export const requireRole = roles => (req, res, next) => {
  // Check if the current user's role is included in the allowed roles
  if (!roles.includes(req.user.userType)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // User is authorized, proceed to the next middleware or route
  next();
};
