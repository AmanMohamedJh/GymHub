import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useProfile } from "../../hooks/useProfile";
import { FaUser, FaKey, FaEdit, FaTrash, FaCamera } from "react-icons/fa";
import "./Styles/OwnerProfile.css";

const OwnerProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const {
    getProfile,
    updateProfile,
    updatePassword,
    deleteAccount,
    isLoading,
    error,
  } = useProfile();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePicture: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getProfile();
      if (data) {
        setProfileData({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          profilePicture: data.profilePicture || "",
        });
      }
    };
    if (user) {
      loadProfile();
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // here we have to select the image for the 5MB limit for that we installed multer package
        setUpdateError("Image size should be less than 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);

    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    formData.append("phone", profileData.phone);
    if (selectedImage) {
      formData.append("profilePicture", selectedImage);
    }

    const response = await updateProfile(formData);
    if (response) {
      setIsEditing(false);
      setSelectedImage(null);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);

    // Password validation  //it is easier to validate like this //aman
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      setUpdateError(
        "Password must contain at least 8 characters, including uppercase, lowercase, number and special character"
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setUpdateError("New passwords don't match!");
      return;
    }

    try {
      const response = await updatePassword({
        newPassword: passwordData.newPassword,
      });

      if (response) {
        setPasswordData({
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
        setSuccessMessage("Password updated successfully!");

        // Clear success message after 3 seconds the timing will be done after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (error) {
      setUpdateError(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    const response = await deleteAccount();
    if (response) {
      navigate("/");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="owner-profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-picture-container">
            <img
              src={
                profileData.profilePicture || "https://via.placeholder.com/150" //placeholder is linked to a website product/image
              }
              alt="Profile"
              className="profile-picture"
            />
            {isEditing && (
              <div className="profile-picture-upload">
                <label htmlFor="profile-picture-input" className="upload-label">
                  <FaCamera /> Change Picture
                </label>
                <input
                  type="file"
                  id="profile-picture-input"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>
          <h1>Profile Settings</h1>
          <p>Manage your account settings and profile information</p>
        </div>

        {(error || updateError) && (
          <div className="error-message">{error || updateError}</div>
        )}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="profile-section">
          <h2>
            <FaUser /> Profile Information
          </h2>

          {!isEditing ? (
            <div className="profile-info">
              <div className="info-item">
                <label>Name:</label>
                <p>{profileData.name}</p>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <p>{profileData.email}</p>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <p>{profileData.phone}</p>
              </div>
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit /> Edit Profile
              </button>
            </div>
          ) : (
            <div className="edit-section">
              <div className="current-details">
                <h3>Current Details:</h3>
                <div className="info-item">
                  <label>Name:</label>
                  <p>{profileData.name}</p>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <p>{profileData.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone:</label>
                  <p>{profileData.phone}</p>
                </div>
              </div>
              <form className="edit-form" onSubmit={handleProfileSubmit}>
                <h3>Update Details:</h3>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="button-group">
                  <button
                    type="submit"
                    className="save-button"
                    disabled={isLoading}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h2>
            <FaKey /> Password Management
          </h2>
          {!showPasswordForm ? (
            <button
              className="change-password-button"
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </button>
          ) : (
            <form className="password-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                  placeholder="Min 8 chars: uppercase, lowercase, number, special char"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                  placeholder="Re-enter your new password"
                />
              </div>
              <div className="button-group">
                <button
                  type="submit"
                  className="save-button"
                  disabled={isLoading}
                >
                  Update Password
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setUpdateError(null);
                    setPasswordData({
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-section danger-zone">
          <h2>
            <FaTrash /> Delete Account
          </h2>
          {!showDeleteConfirm ? (
            <button
              className="delete-account-button"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </button>
          ) : (
            <div className="delete-confirm">
              <p>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="button-group">
                <button
                  className="confirm-delete-button"
                  onClick={handleDeleteConfirm}
                  disabled={isLoading}
                >
                  Yes, Delete My Account
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
