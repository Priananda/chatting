import User from "../models/authUser.js";

// Profile
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { status: 404, message: "User tidak ditemukan" };
  }

  return user.toJSON();
};
