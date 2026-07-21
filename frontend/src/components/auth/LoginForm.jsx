import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await API.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Login
      </h1>

      <input
        type="email"
        placeholder="Email"
        className="border w-full p-3 rounded-xl mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border w-full p-3 rounded-xl mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="text-red-500 text-sm mb-4">
          {error}
        </p>
      )}

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default LoginForm;