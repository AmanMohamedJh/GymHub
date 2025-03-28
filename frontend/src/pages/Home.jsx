import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import {
  FaDumbbell,
  FaClipboardList,
  FaUserCog,
  FaBuilding,
  FaUsers,
  FaUserPlus,
  FaPlay,
  FaTimes,
} from "react-icons/fa";
import gymImage1 from "../Images/gym1.jpg.jpg";
import gymImage2 from "../Images/gym2.jpg.jpg";
import gymImage3 from "../Images/gym3.jpg.jpg";
import "../styles/Home/home.css";

export default function Home() {
  const { user } = useAuthContext();
  const [showVideo, setShowVideo] = useState(false);

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
            <Link to="/trainer-dashboard" className="role-button trainer-list">
              <FaUserPlus className="button-icon" />
              <div className="button-text">
                <span className="button-title">Trainer Dashboard</span>
                <span className="button-subtitle">
                  Manage your clients and sessions
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
    <div className="home">
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
            <div className="section-header">
              <h2>Why Choose GymHub?</h2>
              <p>
                We provide a comprehensive platform connecting fitness
                enthusiasts with quality gyms and professional trainers.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-image-wrapper">
                  <img
                    src={gymImage1}
                    alt="Premium Gyms"
                    className="feature-image"
                  />
                </div>
                <div className="feature-content">
                  <h3>Premium Gyms</h3>
                  <p>
                    Access to the best fitness facilities across Sri Lanka with
                    state-of-the-art equipment.
                  </p>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-image-wrapper">
                  <img
                    src={gymImage2}
                    alt="Expert Trainers"
                    className="feature-image"
                  />
                </div>
                <div className="feature-content">
                  <h3>Expert Trainers</h3>
                  <p>
                    Connect with certified fitness trainers who will guide you
                    through your fitness journey.
                  </p>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-image-wrapper">
                  <img
                    src={gymImage3}
                    alt="Easy Booking"
                    className="feature-image"
                  />
                </div>
                <div className="feature-content">
                  <h3>Easy Booking</h3>
                  <p>
                    Book sessions, track progress, and manage your fitness
                    schedule all in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="video-section">
          <div className="video-overlay">
            <h2 className="video-title">Transform Your Life</h2>
            <p className="video-subtitle">
              "Where dedication meets excellence, and every rep brings you
              closer to greatness"
            </p>
            <button className="play-button" onClick={() => setShowVideo(true)}>
              <FaPlay />
            </button>
          </div>
        </section>

        {/* Video Modal */}
        {showVideo && (
          <div className="video-modal">
            <div className="modal-content">
              <button
                className="close-button"
                onClick={() => setShowVideo(false)}
              >
                <FaTimes />
              </button>
              <div className="video-container">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/6qgjExI3XrE?si=W4kzwdABS1sqwv9B&amp;start=9"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Location Section */}
        <section className="location-section">
          <div className="container">
            <div className="section-header">
              <h2>Find Us Across Sri Lanka</h2>
              <p>Discover GymHub partner locations near you</p>
            </div>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4047271.3116604497!2d78.46141502362455!3d7.851730318521241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593cf65a1e9d%3A0xe13da4b400e2d38c!2sSri%20Lanka!5e0!3m2!1sen!2sus!4v1711411234567!5m2!1sen!2sus"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-cross-origin"
              ></iframe>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="cta-final">
          <div className="container">
            <div className="cta-final-content">
              <h2>Ready to Start Your Fitness Journey?</h2>
              <p>
                Join GymHub today and transform your life with professional
                guidance.
              </p>
              <div className="cta-final-features">
                <span>Expert Trainers</span>
                <span>•</span>
                <span>Premium Equipment</span>
                <span>•</span>
                <span>Flexible Plans</span>
              </div>
              <div className="cta-final-buttons">
                <Link to="/gym-list" className="cta-final-button explore">
                  <FaBuilding className="button-icon" />
                  <div className="button-text">
                    <span>Explore Gyms</span>
                    <span className="button-subtext">
                      Find the perfect gym for you
                    </span>
                  </div>
                </Link>
                <Link
                  to="/trainer-list"
                  className="cta-final-button find-trainer"
                >
                  <FaUsers className="button-icon" />
                  <div className="button-text">
                    <span>Find Trainers</span>
                    <span className="button-subtext">
                      Connect with fitness experts
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
