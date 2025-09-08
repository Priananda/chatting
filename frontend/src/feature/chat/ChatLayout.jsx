// src/pages/chat/ChatLayout.jsx
import ChatList from "../../feature/chat/ChatList";
import ProfileUser from "../../feature/profile/ProfileUser";
import { useState } from "react";

const ChatLayout = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar daftar chat */}
      <div className="w-1/3 border-r overflow-y-auto">
        <ChatList onSelect={setSelectedUser} />
      </div>

      {/* Konten kanan */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedUser ? (
          <div className="max-w-md">
            <h2 className="text-2xl font-bold mb-4">Profil Pengguna</h2>
            <div className="space-y-2 border p-4 rounded shadow">
              <p>
                <span className="font-semibold">Username:</span>{" "}
                {selectedUser.username}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedUser.email}
              </p>
            </div>
          </div>
        ) : (
          <ProfileUser /> // default: profil akun sendiri
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
