import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
} from "react-icons/fa";
import { MapContainer, TileLayer } from "react-leaflet";
import "./Styles/ConfirmationGym.css";

const ConfirmationGym = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gymData } = location.state || {};

  if (!gymData) {
    return (
      <div className="confirmation-container">
        <div className="error-message">No gym data available.</div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="success-header">
        <FaCheckCircle />
        <div>
          <h2>Registration Submitted Successfully!</h2>
          <div className="registration-id">Registration ID: {gymData._id}</div>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Status Information</h3>
        <div className="status-info">
          Your gym registration is currently under review. We will notify you
          once it's approved.
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Gym Details</h3>
        <div className="gym-details">
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">
              {gymData.name || "Not specified"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Location:</span>
            <span className="detail-value">
              <FaMapMarkerAlt />
              {gymData.location && typeof gymData.location === "object"
                ? `${gymData.location.street}, ${gymData.location.city}, ${gymData.location.district}`
                : gymData.location || "Not specified"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Operating Hours:</span>
            <span className="detail-value">
              <FaClock />
              <div style={{ whiteSpace: "pre-line" }}>
                {gymData.operatingHours ? (
                  <>
                    Weekdays: {gymData.operatingHours.weekdays}
                    <br />
                    Weekends: {gymData.operatingHours.weekends}
                  </>
                ) : (
                  "Operating hours not specified"
                )}
              </div>
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Gender Access:</span>
            <span className="detail-value">
              <FaUsers /> {gymData.genderAccess || "Not specified"}
            </span>
          </div>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Location</h3>
        <div className="map-container">
          <MapContainer
            center={
              gymData.location?.coordinates
                ? [
                    gymData.location.coordinates.lat,
                    gymData.location.coordinates.lng,
                  ]
                : [7.8731, 80.7718]
            }
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </MapContainer>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Amenities</h3>
        <div className="amenities-list">
          {(gymData.amenities || []).map((amenity, index) => (
            <span key={index} className="amenity-tag">
              {amenity}
            </span>
          ))}
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Uploaded Images</h3>
        <div className="uploaded-images">
          {(gymData.images || []).map((image, index) => (
            <div key={index} className="image-item">
              <img
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt={`Gym ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/owner-dashboard")}
        >
          Go to Dashboard
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/equipment-management")}
        >
          Manage Equipment
        </button>
      </div>
    </div>
  );
};

export default ConfirmationGym;
