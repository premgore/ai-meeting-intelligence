import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      login(data.access_token);

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Invalid Credentials"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: 400,
        background: "#fff",
        padding: 30,
        borderRadius: 10,
        boxShadow: "0 10px 40px rgba(0,0,0,.08)",
      }}
    >
      <h2>AI Meeting Intelligence</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}