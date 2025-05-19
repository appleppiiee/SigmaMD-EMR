// server/routes/user.routes.js
import express from "express";
import {
  create,
  login,
  list,
  read,
  update,
  userByID
} from "../controllers/user.controller.js";

const router = express.Router();


router.post("/", create);


router.post("/login", login);

router.get("/", list);
router.route("/:userId")
  .get(read)
  .put(update);

router.param("userId", userByID);

export default router;
