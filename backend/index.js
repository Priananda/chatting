import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authUserRoutes from "./src/routes/authUser.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
import { verifyToken } from "./src/middleware/auth.js";

dotenv.config();

const app = express();
const server = createServer(app);

// CORS HTTP
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
}));

app.use(express.json());

// Middleware global
app.use((req, res, next) => {
  const paths = ["/api/users/register", "/api/users/login"];
  
  if (paths.includes(req.path)) return next();
  verifyToken(req, res, next);
});

// Pasang router yang saling terkait
app.use("/api/users", authUserRoutes);
app.use("/api/messages", messageRoutes);

// CORS real-time
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Proses menangani chat realtime Socket.IO
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User join:", userId);
  });

  socket.on("send_message", (msg) => {
    const receiverSocket = onlineUsers.get(msg.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_message", msg);
    }
  });

  socket.on("update_message", (updatedMsg) => {
    const receiverSocket = onlineUsers.get(updatedMsg.receiverId);
    const senderSocket = onlineUsers.get(updatedMsg.senderId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("update_message", updatedMsg);
    }
    if (senderSocket && senderSocket !== receiverSocket) {
      io.to(senderSocket).emit("update_message", updatedMsg);
    }
  });

  socket.on("delete_message", (deletedMsg) => {
    const receiverSocket = onlineUsers.get(deletedMsg.receiverId);
    const senderSocket = onlineUsers.get(deletedMsg.senderId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("delete_message", deletedMsg);
    }
    if (senderSocket && senderSocket !== receiverSocket) {
      io.to(senderSocket).emit("delete_message", deletedMsg);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    [...onlineUsers.entries()].forEach(([userId, id]) => {
      if (id === socket.id) onlineUsers.delete(userId);
    });
  });
});



const URI = process.env.MONGODB_URI;
// Proses mengecek
if (!URI) {
  console.error("URL tidak ditemukan");
  process.exit(1);
}

// Koneksi ke MongoDB
mongoose.connect(URI)
  .then(() => console.log("Berhasil terhubung ke MongoDB"))
  .catch(err => {
    console.error("Gagal terhubung ke MongoDB:", err.message);
    process.exit(1);
  });

// Menjalankan server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
