import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFriends, addFriend, clearFriendMessage} from "../../store/friendSlice";

const ChatList = ({ onSelect }) => {
  const [friendInput, setFriendInput] = useState("");

  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { list: friends, message} = useSelector((state) => state.friend);
  
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFriends(token));
    }
  }, [user, token, dispatch]);

  const handleAddFriend = () => {
    if (!friendInput.trim()) return;
    dispatch(addFriend({ friendIdentifier: friendInput, token }))
      .unwrap()
      .then(() => {
        dispatch(fetchFriends(token)); // refresh daftar teman
        setFriendInput("");
      });
  };

  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => {
      dispatch(clearFriendMessage());
    }, 4000);

    return () => clearTimeout(timer);
  }
}, [message, dispatch]);


  return (
    <div className="p-4 mt-2">
      <h2 className="mb-5 text-black font-bold text-lg">Daftar Chat</h2>

      <div className="mb-3 flex items-center">
        <input
          type="text"
          value={friendInput}
          onChange={(e) => setFriendInput(e.target.value)}
          placeholder="Username / Email"
          className="flex-1 p-2 placeholder:text-md placeholder:text-gray-500  border border-gray-300  focus:outline-none rounded-md mr-2 "
        />
        <button
          onClick={handleAddFriend}
          className="bg-blue-600 text-md px-3 py-2 text-white rounded-md"
        >
          +
        </button>
      </div>

{message && <p className="text-sm text-green-600 mb-2">{message}</p>}
  
      {friends.length === 0 ? (
        <p className="text-gray-500">Belum ada teman.</p>
      ) : (
        friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => onSelect(friend)}
            className="p-2 cursor-pointer text-black text-md border-b border-gray-300 hover:bg-blue-50"
          >
            {friend.username} 
            {/* ({friend.email}) */}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;
