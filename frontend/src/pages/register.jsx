import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaDumbbell,
  FaUserFriends,
  FaIdCard,
  FaShieldAlt,
  FaUserCircle,
} from "react-icons/fa";
import "../styles/register/register.css";
import { useSignup } from "../hooks/useSignup";

export default function Register() {
  const [role, setRole] = useState("client");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const { signup, error, isLoading } = useSignup();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const success = await signup(
      formData.name,
      formData.email,
      formData.phone,
      formData.password,
      role
    );
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="register-page">
      <div className="auth-container">
        <div className="auth-card register-card">
          <div className="register-header">
            <h2>Start Your Fitness Journey</h2>
            <p>
              Join GymHub to connect with the best gyms and trainers in Sri
              Lanka
            </p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-section">
              <div className="section-title">
                <FaIdCard />
                <span>Choose Your Role</span>
              </div>
              <div className="role-grid">
                {["client", "gym_owner", "trainer"].map((r) => (
                  <label
                    key={r}
                    className={`role-option ${role === r ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={role === r}
                      onChange={() => setRole(r)}
                    />
                    <div className="role-content">
                      <div className="role-icon">
                        {r === "client" ? (
                          <FaUserCircle />
                        ) : r === "gym_owner" ? (
                          <FaDumbbell />
                        ) : (
                          <FaUserFriends />
                        )}
                      </div>
                      <div className="role-title">
                        {r === "client"
                          ? "Fitness Enthusiast"
                          : r === "gym_owner"
                          ? "Gym Owner"
                          : "Personal Trainer"}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="register-section">
              <div className="section-title">
                <FaUser />
                <span>Personal Information</span>
              </div>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="register-section">
              <div className="section-title">
                <FaShieldAlt />
                <span>Security</span>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            <button type="submit">
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
