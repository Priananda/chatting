// src/middleware/socket.js
import jwt from "jsonwebtoken";

export const socketAuth = (socket, next) => {
  try {
    // Ambil cookie dari handshake
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) {
      return next(new Error("Cookie tidak ditemukan"));
    }

    // Cari cookie bernama "token"
    const tokenCookie = cookie.split(";").find(c => c.trim().startsWith("token="));
    if (!tokenCookie) {
      return next(new Error("Token tidak ditemukan di cookie"));
    }

    const token = tokenCookie.split("=")[1];

    // Verifikasi JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan payload user ke socket
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Autentikasi gagal: " + err.message));
  }
};
