import { useState } from "react";
import BaseApi from "../../api/BaseApi";
import Button from "../../components/Button";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const clickChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await BaseApi.post("/users/register", form);
      setSuccess(response.data.message);
      setForm({ username: "", email: "", password: "" });
    } catch (error) {
      setError(error.response?.data?.message || "Terjadi kesalahan saat register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      <form onSubmit={registerSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={ clickChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={ clickChange}
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
          {loading ? "Loading..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
