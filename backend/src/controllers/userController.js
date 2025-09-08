import * as userService from "../services/userService.js";

// MeData
export const meData = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.json(user);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Server error", error: err.message });
  }
};
