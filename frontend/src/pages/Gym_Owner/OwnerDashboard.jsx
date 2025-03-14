import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaMapMarkerAlt,
  FaTimes,
  FaComments,
  FaDollarSign,
  FaUsers,
  FaDumbbell,
} from "react-icons/fa";
import "./Styles/OwnerDashboard.css";
import gymImage from "./Styles/images/gym-background2.jpg.jpg";

const OwnerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Mock data - replace with actual data from your context/API
  const analytics = {
    totalGyms: 5,
    totalClients: 150,
    monthlyRevenue: 25000,
  };

  const registeredGyms = [
    {
      id: 1,
      name: "FitZone",
      location: "New York",
      image: gymImage,
    },
    {
      id: 2,
      name: "PowerHouse",
      location: "Los Angeles",
      image: gymImage,
    },
  ];

  const pendingGyms = [
    {
      id: 3,
      name: "Elite Fitness",
      location: "Chicago",
      image: gymImage,
    },
    {
      id: 4,
      name: "Strong Life",
      location: "Miami",
      image: gymImage,
    },
  ];

  const feedbacks = [
    {
      id: 1,
      gymName: "FitZone",
      message: "Great facilities and trainers!",
      rating: 5,
    },
    {
      id: 2,
      gymName: "PowerHouse",
      message: "Excellent equipment and atmosphere",
      rating: 4,
    },
  ];

  return (
    <div className="owner-dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name}</h2>
      </div>

      {/* Analytics Section */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <FaDumbbell className="stat-icon" />
          <h3>Total Gyms</h3>
          <div className="number">{analytics.totalGyms}</div>
        </div>
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <h3>Total Clients</h3>
          <div className="number">{analytics.totalClients}</div>
        </div>
        <div className="stat-card">
          <FaDollarSign className="stat-icon" />
          <h3>Monthly Revenue</h3>
          <div className="number">${analytics.monthlyRevenue}</div>
        </div>
      </div>

      {/* Add Gym Section */}
      <div className="add-gym-section">
        <button
          className="primary-button"
          onClick={() => navigate("/register-gym")}
        >
          <FaPlus /> Register Your Dream Gym Here
        </button>
      </div>

      {/* Registered Gyms Section */}
      <div className="content-section">
        <h3>Gyms Registered</h3>
        <div className="gym-grid">
          {registeredGyms.map((gym) => (
            <div className="gym-card" key={gym.id}>
              <div
                className="gym-card-image"
                style={{ backgroundImage: `url(${gym.image})` }}
              />
              <h4>{gym.name}</h4>
              <div className="location">
                <FaMapMarkerAlt /> {gym.location}
              </div>
              <button
                className="primary-button"
                onClick={() => navigate(`/gym-dashboard/${gym.id}`)}
              >
                Manage Gym
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Gyms Section */}
      <div className="content-section">
        <h3>Pending Gyms</h3>
        <div className="gym-grid">
          {pendingGyms.map((gym) => (
            <div className="gym-card" key={gym.id}>
              <div
                className="gym-card-image"
                style={{ backgroundImage: `url(${gym.image})` }}
              />
              <h4>{gym.name}</h4>
              <div className="location">
                <FaMapMarkerAlt /> {gym.location}
              </div>
              <button
                className="secondary-button"
                onClick={() => {
                  /* Handle cancel request */
                }}
              >
                <FaTimes /> Cancel Request
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Section */}
      <div className="content-section">
        <h3>Client Feedback</h3>
        <div className="feedback-list">
          {feedbacks.map((feedback) => (
            <div className="feedback-card" key={feedback.id}>
              <div className="feedback-header">
                <FaComments />
                <h4>{feedback.gymName}</h4>
              </div>
              <p className="feedback-message">{feedback.message}</p>
              <div className="feedback-rating">Rating: {feedback.rating}/5</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
