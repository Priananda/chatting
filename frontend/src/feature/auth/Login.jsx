import { useState } from "react";
import BaseApi from "../../api/BaseApi";
import Button from "../../components/Button";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const clickChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await BaseApi.post("/users/login", form);

      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem("token_pengguna", token);
      localStorage.setItem("pengguna", JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email
      }));


      console.log("Login sukses:", response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={loginSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={clickChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Kata Sandi"
          value={form.password}
          onChange={clickChange}
          className="w-full p-2 border rounded"
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
