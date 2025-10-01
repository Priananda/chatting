import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import socket from "../../socket.io/socket";
import { logout } from "../../store/authSlice";
import { fetchMessages, sendMessage, updateMessage, deleteMessage } from "../../services/chatBoxService";
import bgBatik from "../../assets/images/bg-batik.jpg";

const ChatBox = ({ partner, onBack }) => {
  const me = JSON.parse(localStorage.getItem("pengguna"));
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [showArrow, setShowArrow] = useState(false);
  const lastMessages = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setShowArrow(window.innerWidth < 800);
    window.addEventListener("resize", () => setShowArrow(window.innerWidth < 800));
    return () => window.removeEventListener("resize", () => setShowArrow(window.innerWidth < 800));
  }, []);

  const scrollPageBottom = () => lastMessages.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollPageBottom, [messages]);

  useEffect(() => {
    socket.emit("join", me.id);

    const loadMessages = async () => {
      try {
        const data = await fetchMessages(me.id, partner.id);
        setMessages(data);
      } catch (error) {
        console.error("Gagal load pesan:", error);
      }
    };

    loadMessages();

    const handleReceiveMessage = (msg) => {
      if (msg.senderId === partner.id) setMessages(prev => [...prev, msg]);
    };
    const handleUpdateMessage = (updatedMsg) => setMessages(prev => prev.map(msg => msg.id === updatedMsg.id ? updatedMsg : msg));
    const handleDeleteMessage = (deletedMsg) => setMessages(prev => prev.map(msg => msg.id === deletedMsg.id ? { ...msg, message: "Pesan dihapus" } : msg));

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
      const updatedMsg = await updateMessage(editingMessageId, messageInput);
      setMessages(prev => prev.map(msg => msg.id === editingMessageId ? updatedMsg : msg));
      socket.emit("update_message", updatedMsg);
      setEditingMessageId(null);
      setMessageInput("");
      return;
    }

    const newMsg = await sendMessage(me.id, partner.id, messageInput);
    setMessages(prev => [...prev, newMsg]);
    socket.emit("send_message", newMsg);
    setMessageInput("");
  };

  const handleStartEditingMessage = (msg) => {
    setEditingMessageId(msg.id);
    setMessageInput(msg.message);
  };

  const handleDeleteMessageClick = async (messageId) => {
    await deleteMessage(messageId);
    setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, message: "Pesan dihapus" } : msg));
    socket.emit("delete_message", { id: messageId, senderId: me.id, receiverId: partner.id });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundImage: `url(${bgBatik})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <header className="p-4 bg-white flex justify-between items-center w-full z-10">
        <div className="flex items-center space-x-2">
          {showArrow && <button onClick={onBack} className="text-lg font-semibold text-gray-800 hover:text-gray-600">←</button>}
          <span className="text-md font-semibold text-black">{partner.username}</span>
        </div>
        <button onClick={handleLogout} className="text-md text-red-500 hover:text-red-400 cursor-pointer">Keluar</button>
      </header>

      <main className="flex-1 px-3 py-3 space-y-3 overflow-x-auto">
        {messages.map((msg, i) => (
          <div key={msg.id || i} className={`group relative p-3 max-w-40 md:max-w-md break-words text-md rounded-md shadow-md ${msg.senderId === me.id ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-white text-gray-800"}`}>
            <p>{msg.message}</p>
            {msg.senderId === me.id && (
              <div className="absolute flex p-1 space-x-1 -top-1 -right-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded shadow bg-white">
                <button onClick={() => handleStartEditingMessage(msg)} className="cursor-pointer">✏️</button>
                <button onClick={() => handleDeleteMessageClick(msg.id)} className="cursor-pointer">🗑️</button>
              </div>
            )}
          </div>
        ))}
        <div ref={lastMessages} />
      </main>

      <footer className="p-4 flex items-center gap-3 bg-white">
        <input
          className="flex-1 placeholder:text-md placeholder:text-gray-500  border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Tulis pesan..."
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage} className="px-4 py-2 text-md bg-blue-600 text-white rounded-md hover:bg-blue-500 transition">Kirim</button>
      </footer>
    </div>
  );
};

export default ChatBox;
