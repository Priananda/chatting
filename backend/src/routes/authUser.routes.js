import express from "express";
import { registerUser, loginUser, listUsers } from "../controllers/authController.js";
import { profileUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/list", listUsers);
router.get("/me", profileUsers);

export default router;
