import express from "express";
import { addFriend, getFriends } from "../controllers/friendController.js";

const router = express.Router();

// semua request ke sini sudah prefix: /api/friend
router.post("/add", addFriend);   // POST /api/friend/add
router.get("/list", getFriends);  // GET  /api/friend/list

export default router;
