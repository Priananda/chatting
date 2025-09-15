import { useState } from "react";
import ProfileUser from "../profile/ProfileUser";
import ChatList from "../chat/ChatList";
import ChatBox from "../chat/ChatBox";

const ChatLayout = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* Sidebar kiri - daftar chat + profil */}
      <div
        className={`absolute md:relative w-full md:w-1/4 h-full bg-white z-20 transition-transform duration-300 ease-in-out
          ${selectedUser ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
        `}
      >
        <div>
          <ProfileUser />
        </div>
        <div>
          <ChatList onSelect={setSelectedUser} />
        </div>
      </div>

      {/* ChatBox area */}
      <div
        className={`absolute md:relative w-full md:w-3/4 h-full bg-white transition-transform duration-300 ease-in-out
          ${selectedUser ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        {selectedUser ? (
          <ChatBox
            partner={selectedUser}
            onBack={() => setSelectedUser(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 h-full">
            <p className="text-base md:text-lg">
              Pilih pengguna untuk memulai chat
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
