import { useEffect, useState } from "react";
import BaseApi from "../../api/BaseApi";  

const ChatList = ({ onSelect }) => {
  const [users, setUsers] = useState([]);
  const me = JSON.parse(localStorage.getItem("pengguna"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await BaseApi.get("/users/list");
        const otherUsers = response.data.filter(user => user.id !== me.id);
        setUsers(otherUsers);
      } catch (err) {
        console.error("Gagal mengambil daftar pengguna pada list chat", err);
      }
    };
    fetchUsers();
  }, [me.id]);

  return (
    <div className="p-5">
      <h2 className="mb-3 font-bold text-lg">Daftar Chat</h2>
      {users.length === 0 ? (
        <p>Tidak ada lawan chat.</p>
      ) : (
        users.map(user => (
          <div
            key={user.id}
            onClick={() => onSelect(user)}
            className="cursor-pointer text-md  p-2 border-b border-gray-400 hover:bg-gray-100"
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                onSelect(user);
              }
            }}
          >
            {user.username} 
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;
