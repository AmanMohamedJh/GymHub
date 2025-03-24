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
  FaArrowUp,
  FaArrowDown,
  FaTools,
} from "react-icons/fa";
import "./Styles/OwnerDashboard.css";

import gymImage from "./Styles/images/gym-background2.jpg.jpg";

const OwnerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

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
    <div className="owner_dashboard_container">
      <div className="owner_dashboard_header">
        <h2>Welcome, {user?.name}</h2>
      </div>

      {/* Analytics Section */}
      <div className="owner_dashboard_stats">
        <div className="owner_stat_card">
          <FaDumbbell className="owner_stat_icon" />
          <div className="owner_stat_content">
            <h3>Total Gyms</h3>
            <div className="owner_stat_number">{analytics.totalGyms}</div>
            <div className="owner_stat_trend positive">
              <FaArrowUp /> 12% this month
            </div>
          </div>
        </div>

        <div className="owner_stat_card">
          <FaUserCheck className="owner_stat_icon" />
          <div className="owner_stat_content">
            <h3>Registered Gyms</h3>
            <div className="owner_stat_number">{analytics.registeredGyms}</div>
            <div className="owner_stat_trend positive">
              <FaArrowUp /> 8% this month
            </div>
          </div>
        </div>

        <div className="owner_stat_card">
          <FaUserClock className="owner_stat_icon" />
          <div className="owner_stat_content">
            <h3>Pending Gyms</h3>
            <div className="owner_stat_number">{analytics.pendingGyms}</div>
            <div className="owner_stat_trend negative">
              <FaArrowDown /> 3% this month
            </div>
          </div>
        </div>
      </div>

      {/* Add Gym Button */}
      <div className="owner_add_gym">
        <Link to="/register-gym" className="owner_add_btn">
          <FaPlus /> Add New Gym
        </Link>
      </div>

      {/* Registered Gyms Section */}
      <div className="owner_content_section">
        <h3>Registered Gyms</h3>
        <div className="owner_gym_grid">
          {registeredGyms.map((gym) => (
            <div key={gym._id} className="owner_gym_card">
              <div
                className="owner_gym_image"
                style={{
                  backgroundImage: `url(${gym.images[0] || defaultGymImage})`,
                }}
              ></div>
              <h4>{gym.name}</h4>
              <div className="owner_gym_location">
                <FaMapMarkerAlt />
                {gym.location}
              </div>
              <Link
                to={`/gym-dashboard/${gym._id}`}
                className="owner_manage_btn"
              >
                <FaCog /> Manage Gym
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
        <div className="dashboard-section-header">
          <h3>Recent Client Feedback</h3>
          <Link to="/reviews-dashboard">
            <button className="dashboard-btn-primary">
              <FaComments /> Manage Reviews
            </button>
          </Link>
        </div>
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

      {/* Equipment Management Section - Enhanced */}
      <div className="owner_content_section">
        <h3>Equipment Management</h3>
        <div className="dashboard-action-cards">
          <Link to="/equipment-management" className="dashboard-action-card">
            <div className="dashboard-action-icon">
              <FaTools />
            </div>
            <div className="dashboard-action-content">
              <h4>Equipment Inventory</h4>
              <p>
                Track, maintain and manage all your gym equipment in one place
              </p>
            </div>
          </Link>
          <Link to="/register-gym" className="dashboard-action-card">
            <div className="dashboard-action-icon">
              <FaPlus />
            </div>
            <div className="dashboard-action-content">
              <h4>Add New Equipment</h4>
              <p>Register new equipment items for your gym facilities</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
