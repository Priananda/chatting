import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearMessages } from "../../store/authSlice";
import Button from "../../components/Button";

const Register = () => {
  const dispatch = useDispatch();
  const {success, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "" 
  });

  const handleChange = (e) => {
    dispatch(clearMessages());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setForm({ username: "", email: "", password: "" });
      }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Kata Sandi"
          value={form.password}
          onChange={handleChange}
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
