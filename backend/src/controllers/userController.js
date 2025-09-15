import * as userService from "../services/userService.js";

// Profile
export const profileUsers = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.json(user);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Server error", error: err.message });
  }
};
