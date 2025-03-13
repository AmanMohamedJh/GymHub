import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "../Common/footer.css";

export default function Footer() {
  return (
    <footer className="footer bg-gray-900 border-t border-gym-gold/20">
      <div className="footer-container max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="footer-grid grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="footer-brand space-y-4">
            <h3 className="text-xl font-bold text-gym-gold">GymHub</h3>
            <p className="text-gray-400">
              Connecting fitness enthusiasts with the best gyms and trainers in
              Sri Lanka.
            </p>
            <div className="social-links flex space-x-4">
              <a
                href="#"
                className="social-link text-gray-400 hover:text-gym-gold"
                aria-label="Facebook"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="social-link text-gray-400 hover:text-gym-gold"
                aria-label="Twitter"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="social-link text-gray-400 hover:text-gym-gold"
                aria-label="Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <div className="footer-links space-y-2">
              <Link
                to="/gyms"
                className="footer-link text-gray-400 hover:text-gym-gold"
              >
                Find Gyms
              </Link>
              <Link
                to="/trainers"
                className="footer-link text-gray-400 hover:text-gym-gold"
              >
                Find Trainers
              </Link>
              <Link
                to="/register"
                className="footer-link text-gray-400 hover:text-gym-gold"
              >
                Join Now
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="text-lg font-semibold text-white mb-4">
              For Partners
            </h3>
            <div className="footer-links space-y-2">
              <Link
                to="/register"
                className="footer-link text-gray-400 hover:text-gym-gold"
              >
                List Your Gym
              </Link>
              <Link
                to="/register"
                className="footer-link text-gray-400 hover:text-gym-gold"
              >
                Become a Trainer
              </Link>
              <Link
                to="#"
                className="footer-link text-gray-400 hover:text-gym-gold"
              >
                Partner Support
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <div className="contact-info space-y-2 text-gray-400">
              <p>Email: support@gymhub.lk</p>
              <p>Phone: +94 11 234 5678</p>
              <p>Address: Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} GymHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
