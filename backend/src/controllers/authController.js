import * as authService from "../services/authService.js";

// Register: menerima data dari sisi client
export const registerUser = async (req, res) => {
  try {
     const dataRegister = await authService.register(req.body);
     res.status(201).json({ message: "Registrasi sukses", dataRegister });
  
     } catch (err) {
     res.status(err.status || 500).json({ message: err.message || "Server error saat registrasi" });
  }
};

// Login: menerima data dari sisi client
export const loginUser = async (req, res) => {
  try {
     const dataLogin = await authService.login(req.body);
     res.json({ message: "Login sukses", ...dataLogin });
  
     } catch (err) {
     res.status(err.status || 500).json({ message: err.message || "Server error saat login" });
  }
};

// Daftar list users
export const listUsers = async (req, res) => {
  try {
     const users = await authService.listAllUsers();
     res.json(users);
  
     } catch (err) {
     res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};
