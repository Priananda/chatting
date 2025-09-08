

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Pasang interceptor untuk tambah token ke header Authorization
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token_pengguna"); // ambil token dari localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
