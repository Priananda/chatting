import { useEffect, useState } from "react";
import socket from "../../socket.io/socket";
import {
  fetchMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
} from "../../services/chatBoxService";

const ChatBox = ({ partner }) => {
  const me = JSON.parse(localStorage.getItem("pengguna"));
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);

  useEffect(() => {
    socket.emit("join", me.id);

    const loadMessages = async () => {
      try {
        const data = await fetchMessages(me.id, partner.id);
        setMessages(data);
      } catch (error) {
        console.error("Gagal menunggu pesan:", error);
      }
    };

    loadMessages();

    const handleReceiveMessage = (msg) => {
      if (msg.senderId === partner.id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleUpdateMessage = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg))
      );
    };

    const handleDeleteMessage = (deletedMsg) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === deletedMsg._id ? { ...msg, message: "[Pesan dihapus]" } : msg
        )
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("update_message", handleUpdateMessage);
    socket.on("delete_message", handleDeleteMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("update_message", handleUpdateMessage);
      socket.off("delete_message", handleDeleteMessage);
    };
  }, [partner, me.id]);


  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    if (editingMessageId) {
      try {
        const updatedMsg = await updateMessage(editingMessageId, messageInput);
        setMessages((prev) =>
          prev.map((msg) => (msg._id === editingMessageId ? updatedMsg : msg))
        );
        socket.emit("update_message", updatedMsg);
        setEditingMessageId(null);
        setMessageInput("");
      } catch (error) {
        console.error("Gagal update pesan", error);
      }
      return;
    }

    try {
      const newMsg = await sendMessage(me.id, partner.id, messageInput);
      setMessages((prev) => [...prev, newMsg]);
      socket.emit("send_message", newMsg);
      setMessageInput("");
    } catch (error) {
      console.error("Gagal kirim pesan", error);
    }
  };

  const handleStartEditingMessage = (msg) => {
    setEditingMessageId(msg._id);
    setMessageInput(msg.message);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, message: "[Pesan dihapus]" } : msg
        )
      );
      socket.emit("delete_message", {
        _id: messageId,
        senderId: me.id,
        receiverId: partner.id,
      });
    } catch (error) {
      console.error("Gagal hapus pesan", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token_pengguna");
    localStorage.removeItem("pengguna");
    window.location.href = "/login";
  };

  return (
  <div className="flex flex-col h-screen bg-gray-100">
    {/* Header */}
    <header className="p-4 px-6 bg-white shadow flex justify-between items-center border-b">
      <span className="text-lg font-semibold text-gray-800 truncate">
        {partner.username}
      </span>
      <button
        onClick={handleLogout}
        className="text-sm text-red-500 hover:underline"
      >
        Keluar
      </button>
    </header>

    {/* Chat Messages */}
    <main className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
      {messages.map((msg, i) => (
       <div
  key={msg._id || i}
  className={`group relative max-w-xs md:max-w-md lg:max-w-lg break-words p-3 rounded-xl shadow-sm ${
    msg.senderId === me.id
      ? "ml-auto bg-blue-500 text-white"
      : "mr-auto bg-white text-gray-800"
  }`}
>
  <p>{msg.message}</p>

  {/* Tombol Edit & Delete */}
  {msg.senderId === me.id && (
    <div className="absolute -top-2 -right-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 bg-white rounded shadow p-1">
      <button
        onClick={() => handleStartEditingMessage(msg)}
        className="hover:scale-110"
      >
        ✏️
      </button>
      <button
        onClick={() => handleDeleteMessage(msg._id)}
        className="hover:scale-110"
      >
        🗑️
      </button>
    </div>
  )}
</div>

      ))}
    </main>

    {/* Footer - Input Chat */}
    <footer className="p-4 bg-white border-t shadow flex gap-2 items-center">
      <input
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Tulis pesan..."
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSendMessage();
        }}
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
      >
        Kirim
      </button>
    </footer>
  </div>
);

};

export default ChatBox;
