import jwt from "jsonwebtoken";

// Middleware to check if a valid token is provided
const requireSignin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token provided." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), "sigma-secret");
    req.auth = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }
};

// Middleware to restrict access based on userType (e.g., admin, provider)
const requireRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.auth?.userType;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }
    next();
  };
};

export { requireSignin, requireRole };
