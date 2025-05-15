import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaDumbbell, FaUserTie } from "react-icons/fa";
import "./Styles/AdminDashboard.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";

const AdminDashboard = () => {
  // Mock data for demonstration
  const [stats, setStats] = useState({});
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log("Clients data:", response.data);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      {/* Top Stats Section */}
      <div className="dashboard-stats">
        <div className="stat-card total-clients">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>Total Clients</h3>
            <p>{stats.totalClients}</p>
          </div>
        </div>
        <div className="stat-card active-gyms">
          <div className="stat-icon">
            <FaDumbbell />
          </div>
          <div className="stat-info">
            <h3>Active Gyms</h3>
            <p>{stats.activeGyms}</p>
          </div>
        </div>
        <div className="stat-card total-trainers">
          <div className="stat-icon">
            <FaUserTie />
          </div>
          <div className="stat-info">
            <h3>Total Trainers</h3>
            <p>{stats.totalTrainers}</p>
          </div>
        </div>
        <div className="stat-card total-trainers">
          <div className="stat-icon">
            {/* New Registrations icons */}
            <FaUserTie />
          </div>
          <div className="stat-info">
            <h3>New Registrations</h3>
            <p>{stats.newRegister}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="dashboard-section quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/admin/client-management" className="action-btn">
              <FaUsers />
              <span>Manage Clients</span>
              {stats.pendingClients > 0 && (
                <span className="badge">{stats.pendingClients}</span>
              )}
            </Link>
            <Link to="/admin/gym-management" className="action-btn">
              <FaDumbbell />
              <span>Manage Gyms</span>
              {stats.pendingGyms > 0 && (
                <span className="badge">{stats.pendingGyms}</span>
              )}
            </Link>
            <Link to="/admin/trainer-management" className="action-btn">
              <FaUserTie />
              <span>Manage Trainers</span>
              {stats.pendingTrainers > 0 && (
                <span className="badge">{stats.pendingTrainers}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
