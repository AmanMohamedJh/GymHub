import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { FaDumbbell, FaUsers, FaUserTie, FaEnvelope, FaTachometerAlt, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './Styles/AdminManagement.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications] = useState([
    { id: 1, text: 'New gym registration', time: '5 min ago' },
    { id: 2, text: 'New trainer application', time: '10 min ago' },
  ]);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <FaUserCircle className="admin-avatar" />
          <div className="admin-info">
            <h3>Admin Panel</h3>
            <span>Administrator</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard')}`}>
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/gym-management" className={`nav-item ${isActive('/admin/gym-management')}`}>
            <FaDumbbell />
            <span>Gyms</span>
          </Link>
          <Link to="/admin/trainer-management" className={`nav-item ${isActive('/admin/trainer-management')}`}>
            <FaUserTie />
            <span>Trainers</span>
          </Link>
          <Link to="/admin/client-management" className={`nav-item ${isActive('/admin/client-management')}`}>
            <FaUsers />
            <span>Clients</span>
          </Link>
          <Link to="/admin/contact-management" className={`nav-item ${isActive('/admin/contact-management')}`}>
            <FaEnvelope />
            <span>Messages</span>
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="notifications-preview">
            <div className="preview-header">
              <FaBell />
              <span>Recent Notifications</span>
            </div>
            <div className="notifications-list">
              {notifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <p>{notification.text}</p>
                  <span>{notification.time}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-content">
        <div className="admin-topbar">
          <div className="breadcrumb">
            {location.pathname.split('/').map((path, index, arr) => (
              path && <span key={index}>
                {path.charAt(0).toUpperCase() + path.slice(1)}
                {index < arr.length - 1 && ' / '}
              </span>
            ))}
          </div>
          <div className="topbar-actions">
            <button className="notification-btn">
              <FaBell />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
            <div className="admin-profile">
              <FaUserCircle />
              <span>Admin</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="admin-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
