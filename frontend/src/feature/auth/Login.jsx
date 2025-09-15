import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, clearMessages } from "../../store/authSlice";
import Button from "../../components/Button";
import bgBatik from "../../assets/images/bg-batik.jpg";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    global: "",
    email: "",
    password: "",
  });

  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) errorMsg = "Email wajib diisi.";
      else if (!emailRegex.test(value))
        errorMsg = "Harap masukan email dengan lengkap.";
      else if (value.toLowerCase().endsWith(".co"))
        errorMsg = "Email dengan domain .co tidak diperbolehkan.";
    }

    if (name === "password") {
      if (!value) errorMsg = "Password wajib diisi.";
      else if (value.length < 6) errorMsg = "Minimal 6 karakter.";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(clearMessages());

    setCredentials({ ...credentials, [name]: value });
    validateField(name, value); // validasi langsung
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setErrors((prev) => ({
        ...prev,
        global: "Silakan isikan semua bidang.",
      }));
      return;
    }

    if (errors.email || errors.password) {
      setErrors((prev) => ({
        ...prev,
        global: "Periksa kembali isian Anda.",
      }));
      return;
    }

    try {
      setLoading(true);
      await dispatch(loginUser(credentials)).unwrap();
      setLoading(false);
      navigate("/chat");
    } catch (err) {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        global: err?.message || "Login gagal, periksa email & password.",
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3"
       style={{
         backgroundImage: `url(${bgBatik})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-black mt-1 mb-10 text-center">
          Login
        </h2>

        {errors.global && (
          <p className="text-center text-sm text-red-500 mb-4">{errors.global}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Masukan Email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full text-md px-4 py-2 border border-slate-300 rounded-md focus:outline-none"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Masukan Password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full text-md px-4 py-2 border border-slate-300 rounded-md focus:outline-none"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-sm text-blue-500 hover:text-blue-400 hover:underline transition"
          >
            Daftar akun
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
