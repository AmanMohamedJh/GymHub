import React from "react";
import "../Trainer/Styles/clientProgress.css";

const ClientProgress = () => {
  return (
    <div className="progress-container">
      {/* Header Section */}
      <div className="header-section">
        <h2>Client Progress</h2>
        <div className="profile-info">
          <img src="profile-pic.jpg" alt="Profile" className="profile-pic" />
          <div className="client-info">
            <h3>John Doe</h3>
            <p>Email: johndoe@example.com</p>
          </div>
        </div>
      </div>

      {/* Progress Overview Section */}
      <div className="overview-section">
        <div className="workout-summary">
          <h4>Workout Summary (This Month)</h4>
          <div className="summary-details">
            <div className="summary-item">
              <h5>Days Worked</h5>
              <p>20 Days</p>
            </div>
            <div className="summary-item">
              <h5>Hours Worked</h5>
              <p>40 Hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workout History Section */}
      <div className="history-section">
        <h4>Recent Workouts</h4>
        <ul>
          <li>Day 1: Full Body Workout - 1 Hour</li>
          <li>Day 5: Cardio - 45 Minutes</li>
          <li>Day 10: Strength Training - 1.5 Hours</li>
        </ul>
      </div>
    </div>
  );
};

export default ClientProgress;
