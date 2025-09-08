import express from "express";
import {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage
} from "../controllers/messageController.js"; // Pastikan path-nya sesuai

const router = express.Router();

router.post("/", createMessage);                     // Create
router.get("/:user1/:user2", getMessages);           // Read
router.put("/:id", updateMessage);                   // Update
router.delete("/:id", deleteMessage);                // Delete (soft)

export default router;
