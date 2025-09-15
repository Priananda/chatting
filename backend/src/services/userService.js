import User from "../models/authUser.js";

// Profile
// Get data user berdasarkan ID
export const getUserProfile = async (userId) => {
  
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw { status: 404, message: "User tidak ditemukan" };
  }

  return user;
};
