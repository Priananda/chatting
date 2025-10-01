import { addFriendService, getFriendsService } from "../services/friendService.js";

export const addFriend = async (req, res) => {
  try {
    const { friendIdentifier } = req.body;
    const userId = req.user.id;

    const result = await addFriendService(userId, friendIdentifier);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Gagal menambahkan teman" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const friends = await getFriendsService(req.user.id);
    res.json(friends);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Gagal ambil daftar teman" });
  }
};
