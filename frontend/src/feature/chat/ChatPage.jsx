// ChatPage.jsx
import { useState } from "react";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";
import ProfileUser from "../profile/ProfileUser";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar kiri */}
      <div className="w-1/3 border-r flex flex-col">
        {/* Profil akun sendiri */}
        <div className="p-4 border-b">
          <ProfileUser />
        </div>

        {/* Daftar chat */}
        <div className="flex-1 overflow-y-auto">
          <ChatList onSelect={setSelectedUser} />
        </div>
      </div>

      {/* Area chat */}
      <div className="w-2/3">
        {selectedUser ? (
          <ChatBox partner={selectedUser} />
        ) : (
          <div className="p-4 text-gray-500">
            Pilih pengguna untuk memulai chat
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
