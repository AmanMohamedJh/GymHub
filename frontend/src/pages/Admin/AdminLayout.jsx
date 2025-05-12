import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  FaDumbbell,
  FaUsers,
  FaUserTie,
  FaEnvelope,
  FaTachometerAlt,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import "./Styles/AdminManagement.css";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { IoSettingsSharp } from "react-icons/io5";
import { BsFillHouseGearFill } from "react-icons/bs";
import { useAuthContext } from "../../hooks/useAuthContext";

const AdminLayout = ({ state }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "New gym registration", time: "5 min ago" },
    { id: 2, text: "New trainer application", time: "10 min ago" },
  ]);

  const { user } = useAuthContext();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const formatted = location.pathname
    .split("/")
    .pop()
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const userName = user.name.charAt(0).toUpperCase() + user.name.slice(1);
  const userRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <div className="admin-layout">
      {/* Mobile Toggle Button */}
      <button className="mobile-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Admin Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <FaUserCircle className="admin-avatar" />
          <div className="admin-info">
            <h3>{userName}</h3>
            <span>{userRole}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/admin/dashboard"
            className={`nav-item ${isActive("/admin/dashboard")}`}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/gym-management"
            className={`nav-item ${isActive("/admin/gym-management")}`}
          >
            <FaDumbbell />
            <span>Gyms</span>
          </Link>
          <Link
            to="/admin/trainer-management"
            className={`nav-item ${isActive("/admin/trainer-management")}`}
          >
            <FaUserTie />
            <span>Trainers</span>
          </Link>
          <Link
            to="/admin/client-management"
            className={`nav-item ${isActive("/admin/client-management")}`}
          >
            <FaUsers />
            <span>Clients</span>
          </Link>
          <Link
            to="/admin/contact-management"
            className={`nav-item ${isActive("/admin/contact-management")}`}
          >
            <FaEnvelope />
            <span>Feedbacks</span>
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </Link>
          <Link
            to="/admin/edit-about-us"
            className={`nav-item ${isActive("/admin/edit-about-us")}`}
          >
            <BsFillHouseGearFill />
            <span>Edit About Us</span>
          </Link>
          <Link
            to="/admin/profile-settings"
            className={`nav-item ${isActive("/admin/profile-settings")}`}
          >
            <IoSettingsSharp />
            <span>Profile Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-content">
        <div className="content-container">
          <div className="admin-topbar">
            <div className="topbar-left">
              <div className="breadcrumb">
                <span>{formatted}</span>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="admin-page-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
