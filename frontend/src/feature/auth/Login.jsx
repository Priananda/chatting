import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearMessages } from "../../store/authSlice";
import Button from "../../components/Button";

const Login = () => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ 
    email: "", 
    password: "" });

  const handleChange = (e) => {
    dispatch(clearMessages());
    setForm({ ...form, [[e.target.name]]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          {loading ? "Loading..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
