import React from "react";
import "./AboutUs.css";
import { FaDumbbell, FaUsers, FaStar, FaChartLine } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-hero-section">
        <div className="about-hero-content">
          <h1>Welcome to GymHub</h1>
          <p>Your Ultimate Fitness Destination</p>
        </div>
      </div>

      <div className="about-mission-section">
        <h2>Our Mission</h2>
        <p>
          At GymHub, we're dedicated to transforming lives through fitness. We
          connect passionate individuals with premium gyms and expert trainers,
          making quality fitness accessible to everyone.
        </p>
      </div>

      <div className="about-values-section">
        <h2>Our Core Values</h2>
        <div className="about-values-grid">
          <div className="about-value-card">
            <div className="about-value-icon">
              <FaDumbbell />
            </div>
            <h3>Excellence</h3>
            <p>
              We strive for excellence in every aspect of our service, ensuring
              the highest quality experience for our members.
            </p>
          </div>
          <div className="about-value-card">
            <div className="about-value-icon">
              <FaUsers />
            </div>
            <h3>Community</h3>
            <p>
              Building a strong, supportive community that motivates and
              inspires each other to achieve their fitness goals.
            </p>
          </div>
          <div className="about-value-card">
            <div className="about-value-icon">
              <FaStar />
            </div>
            <h3>Trust</h3>
            <p>
              Maintaining transparency and reliability in all our partnerships
              with gyms, trainers, and members.
            </p>
          </div>
          <div className="about-value-card">
            <div className="about-value-icon">
              <FaChartLine />
            </div>
            <h3>Innovation</h3>
            <p>
              Continuously evolving and improving our platform to provide the
              best fitness solutions.
            </p>
          </div>
        </div>
      </div>

      <div className="about-story-section">
        <h2>Our Journey</h2>
        <p>
          Founded with a vision to revolutionize the fitness industry, GymHub
          has grown from a simple idea to a comprehensive platform that connects
          fitness enthusiasts with quality gyms and professional trainers.
        </p>
      </div>

      <div className="about-stats-section">
        <div className="about-stat-card">
          <h3>500+</h3>
          <p>Premium Gyms</p>
        </div>
        <div className="about-stat-card">
          <h3>10K+</h3>
          <p>Active Members</p>
        </div>
        <div className="about-stat-card">
          <h3>98%</h3>
          <p>Satisfaction Rate</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
