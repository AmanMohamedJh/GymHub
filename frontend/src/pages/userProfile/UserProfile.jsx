import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useProfile } from "../../hooks/useProfile";
import { FaUser, FaKey, FaEdit, FaTrash, FaCamera } from "react-icons/fa";
import "./UserProfile.css";
import { Link } from "react-router-dom";

const UserProfile = () => {
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
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

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
    <div className="user-profile">
      <div className="profile-content">
        <div className="profile-container">
          <div className="profile-content">
            <div className="profile-header">
              <div className="profile-picture-container">
                <img
                  src={
                    profileData.profilePicture ||
                    "/assets/images/default-profile.png"
                  }
                  alt="Profile"
                  className="profile-picture"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjFGMUYxIi8+CjxwYXRoIGQ9Ik03NSA4NUM4Ny4wNzExIDg1IDk3IDE3NS4wNzEgOTcgNjNDOTcgNTAuOTI4OSA4Ny4wNzExIDQxIDc1IDQxQzYyLjkyODkgNDEgNTMgNTAuOTI4OSA1MyA2M0M1MyA3NS4wNzExIDYyLjkyODkgODUgNzUgODVaIiBmaWxsPSIjQzRDNEM0Ii8+CjxwYXRoIGQ9Ik0xMTYgMTI3QzExNiAxMTEuNTM2IDEwMy40NjQgOTkgODggOTlINjJDNDYuNTM2IDk5IDM0IDExMS41MzYgMzQgMTI3VjE1MEgxMTZWMTI3WiIgZmlsbD0iI0M0QzRDNCIvPgo8L3N2Zz4=";
                  }}
                />
                {isEditing && (
                  <div className="profile-picture-upload">
                    <label
                      htmlFor="profile-picture-input"
                      className="upload-label"
                    >
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

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {(error || updateError) && (
              <div className="error-message">{error || updateError}</div>
            )}

            <div className="profile-section">
              <div className="section-header">
                <FaUser /> Personal Information
                {!isEditing && (
                  <button
                    className="edit-button"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit /> Edit
                  </button>
                )}
              </div>

              <div className="profile-form-container">
                <form onSubmit={handleProfileSubmit}>
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>

                  {isEditing && (
                    <div className="button-group">
                      <button type="submit" className="save-button">
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedImage(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>

                {isEditing && (
                  <div className="form-preview">
                    <h3 className="preview-title">Preview Changes</h3>
                    <div className="preview-item">
                      <div className="preview-label">Name</div>
                      <div className="preview-value">{profileData.name}</div>
                    </div>
                    <div className="preview-item">
                      <div className="preview-label">Email</div>
                      <div className="preview-value">{profileData.email}</div>
                    </div>
                    <div className="preview-item">
                      <div className="preview-label">Phone</div>
                      <div className="preview-value">
                        {profileData.phone || "Not provided"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-section">
              <div className="section-header">
                <FaKey /> Password
                {!showPasswordForm && (
                  <button
                    className="edit-button"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    <FaEdit /> Change Password
                  </button>
                )}
              </div>

              {showPasswordForm && (
                <div className="profile-form-container">
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                      <label>New Password:</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Confirm New Password:</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    <div className="button-group">
                      <button type="submit" className="save-button">
                        Update Password
                      </button>
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => {
                          setShowPasswordForm(false);
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

                  <div className="form-preview">
                    <h3 className="preview-title">Password Requirements</h3>
                    <div className="preview-item">
                      <div className="preview-label">Minimum Length</div>
                      <div className="preview-value">8 characters</div>
                    </div>
                    <div className="preview-item">
                      <div className="preview-label">Must Include</div>
                      <div className="preview-value">
                        • Uppercase letter
                        <br />
                        • Lowercase letter
                        <br />
                        • Number
                        <br />• Special character (@$!%*?&)
                      </div>
                    </div>
                    <div className="preview-item">
                      <div className="preview-label">Status</div>
                      <div className="preview-value">
                        {passwordData.newPassword &&
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                          passwordData.newPassword
                        )
                          ? "✅ Valid password"
                          : "❌ Does not meet requirements"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-section danger-zone">
              <div className="section-header">
                <FaTrash /> Delete Account
              </div>
              {!showDeleteConfirm ? (
                <button
                  className="delete-button"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Account
                </button>
              ) : (
                <div className="delete-confirm">
                  <div className="warning-icon">⚠️</div>
                  <h3>Are you sure you want to delete your account?</h3>
                  <p>
                    This action cannot be undone. All your data will be
                    permanently deleted.
                  </p>
                  <div className="delete-confirmation-input">
                    <label>Type "DELETE MY ACCOUNT" to confirm:</label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE MY ACCOUNT"
                    />
                  </div>
                  <div className="button-group">
                    <button
                      className="confirm-delete-button"
                      onClick={handleDeleteConfirm}
                      disabled={deleteConfirmText !== "DELETE MY ACCOUNT"}
                    >
                      Delete My Account
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
