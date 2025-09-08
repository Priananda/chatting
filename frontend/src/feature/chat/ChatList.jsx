import { useEffect, useState } from "react";
import BaseApi from "../../api/BaseApi";  

const ChatList = ({ onSelect }) => {
  const [users, setUsers] = useState([]);
  const me = JSON.parse(localStorage.getItem("pengguna"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await BaseApi.get("/users/list");
        // Filter agar user sendiri tidak muncul di list
        const otherUsers = response.data.filter(user => user.id !== me.id);
        setUsers(otherUsers);
      } catch (error) {
        console.error("Gagal mengambil daftar pengguna:", error);
      }
    };
    fetchUsers();
  }, [me.id]);

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-4">Daftar Chat</h2>
      {users.length === 0 ? (
        <p>Tidak ada pengguna lain.</p>
      ) : (
        users.map(user => (
          <div
            key={user.id}
            onClick={() => onSelect(user)}
            className="cursor-pointer p-2 border-b hover:bg-gray-100"
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                onSelect(user);
              }
            }}
          >
            {user.username} ({user.email})
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;
