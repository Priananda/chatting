import User from "../models/authUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Registrasi
export const register = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw { status: 400, message: "Semua wajib diisi" };
  }

  const alreadyEmail = await User.findOne({ email });
  if (alreadyEmail) {
    throw { status: 409, message: "Email sudah digunakan" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({ username, email, password: hashedPassword });
  const savedUser = await newUser.save();

  return savedUser.toJSON();
};

// Login
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { status: 401, message: "Email tidak ditemukan" };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw { status: 401, message: "Password salah" };
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  return {
    token,
    user: user.toJSON(),
  };
};

// Daftar semua users
export const listAllUsers = async () => {
  const users = await User.find().select("username email");
  return users.map(u => u.toJSON());
};
