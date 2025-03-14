import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaDumbbell,
  FaUserFriends,
  FaIdCard,
  FaShieldAlt,
  FaUserCircle,
} from "react-icons/fa";
import "../styles/register/register.css";
import Navbar from "../Components/Common/Navbar";
import Footer from "../Components/Common/footer";

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

  const roles = [
    {
      id: "client",
      label: "Fitness Enthusiast",
      icon: <FaUserCircle className="w-8 h-8" />,
      description: "Join to find gyms and trainers",
    },
    {
      id: "gym_owner",
      label: "Gym Owner",
      icon: <FaDumbbell className="w-8 h-8" />,
      description: "List and manage your gym",
    },
    {
      id: "trainer",
      label: "Personal Trainer",
      icon: <FaUserFriends className="w-8 h-8" />,
      description: "Offer training services",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
  };

  return (
    <>
      <main className="register-page">
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
              {/* Role Selection Section */}
              <div className="register-section">
                <div className="section-title">
                  <FaIdCard />
                  <span>Choose Your Role</span>
                </div>
                <div className="role-grid">
                  {roles.map((roleOption) => (
                    <label
                      key={roleOption.id}
                      className={`role-option ${
                        role === roleOption.id ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={roleOption.id}
                        checked={role === roleOption.id}
                        onChange={() => setRole(roleOption.id)}
                      />
                      <div className="role-content">
                        <div className="role-icon">{roleOption.icon}</div>
                        <div className="role-title">{roleOption.label}</div>
                        <div className="role-description">
                          {roleOption.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="register-section">
                <div className="section-title">
                  <FaUser />
                  <span>Personal Information</span>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <div className="input-group">
                      <div className="input-icon">
                        <FaUser />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="input-field"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <div className="input-group">
                      <div className="input-icon">
                        <FaPhone />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        className="input-field"
                        placeholder="+94 XX XXX XXXX"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
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
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="register-section">
                <div className="section-title">
                  <FaShieldAlt />
                  <span>Security</span>
                </div>
                <div className="form-grid">
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
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <div className="input-icon">
                        <FaLock />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                        className="input-field"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Submit Section */}
              <div className="terms-container">
                <div className="terms-checkbox">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreeToTerms: e.target.checked,
                      })
                    }
                    required
                  />
                  <label htmlFor="agreeToTerms" className="terms-text">
                    I agree to GymHub's{" "}
                    <Link to="/terms">Terms of Service</Link> and{" "}
                    <Link to="/privacy">Privacy Policy</Link>
                  </label>
                </div>
              </div>

              <button type="submit" disabled={!formData.agreeToTerms}>
                Create Account
              </button>

              <div className="login-link">
                <p>
                  Already have an account?<Link to="/login">Sign In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
