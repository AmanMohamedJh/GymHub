import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaDumbbell, FaUserTie, FaEnvelope, FaChartLine, FaBell, FaCalendarCheck } from 'react-icons/fa';
import { BiMessageDetail } from 'react-icons/bi';
import { MdPayment } from 'react-icons/md';
import './Styles/AdminDashboard.css';

const AdminDashboard = () => {
  // Mock data for demonstration
  const [stats, setStats] = useState({
    totalClients: 1250,
    activeGyms: 45,
    totalTrainers: 120,
    pendingClients: 5,
    pendingGyms: 3,
    pendingTrainers: 8,
    unreadMessages: 12,
    totalRevenue: 125000,
    clientGrowth: 15,
    gymGrowth: 8,
    trainerGrowth: 12,
    revenueGrowth: 25
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'message', text: 'New message from John Doe', time: '5 min ago' },
    { id: 2, type: 'registration', text: 'New gym registration request', time: '10 min ago' },
    { id: 3, type: 'payment', text: 'Payment received from FitLife Gym', time: '1 hour ago' }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'registration', user: 'Sarah Johnson', action: 'registered as new client', time: '2025-03-21 14:30' },
    { id: 2, type: 'payment', user: 'FitLife Gym', action: 'made monthly payment', time: '2025-03-21 13:15' },
    { id: 3, type: 'message', user: 'Mike Wilson', action: 'sent a new message', time: '2025-03-21 12:45' }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState({
    clientGrowth: 25,
    revenueGrowth: 32
  });

  // Handle notification actions
  const handleNotificationAction = (notificationId, action) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

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
            <span className={`stat-change ${stats.clientGrowth >= 0 ? 'positive' : 'negative'}`}>
              {stats.clientGrowth >= 0 ? '+' : ''}{stats.clientGrowth}% this month
            </span>
          </div>
        </div>
        <div className="stat-card active-gyms">
          <div className="stat-icon">
            <FaDumbbell />
          </div>
          <div className="stat-info">
            <h3>Active Gyms</h3>
            <p>{stats.activeGyms}</p>
            <span className={`stat-change ${stats.gymGrowth >= 0 ? 'positive' : 'negative'}`}>
              {stats.gymGrowth >= 0 ? '+' : ''}{stats.gymGrowth} this week
            </span>
          </div>
        </div>
        <div className="stat-card total-trainers">
          <div className="stat-icon">
            <FaUserTie />
          </div>
          <div className="stat-info">
            <h3>Total Trainers</h3>
            <p>{stats.totalTrainers}</p>
            <span className={`stat-change ${stats.trainerGrowth >= 0 ? 'positive' : 'negative'}`}>
              {stats.trainerGrowth >= 0 ? '+' : ''}{stats.trainerGrowth} this month
            </span>
          </div>
        </div>
        <div className="stat-card total-revenue">
          <div className="stat-icon">
            <MdPayment />
          </div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p>${stats.totalRevenue.toLocaleString()}</p>
            <span className={`stat-change ${stats.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
              {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}% this month
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="dashboard-section quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/admin/clients" className="action-btn">
              <FaUsers />
              <span>Manage Clients</span>
              {stats.pendingClients > 0 && (
                <span className="badge">{stats.pendingClients}</span>
              )}
            </Link>
            <Link to="/admin/gyms" className="action-btn">
              <FaDumbbell />
              <span>Manage Gyms</span>
              {stats.pendingGyms > 0 && (
                <span className="badge">{stats.pendingGyms}</span>
              )}
            </Link>
            <Link to="/admin/trainers" className="action-btn">
              <FaUserTie />
              <span>Manage Trainers</span>
              {stats.pendingTrainers > 0 && (
                <span className="badge">{stats.pendingTrainers}</span>
              )}
            </Link>
            <Link to="/admin/messages" className="action-btn">
              <BiMessageDetail />
              <span>Messages</span>
              {stats.unreadMessages > 0 && (
                <span className="badge">{stats.unreadMessages}</span>
              )}
            </Link>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="dashboard-section recent-activities">
          <h3>Recent Activities</h3>
          <div className="activity-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'registration' && <FaUsers />}
                  {activity.type === 'payment' && <MdPayment />}
                  {activity.type === 'message' && <BiMessageDetail />}
                </div>
                <div className="activity-details">
                  <p><strong>{activity.user}</strong> {activity.action}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="dashboard-section notifications">
          <h3>Notifications</h3>
          <div className="notification-list">
            {notifications.map(notification => (
              <div key={notification.id} className="notification-item">
                <div className="notification-icon">
                  {notification.type === 'message' && <FaEnvelope />}
                  {notification.type === 'registration' && <FaCalendarCheck />}
                  {notification.type === 'payment' && <MdPayment />}
                </div>
                <div className="notification-content">
                  <p>{notification.text}</p>
                  <span className="notification-time">{notification.time}</span>
                  <div className="notification-actions">
                    <button onClick={() => handleNotificationAction(notification.id, 'view')}>
                      View
                    </button>
                    <button onClick={() => handleNotificationAction(notification.id, 'dismiss')}>
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="dashboard-section performance">
          <h3>Performance Overview</h3>
          <div className="performance-metrics">
            <div className="metric">
              <h4>Client Growth</h4>
              <div className="metric-value">
                <FaChartLine />
                <span>{performanceMetrics.clientGrowth}%</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="progress" 
                  style={{ width: `${Math.min(performanceMetrics.clientGrowth, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="metric">
              <h4>Revenue Growth</h4>
              <div className="metric-value">
                <FaChartLine />
                <span>{performanceMetrics.revenueGrowth}%</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="progress" 
                  style={{ width: `${Math.min(performanceMetrics.revenueGrowth, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
