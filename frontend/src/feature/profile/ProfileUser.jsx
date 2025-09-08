// src/components/ProfileUser.jsx
import React, { useEffect, useState } from "react";
import BaseApi from "../../api/BaseApi"; // pastikan path sesuai

// Fungsi getProfile API
const getProfile = async () => {
  const token = localStorage.getItem("token_pengguna");
  if (!token) throw new Error("Token tidak ditemukan");

  const response = await BaseApi.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const ProfileUser = () => {
  const [user, setUser] = useState(null);     // Simpan data user
  const [error, setError] = useState(null);   // Simpan error
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (_err) {
  console.error(_err); // pakai supaya ESLint gak complain
  setError("Gagal mengambil data profile");

      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!user) return <p className="text-center mt-10">User tidak ditemukan</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profil Pengguna</h2>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">Username:</span> {user.username}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Dibuat pada:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ProfileUser;
