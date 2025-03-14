import React, { useState } from 'react';
import { FaUser, FaKey, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import './Styles/OwnerProfile.css';

const OwnerProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    profilePicture: "./images/default-profile.jpg",
    currentPassword: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(profileData.profilePicture);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    // Handle password update logic here
    console.log("Password update requested");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setShowPasswordForm(false);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic here
    console.log("Profile update requested");
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    // Handle account deletion logic here
    console.log("Account deletion requested");
    setShowDeleteConfirm(false);
  };

  return (
    <div className="owner-profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <h1>Profile Settings</h1>
          <p>Manage your account settings and profile information</p>
        </div>

        {/* Profile Information Section */}
        <div className="profile-section">
          <h2><FaUser /> Profile Information</h2>
          
          {/* Profile Picture */}
          <div className="profile-picture-section">
            <div className="profile-picture">
              <img src={imagePreview} alt="Profile" />
              {isEditing && (
                <label className="upload-button">
                  <FaUpload />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>

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
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            </div>
          ) : (
            <form className="edit-form" onSubmit={handleProfileSubmit}>
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
                  required
                />
              </div>
              <div className="button-group">
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Password Management Section */}
        <div className="profile-section">
          <h2><FaKey /> Password Management</h2>
          {!showPasswordForm ? (
            <div className="password-section">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleProfileChange}
                  placeholder="••••••••"
                  disabled
                />
              </div>
              <button 
                className="change-password-button"
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
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
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: ""
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Delete Account Section */}
        <div className="profile-section danger-zone">
          <h2><FaTrash /> Delete Account</h2>
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <button
            type="button"
            className="delete-button"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-content">
                <h2><FaTrash /> Delete Account</h2>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="modal-buttons">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerProfile;
