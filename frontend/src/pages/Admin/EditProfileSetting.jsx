import React, { useState, useEffect } from "react";
import {
  FaDumbbell,
  FaIdCard,
  FaLock,
  FaShieldAlt,
  FaUser,
  FaUserCircle,
  FaUserFriends,
} from "react-icons/fa";
import "../../styles/register/register.css";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// Fetch current user profile
const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assumes token is stored in localStorage
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile"
    );
  }
};

// Update user profile
const updateUserProfile = async (data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/profile`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update user profile"
    );
  }
};

const useToast = () => {
  return {
    toast: ({ title, description, variant }) => {
      console.log(`Toast: ${title} - ${description} ${variant || ""}`);
    },
  };
};

const EditProfileSetting = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await getUserProfile();
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          password: "", // Password is not pre-filled for security
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description:
            error instanceof Error ? error.message : "An unknown error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Only send fields that have values (exclude empty password if unchanged)
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      await updateUserProfile(updateData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description:
          error instanceof Error ? error.message : "Failed to update profile.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card register-card">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
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
      )}
    </div>
  );
};

export default EditProfileSetting;