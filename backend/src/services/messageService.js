import Message from "../models/Message.js";

// Create
export const createMessage = async ({ senderId, receiverId, message }) => {
  return await Message.create({ senderId, receiverId, message });
};

// Read
export const getMessages = async (user1, user2) => {
  return await Message.find({
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 }
    ]
  }).sort({ createdAt: 1 });
};

// Update
export const updateMessage = async (id, message) => {
  const updatedMessage = await Message.findByIdAndUpdate(id, { message }, { new: true });

  if (!updatedMessage) {
    throw { status: 404, message: "Pesan tidak ditemukan pada saat perbarui data" };
  }
  return updatedMessage;
};

// Delete
export const deleteMessage = async (id) => {
  const deletedMessage = await Message.findByIdAndDelete(id);

  if (!deletedMessage) {
    throw { status: 404, message: "Pesan tidak ditemukan pada saat hapus data" };
  }
  return deletedMessage;
};
