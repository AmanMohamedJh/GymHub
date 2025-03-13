import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../styles/Login/login.css";
import Navbar from "../Components/Common/Navbar";
import Footer from "../Components/Common/footer";

export default function Login() {
  return (
    <div className="login-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue your fitness journey</p>
          </div>

          <form className="auth-form">
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
                  name="email"
                  id="email"
                  required
                  className="input-field"
                  placeholder="you@example.com"
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
                  name="password"
                  id="password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="form-options">
              <div className="checkbox-group">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="custom-checkbox"
                />
                <label htmlFor="remember-me" className="checkbox-label">
                  Remember me
                </label>
              </div>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-primary auth-submit">
              Sign In
            </button>

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
      <Footer />
    </div>
  );
}
