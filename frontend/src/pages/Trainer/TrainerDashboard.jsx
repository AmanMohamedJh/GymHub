import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Trainer/Styles/trainerdash.css";
import {
  FaEdit,
  FaCalendarPlus,
  FaDumbbell,
  FaChartLine,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [trainerData, setTrainerData] = useState({
    name: "John Doe",
    age: "30",
    email: "john.doe@example.com",
    phone: "+123 456 7890",
    location: "New York, USA",
    trainerType: "Personal Trainer",
    experience: "5 Years",
    certification: "Certified Personal Trainer",
  });

  const [editedData, setEditedData] = useState({ ...trainerData });

  const handleRegisterClick = () => {
    navigate("/trainer/registration");
  };

  const handleUpdateClick = () => {
    if (isEditing) {
      // Save changes
      setTrainerData(editedData);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditedData({ ...trainerData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const navigateToSession = () => {
    navigate("/trainer/session");
  };

  const navigateToClientProgress = () => {
    navigate("/trainer/client-progress");
  };

  const navigateToWorkoutPlans = () => {
    navigate("/trainer/workout-plans");
  };

  const renderDetailItem = (label, field) => {
    return (
      <div className={`detail-item ${isEditing ? "editing" : ""}`}>
        <label>{label}:</label>
        {isEditing ? (
          <input
            type="text"
            value={editedData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
          />
        ) : (
          <span>{trainerData[field]}</span>
        )}
      </div>
    );
  };

  return (
    <div className="trainer-dashboard">
      <div className="dashboard-header">
        <h1>Trainer Dashboard</h1>
        <button className="register-btn" onClick={handleRegisterClick}>
          Register Trainer
        </button>
      </div>

      <div className="trainer-profile-card">
        <div className="profile-header">
          <h2>Trainer Profile</h2>
          <div className="profile-actions">
            <button className="update-btn" onClick={handleUpdateClick}>
              {isEditing ? (
                <>
                  <FaSave /> Save Changes
                </>
              ) : (
                <>
                  <FaEdit /> Update Profile
                </>
              )}
            </button>
            {isEditing && (
              <button className="cancel-btn" onClick={handleCancelEdit}>
                <FaTimes /> Cancel
              </button>
            )}
          </div>
        </div>
        <div className="profile-details">
          {renderDetailItem("Name", "name")}
          {renderDetailItem("Age", "age")}
          {renderDetailItem("Email", "email")}
          {renderDetailItem("Phone", "phone")}
          {renderDetailItem("Location", "location")}
          {renderDetailItem("Trainer Type", "trainerType")}
          {renderDetailItem("Experience", "experience")}
          {renderDetailItem("Certification", "certification")}
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="trainer-dashboard-card" onClick={navigateToSession}>
          <FaCalendarPlus className="icon" />
          <h3>Add Session</h3>
          <p>Schedule and manage your training sessions</p>
        </div>
        <div
          className="trainer-dashboard-card"
          onClick={navigateToWorkoutPlans}
        >
          <FaDumbbell className="icon" />
          <h3>Add Workout Plan</h3>
          <p>Create and manage workout plans for clients</p>
        </div>
        <div
          className="trainer-dashboard-card"
          onClick={navigateToClientProgress}
        >
          <FaChartLine className="icon" />
          <h3>View Client Progress</h3>
          <p>Track and monitor client achievements</p>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
