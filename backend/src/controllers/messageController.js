import * as messageService from "../services/messageService.js";

// Create
export const createMessage = async (req, res) => {
  try {
    const newMessage = await messageService.createMessage(req.body);
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Server error saat membuat pesan" });
  }
};

// Read
export const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await messageService.getMessages(user1, user2);
    res.status(200).json(messages);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Server error saat mengambil pesan" });
  }
};

// Update
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const updatedMessage = await messageService.updateMessage(id, message);
    res.status(200).json(updatedMessage);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Server error saat memperbarui pesan" });
  }
};

// Delete
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await messageService.deleteMessage(id);
    res.status(200).json({ success: true, deletedMessage });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Server error saat menghapus pesan" });
  }
};
