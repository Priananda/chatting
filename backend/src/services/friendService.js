import User from "../models/authUser.js";

// Tambah teman
export const addFriendService = async (userId, friendIdentifier) => {
  const friend = await User.findOne({
    $or: [
      { email: friendIdentifier },
      { username: friendIdentifier },
      { phone: friendIdentifier }
    ]
  });

  if (!friend) throw { status: 404, message: "User tidak ditemukan" };
  if (friend._id.toString() === userId) {
    throw { status: 400, message: "Tidak bisa add diri sendiri" };
  }

  const user = await User.findById(userId);
  if (!user) throw { status: 404, message: "User tidak ditemukan" };

  if (user.friends.includes(friend._id)) {
    throw { status: 400, message: "Sudah jadi teman" };
  }

  user.friends.push(friend._id);
  await user.save();

  return {
    message: "Teman berhasil ditambahkan",
    friend: friend.toJSON(),
  };
};

// Ambil daftar teman
export const getFriendsService = async (userId) => {
  const user = await User.findById(userId).populate("friends", "username email phone");
  if (!user) throw { status: 404, message: "User tidak ditemukan" };

  // langsung return array JSON
  return user.friends.map(f => f.toJSON());
};
