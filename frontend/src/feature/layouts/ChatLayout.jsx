import { useState } from "react";
import ProfileUser from "../profile/ProfileUser";
import ChatList from "../chat/ChatList";
import ChatBox from "../chat/ChatBox";

const ChatLayout = () => {
  const [selectedUser, setSelectedUser] = useState(null);
return (
  <div className="flex flex-col md:flex-row min-h-screen">
    {/* Sidebar kiri */}
    <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-300 flex flex-col">
      {/* Profil akun sendiri */}
      <div>
        <ProfileUser />
      </div>

      {/* Daftar chat */}
      <div className="flex-1 overflow-y-auto">
        <ChatList onSelect={setSelectedUser} />
      </div>
    </div>

    {/* Area kanan - ChatBox */}
    <div className="w-full md:flex-1 p-2 flex flex-col">
      {selectedUser ? (
        <ChatBox partner={selectedUser} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p className="text-base md:text-lg">Pilih pengguna untuk memulai chat</p>
        </div>
      )}
    </div>
  </div>
);

};

export default ChatLayout;
