import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";
import {
    FaDumbbell,
    FaCalendarAlt,
    FaChartLine,
    FaUser,
    FaStar,
    FaClock,
    FaClipboardList
} from "react-icons/fa";
import "./Styles/dashboard.css";

const ClientDashboard = () => {
    const { user } = useAuthContext();

    // Mock data - replace with actual data from your context/API
    const analytics = {
        totalWorkouts: 15,
        upcomingClasses: 3,
        progressScore: 85,
    };

    const upcomingClasses = [
        {
            _id: 1,
            name: "HIIT Training",
            time: "10:00 AM",
            trainer: "John Smith",
            duration: "45 min",
        },
        {
            _id: 2,
            name: "Yoga Flow",
            time: "2:00 PM",
            trainer: "Sarah Wilson",
            duration: "60 min",
        },
    ];

    const recentProgress = [
        {
            _id: 1,
            metric: "Weight Training",
            progress: "+5% strength increase",
            date: "Last week",
        },
        {
            _id: 2,
            metric: "Cardio",
            progress: "2km improvement",
            date: "This week",
        },
    ];

    return (
        <div className="dashboard-main-container">
            <div className="dashboard-header-main">
                <h2>Welcome, {user?.name}</h2>
            </div>

            {/* Analytics Section */}
            <div className="dashboard-stats-grid">
                <div className="dashboard-stat-item">
                    <FaDumbbell className="dashboard-icon" />
                    <h3>Total Workouts</h3>
                    <div className="dashboard-number">{analytics.totalWorkouts}</div>
                </div>
                <div className="dashboard-stat-item">
                    <FaCalendarAlt className="dashboard-icon" />
                    <h3>Upcoming Classes</h3>
                    <div className="dashboard-number">{analytics.upcomingClasses}</div>
                </div>
                <div className="dashboard-stat-item">
                    <FaChartLine className="dashboard-icon" />
                    <h3>Progress Score</h3>
                    <div className="dashboard-number">{analytics.progressScore}%</div>
                </div>
            </div>

            {/* Upcoming Classes Section */}
            <div className="dashboard-content-box">
                <div className="dashboard-section-header">
                    <h3>Upcoming Classes</h3>
                    <Link to="/book-class" style={{ textDecoration: "none" }}>
                        <button className="dashboard-btn-primary">
                            <FaCalendarAlt /> Book New Class
                        </button>
                    </Link>
                </div>
                <div className="dashboard-grid">
                    {upcomingClasses.map((class_) => (
                        <div key={class_._id} className="dashboard-item">
                            <h4>{class_.name}</h4>
                            <div className="dashboard-item-details">
                                <p><FaClock /> {class_.time}</p>
                                <p><FaUser /> {class_.trainer}</p>
                                <p><FaClipboardList /> {class_.duration}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress Tracking Section */}
            <div className="dashboard-content-box">
                <div className="dashboard-section-header">
                    <h3>Recent Progress</h3>
                    <Link to="/progress-tracker" style={{ textDecoration: "none" }}>
                        <button className="dashboard-btn-primary">
                            <FaChartLine /> View Full Progress
                        </button>
                    </Link>
                </div>
                <div className="dashboard-grid">
                    {recentProgress.map((progress) => (
                        <div key={progress._id} className="dashboard-item">
                            <h4>{progress.metric}</h4>
                            <div className="dashboard-item-details">
                                <p><FaStar /> {progress.progress}</p>
                                <p><FaCalendarAlt /> {progress.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
