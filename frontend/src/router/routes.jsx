import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Login = lazy(() => import("../feature/auth/Login"));
const Register = lazy(() => import("../feature/auth/Register"));
const ChatLayout = lazy(() => import("../feature/layouts/ChatLayout"));
const ProfileUser = lazy(() => import("../feature/profile/ProfileUser"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading..........</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatLayout />} />
        <Route path="/profile" element={<ProfileUser />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
