// server/routes/user.routes.js
import express from "express";
import {
  signup,
  create,
  login,
  readProfile,
  list,
  listPhysicians,
  read,
  update,
  userByID
} from "../controllers/user.controller.js";

const router = express.Router();

// Public signup (creates default clinic + user)
router.post("/signup", signup);

// Admin-only create
router.post("/", create);

// Authentication
router.post("/login", login);

// Profile
router.get("/me", readProfile);

// Listings
router.get("/", list);
router.get("/physicians", listPhysicians);

// Individual operations
router
  .route("/:userId")
  .get(read)
  .put(update);

router.param("userId", userByID);

export default router;
