import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Common/Navbar.jsx"; //no need of navbar and footer bcs its already in the App.js with routes
import gymImage1 from "../Images/gym1.jpg.jpg";
import gymImage2 from "../Images/gym2.jpg.jpg";
import gymImage3 from "../Images/gym3.jpg.jpg";
import Footer from "../Components/Common/footer.jsx";

export default function Home() {
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
              Connect with the best gyms and trainers in Sri Lanka. Start your
              fitness journey today and achieve your goals with professional
              guidance.
            </p>
            <div className="flex gap-4">
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
              <Link to="/gyms" className="btn-secondary">
                Find Gyms
              </Link>
            </div>
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
              <div className="flex justify-center gap-4">
                <Link to="/register" className="btn-primary">
                  Sign Up Now
                </Link>
                <Link to="/trainers" className="btn-secondary">
                  Find a Trainer
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
