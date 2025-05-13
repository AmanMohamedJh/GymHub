import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaShieldAlt,
} from "react-icons/fa";
import "../../styles/register/register.css";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";

const API_BASE_URL = "http://localhost:4000/api/admin";

const EditProfileSetting = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        if (!user?.token) {
          throw new Error("No authentication token available");
        }
        const response = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          password: "", // Password is not pre-filled for security
        });
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch user profile"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (!user?.token) {
        throw new Error("No authentication token available");
      }
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      await axios.put(`${API_BASE_URL}/users/profile`, updateData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update user profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card register-card">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error && <p className="error-message">{error}</p>}
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-section">
              <div className="section-title">
                <FaUser />
                <span>Personal Information</span>
              </div>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  className="input-field-register"
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
                  placeholder="Enter new password (optional)"
                />
              </div>
            </div>

            <button
              disabled={isSubmitting || isLoading}
              className="btn-primary"
              type="submit"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default EditProfileSetting;