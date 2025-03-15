import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaDumbbell,
  FaClipboardList,
  FaUserCog,
  FaBuilding,
  FaUsers,
  FaUserPlus,
} from "react-icons/fa";
import gymImage1 from "../Images/gym1.jpg.jpg";
import gymImage2 from "../Images/gym2.jpg.jpg";
import gymImage3 from "../Images/gym3.jpg.jpg";

export default function Home() {
  const { user } = useContext(AuthContext);

  const renderActionButtons = () => {
    if (!user) {
      return (
        <div className="flex gap-4">
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn-secondary">
            Find a Trainer
          </Link>
        </div>
      );
    }

    // Role-specific buttons
    switch (user.role) {
      case "gym_owner":
        return (
          <div className="role-buttons">
            <Link to="/register-gym" className="role-button register-gym">
              <FaBuilding className="button-icon" />
              <div className="button-text">
                <span className="button-title">Register New Gym</span>
                <span className="button-subtitle">
                  Add your fitness center to our network
                </span>
              </div>
            </Link>
            <Link to="/owner-dashboard" className="role-button manage-gym">
              <FaUserCog className="button-icon" />
              <div className="button-text">
                <span className="button-title">Manage Your Gyms</span>
                <span className="button-subtitle">
                  View and manage your fitness centers
                </span>
              </div>
            </Link>
          </div>
        );

      case "client":
        return (
          <div className="role-buttons">
            <Link
              to="/client-dashboard"
              className="role-button client-dashboard"
            >
              <FaDumbbell className="button-icon" />
              <div className="button-text">
                <span className="button-title">Your Fitness Dashboard</span>
                <span className="button-subtitle">
                  Track your fitness journey
                </span>
              </div>
            </Link>
            <Link to="/gym-list" className="role-button gym-list">
              <FaClipboardList className="button-icon" />
              <div className="button-text">
                <span className="button-title">Explore Gyms</span>
                <span className="button-subtitle">
                  Find the perfect gym for you
                </span>
              </div>
            </Link>
          </div>
        );

      case "trainer":
        return (
          <div className="role-buttons">
            <Link
              to="/trainer-dashboard"
              className="role-button trainer-dashboard"
            >
              <FaUsers className="button-icon" />
              <div className="button-text">
                <span className="button-title">Trainer Dashboard</span>
                <span className="button-subtitle">
                  Manage your clients and sessions
                </span>
              </div>
            </Link>
            <Link to="/trainer-list" className="role-button trainer-list">
              <FaUserPlus className="button-icon" />
              <div className="button-text">
                <span className="button-title">Join Gyms</span>
                <span className="button-subtitle">
                  Connect with fitness centers
                </span>
              </div>
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Transform Your Fitness Journey with{" "}
              <span className="text-gym-gold">GymHub</span>
            </h1>
            <p className="hero-description">
              {user ? (
                <span className="welcome-message">
                  Welcome back,{" "}
                  <span className="user-role">
                    {user.role.replace("_", " ")}
                  </span>
                  ! Continue your fitness journey with GymHub.
                </span>
              ) : (
                "Connect with the best gyms and trainers in Sri Lanka. Start your fitness journey today and achieve your goals with professional guidance."
              )}
            </p>
            {renderActionButtons()}
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose GymHub?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-12">
                We provide a comprehensive platform connecting fitness
                enthusiasts with quality gyms and professional trainers.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <h3 className="feature-title">Premium Gyms</h3>
                <p className="feature-description">
                  Access to the best fitness facilities across Sri Lanka with
                  state-of-the-art equipment.
                </p>
                {/* Image for Premium Gyms */}
                <img
                  src={gymImage1}
                  alt="Premium Gyms"
                  className="feature-image-small"
                />
              </div>

              <div className="feature-card">
                <h3 className="feature-title">Expert Trainers</h3>
                <p className="feature-description">
                  Connect with certified fitness trainers who will guide you
                  through your fitness journey.
                </p>
                {/* Image for Expert Trainers */}
                <img
                  src={gymImage2}
                  alt="Expert Trainers"
                  className="feature-image-small"
                />
              </div>

              <div className="feature-card">
                <h3 className="feature-title">Easy Booking</h3>
                <p className="feature-description">
                  Book sessions, track progress, and manage your fitness
                  schedule all in one place.
                </p>
                {/* Image for Easy Booking */}
                <img
                  src={gymImage3}
                  alt="Easy Booking"
                  className="feature-image-small"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="features-section">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Start Your Fitness Journey?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join GymHub today and transform your life with professional
                guidance.
              </p>
              {user ? (
                <div className="role-buttons">
                  <Link to="/gym-list" className="role-button gym-list">
                    <FaClipboardList className="button-icon" />
                    <div className="button-text">
                      <span className="button-title">Explore Gyms</span>
                      <span className="button-subtitle">
                        Find the perfect gym for you
                      </span>
                    </div>
                  </Link>
                  <Link to="/trainer-list" className="role-button trainer-list">
                    <FaUserPlus className="button-icon" />
                    <div className="button-text">
                      <span className="button-title">Find Trainers</span>
                      <span className="button-subtitle">
                        Connect with fitness experts
                      </span>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="flex justify-center gap-4">
                  <Link to="/register" className="btn-primary">
                    Sign Up Now
                  </Link>
                  <Link to="/login" className="btn-secondary">
                    Find a Trainer
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
