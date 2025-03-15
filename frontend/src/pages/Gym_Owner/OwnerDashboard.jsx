import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FaPlus,
  FaMapMarkerAlt,
  FaComments,
  FaTimes,
  FaDollarSign,
  FaUsers,
  FaDumbbell,
  FaUserCheck,
  FaUserClock,
  FaCog,
  FaStar,
  FaUser,
} from "react-icons/fa";
import "./Styles/Dashboard.css";
import gymImage from "./Styles/images/gym-background2.jpg.jpg";

const OwnerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Mock data - replace with actual data from your context/API
  const analytics = {
    totalGyms: 5,
    registeredGyms: 3,
    pendingGyms: 2,
  };

  const registeredGyms = [
    {
      _id: 1,
      name: "FitZone",
      location: "New York",
      images: [gymImage],
    },
    {
      _id: 2,
      name: "PowerHouse",
      location: "Los Angeles",
      images: [gymImage],
    },
  ];

  const pendingGyms = [
    {
      _id: 3,
      name: "Elite Fitness",
      location: "Chicago",
      images: [gymImage],
    },
    {
      _id: 4,
      name: "Strong Life",
      location: "Miami",
      images: [gymImage],
    },
  ];

  const feedback = [
    {
      _id: 1,
      clientName: "John Doe",
      message: "Great facilities and trainers!",
      rating: 5,
    },
    {
      _id: 2,
      clientName: "Jane Doe",
      message: "Excellent equipment and atmosphere",
      rating: 4,
    },
  ];

  const defaultGymImage = gymImage;

  return (
    <div className="dashboard-main-container">
      <div className="dashboard-header-main">
        <h2>Welcome, {user?.name}</h2>
      </div>

      {/* Analytics Section */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-item">
          <FaDumbbell className="dashboard-icon" />
          <h3>Total Gyms</h3>
          <div className="dashboard-number">{analytics.totalGyms}</div>
        </div>
        <div className="dashboard-stat-item">
          <FaUserCheck className="dashboard-icon" />
          <h3>Registered Gyms</h3>
          <div className="dashboard-number">{analytics.registeredGyms}</div>
        </div>
        <div className="dashboard-stat-item">
          <FaUserClock className="dashboard-icon" />
          <h3>Pending Gyms</h3>
          <div className="dashboard-number">{analytics.pendingGyms}</div>
        </div>
      </div>

      {/* Add Gym Button */}
      <div className="dashboard-add-section">
        <Link to="/register-gym">
          <button className="dashboard-btn-primary">
            <FaPlus /> Add New Gym
          </button>
        </Link>
      </div>

      {/* Registered Gyms Section */}
      <div className="dashboard-content-box">
        <h3>Registered Gyms</h3>
        <div className="dashboard-gym-grid">
          {registeredGyms.map((gym) => (
            <div key={gym._id} className="dashboard-gym-item">
              <div
                className="dashboard-gym-image"
                style={{
                  backgroundImage: `url(${gym.images[0] || defaultGymImage})`,
                }}
              ></div>
              <h4>{gym.name}</h4>
              <div className="dashboard-location">
                <FaMapMarkerAlt />
                {gym.location}
              </div>
              <Link to={`/gym-dashboard/${gym._id}`}>
                <button className="dashboard-btn-secondary">
                  <FaCog /> Manage Gym
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Gyms Section */}
      <div className="dashboard-content-box">
        <h3>Pending Gyms</h3>
        <div className="dashboard-gym-grid">
          {pendingGyms.map((gym) => (
            <div key={gym._id} className="dashboard-gym-item">
              <div
                className="dashboard-gym-image"
                style={{
                  backgroundImage: `url(${gym.images[0] || defaultGymImage})`,
                }}
              ></div>
              <h4>{gym.name}</h4>
              <div className="dashboard-location">
                <FaMapMarkerAlt />
                {gym.location}
              </div>
              <button className="dashboard-btn-secondary dashboard-btn-danger">
                <FaTimes /> Cancel Request
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Client Feedback Section */}
      <div className="dashboard-content-box">
        <h3>Recent Client Feedback</h3>
        <div className="dashboard-feedback-grid">
          {feedback.map((item) => (
            <div key={item._id} className="dashboard-feedback-item">
              <div className="dashboard-feedback-header">
                <FaUser />
                <h4>{item.clientName}</h4>
              </div>
              <div className="dashboard-feedback-message">{item.message}</div>
              <div className="dashboard-feedback-rating">
                <FaStar />
                {item.rating}/5
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
