import express from "express";
import { registerUser, loginUser, listUsers } from "../controllers/authController.js";
import { meData } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/list", listUsers);
router.get("/me", meData);

export default router;
