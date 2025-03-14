import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../styles/Login/login.css";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        <div className="auth-card card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue your fitness journey</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-group">
                <div className="input-icon">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <div className="input-icon">
                  <FaLock />
                </div>
                <input
                  type="password"
                  id="password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
            {error && <div className="error-message">{error}</div>}
            <div className="auth-footer">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="auth-link">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
