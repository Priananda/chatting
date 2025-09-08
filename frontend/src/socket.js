import { io } from "socket.io-client";

const socket = io("http://localhost:8000"); // ganti dengan URL backend kamu
export default socket;
