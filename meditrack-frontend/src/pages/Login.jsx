import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../services/api";
import "../styles/Login.css";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Enter email & password");
      return;
    }

    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      const userRole = data.user?.role?.toLowerCase();

      // ✅ Save login
      login(data.access_token, userRole, data.user);

      navigate(
        userRole === "doctor"
          ? "/doctor/dashboard"
          : "/patient/dashboard",
        { replace: true }
      );

    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* 🔥 LOGO */}
        <div style={{ textAlign: "center" }}>
          <img 
            src="/logo.png" 
            alt="DocConnect"
            style={{ height: "80px", marginBottom: "10px" }}
          />
        </div>

        <h2>DocConnect Login</h2>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>

          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              type="text"
              placeholder="Enter email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group password-group">
            <span className="input-icon">🔒</span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </span>
          </div>

          <button className="login-btn" disabled={loading}>
            {loading ? "Logging..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;