import { useEffect, useState } from "react";
import userProfile from "../../services/profileService";

const ProfileUser = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userProfile();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data profile");
      } 
    };

    fetchProfile();
  }, []);

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!user) return <p className="text-center mt-10">User tidak ditemukan</p>;

  return (
  <div className="p-4 mt-2 flex items-center space-x-3">
    <div className="w-10 h-10 flex items-center justify-center font-semibold text-xl bg-blue-200 text-gray-500 rounded-full">
      {user.username.charAt(0).toUpperCase()}
    </div>
    <h2 className="text-lg text-black font-medium">{user.username}</h2>
  </div>
);
};

export default ProfileUser;
