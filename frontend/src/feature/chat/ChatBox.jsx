import BaseApi from "../../api/BaseApi";
import { useEffect, useState } from "react";
import socket from "../../socket";

const ChatBox = ({ partner }) => {
  const me = JSON.parse(localStorage.getItem("pengguna"));
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);

  // Fetch messages & setup socket listeners
  useEffect(() => {
    socket.emit("join", me.id);

    const loadMessages = async () => {
      try {
        const response = await BaseApi.get(`/messages/${me.id}/${partner.id}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to load messages:", error);
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

    // Cleanup listeners on unmount or partner change
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("update_message", handleUpdateMessage);
      socket.off("delete_message", handleDeleteMessage);
    };
  }, [partner, me.id]);

  // Send new message or update existing one
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    if (editingMessageId) {
      try {
        const response = await BaseApi.put(`/messages/${editingMessageId}`, {
          message: messageInput,
        });
        setMessages((prev) =>
          prev.map((msg) => (msg._id === editingMessageId ? response.data : msg))
        );
        socket.emit("update_message", response.data);
        setEditingMessageId(null);
        setMessageInput("");
      } catch (error) {
        console.error("Failed to update message:", error);
      }
      return;
    }

    try {
      const response = await BaseApi.post("/messages", {
        senderId: me.id,
        receiverId: partner.id,
        message: messageInput,
      });
      setMessages((prev) => [...prev, response.data]);
      socket.emit("send_message", response.data);
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Start editing a message
  const startEditingMessage = (msg) => {
    setEditingMessageId(msg._id);
    setMessageInput(msg.message);
  };

  // Delete a message
  const handleDeleteMessage = async (messageId) => {
    try {
      await BaseApi.delete(`/messages/${messageId}`);
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
      console.error("Failed to delete message:", error);
    }
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("token_pengguna");
    localStorage.removeItem("pengguna");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b font-bold flex justify-between items-center">
        <span>Chat dengan {partner.username}</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-3 py-3 rounded hover:bg-red-600"
        >
          Keluar
        </button>
      </header>

      <main className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div
            key={msg._id || i}
            className={`p-2 rounded relative group ${
              msg.senderId === me.id ? "bg-blue-200 text-right ml-auto" : "bg-gray-200"
            } max-w-xs`}
          >
            <p>{msg.message}</p>
            {msg.senderId === me.id && (
              <div className="absolute top-0 right-0 p-1 text-xs hidden group-hover:flex space-x-1">
                <button onClick={() => startEditingMessage(msg)}>✏️</button>
                <button onClick={() => handleDeleteMessage(msg._id)}>🗑️</button>
              </div>
            )}
          </div>
        ))}
      </main>

      <footer className="p-4 flex border-t">
        <input
          className="flex-1 border p-2 rounded mr-2"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Tulis pesan..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Kirim
        </button>
      </footer>
    </div>
  );
};

export default ChatBox;
