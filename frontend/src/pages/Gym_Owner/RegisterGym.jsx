import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import { useSubscription } from "../../context/Subscription/SubscriptionContext";
import { useGym } from "../../hooks/Gym_Owner/useGym";
import useEquipment from "../../hooks/Gym_Owner/useEquipment";
import ExistingEquipmentModal from "./ExistingEquipmentModal";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Styles/RegisterGym.css";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowUrl: require("leaflet/dist/images/marker-icon.png"),
});

const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          setPosition(e.target.getLatLng());
        },
      }}
    />
  ) : null;
};

const RegisterGym = () => {
  const navigate = useNavigate();
  const { subscription } = useSubscription();
  const { registerGym } = useGym();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ lat: 7.8731, lng: 80.7718 }); // Sri Lanka center
  const [amenityInput, setAmenityInput] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const fileInputRef = useRef();
  const certificateInputRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    hours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
      weekdays: "",
      weekends: "",
    },
    amenities: [],
    allowedGenders: "Both",
    images: [],
    certificate: null,
    notes: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          lat: position.lat,
          lng: position.lng,
        },
      },
    }));
  }, [position]);

  useEffect(() => {
    // Check subscription status
    if (!subscription || subscription.status !== "Active") {
      navigate("/subscription");
    }
  }, [subscription, navigate]);

  useEffect(() => {
    const savedGymData = localStorage.getItem("tempGymData");
    if (savedGymData) {
      const parsedData = JSON.parse(savedGymData);
      setFormData(parsedData);
      localStorage.removeItem("tempGymData"); // Clean up
    }
  }, []);

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handleCoordinatesChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          ...prev.location.coordinates,
          [name]: value,
        },
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview((prev) => [...prev, ...previews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleAmenityAdd = () => {
    if (amenityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput("");
    }
  };

  const removeAmenity = (index) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  // Add validation functions
  const validateImages = (files) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    for (let file of files) {
      if (file.size > maxSize) {
        throw new Error(
          `Image '${file.name}' is too large. Maximum size is 5MB.`
        );
      }
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          `Image '${file.name}' has invalid format. Allowed formats are JPG, JPEG, and PNG.`
        );
      }
    }
  };

  const validateCertificate = (file) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (file.size > maxSize) {
      throw new Error("Certificate file is too large. Maximum size is 2MB.");
    }
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Certificate must be a PDF or image file (JPG, JPEG, PNG)."
      );
    }
  };

  const validateOperatingHours = (hours) => {
    if (!hours.weekdays || !hours.weekends) {
      throw new Error(
        "Please provide operating hours for both weekdays and weekends."
      );
    }
  };

  const validateLocation = (location) => {
    if (!location.street || !location.city || !location.district) {
      throw new Error(
        "Please provide complete address details (street, city, and district)."
      );
    }
    if (
      !location.coordinates ||
      !location.coordinates.lat ||
      !location.coordinates.lng
    ) {
      throw new Error("Please select a location on the map.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Create FormData object
      const formDataObj = new FormData();

      // Add basic fields
      formDataObj.append("name", formData.name);
      formDataObj.append("location", JSON.stringify(formData.location));
      formDataObj.append("operatingHours", JSON.stringify(formData.hours));
      formDataObj.append("amenities", JSON.stringify(formData.amenities));
      formDataObj.append("genderAccess", formData.allowedGenders);
      formDataObj.append("notes", formData.notes);

      // Check file sizes before uploading
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      formData.images.forEach((image) => {
        if (image.size > maxFileSize) {
          throw new Error(
            `Image "${image.name}" is too large. Maximum size is 10MB.`
          );
        }
      });

      // Add images
      formData.images.forEach((image) => {
        formDataObj.append("gymImages", image);
      });

      // Check certificate size
      if (formData.certificate && formData.certificate.size > maxFileSize) {
        throw new Error("Certificate file is too large. Maximum size is 10MB.");
      }

      // Add certificate
      if (formData.certificate) {
        formDataObj.append("certificate", formData.certificate);
      }

      // Register gym
      const gym = await registerGym(formDataObj);

      // Navigate to confirmation page with gym data
      navigate("/confirmation-gym", {
        state: {
          gymData: {
            ...gym,
            images: formData.images,
            location: formData.location,
            operatingHours: formData.hours,
            amenities: formData.amenities,
            genderAccess: formData.allowedGenders,
            notes: formData.notes,
          },
        },
      });
    } catch (error) {
      let errorMessage;

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message.includes("too large")) {
        errorMessage = error.message;
      } else if (error.message.includes("Network Error")) {
        errorMessage =
          "Connection failed. Please check your internet connection.";
      } else {
        errorMessage = "Registration failed: " + error.message;
      }

      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-gym-container">
      <h2>Register Your Gym</h2>
      <form onSubmit={handleSubmit} className="register-gym-form">
        {/* Basic Information Section */}
        <section className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label>Gym Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Location Information */}
          <div className="form-group">
            <label>Location Details</label>
            <div className="location-inputs">
              <div>
                <label>Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.location.street}
                  onChange={handleLocationChange}
                  placeholder="Enter street address"
                  required
                />
              </div>
              <div>
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.location.city}
                  onChange={handleLocationChange}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div>
                <label>District *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.location.district}
                  onChange={handleLocationChange}
                  placeholder="Enter district"
                  required
                />
              </div>

              <div className="map-container">
                <label>Pin Location on Map *</label>
                <MapContainer
                  center={[7.8731, 80.7718]}
                  zoom={8}
                  style={{ height: "400px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker
                    position={position}
                    setPosition={setPosition}
                  />
                </MapContainer>
                <p className="map-help">
                  Click on the map to set your gym's location or drag the marker
                  to adjust it.
                </p>
              </div>
            </div>
          </div>

          {/* Gym Images */}
          <div className="form-group">
            <label>Gym Images *</label>
            <div className="image-upload-container">
              <label className="image-upload-button">
                <FaUpload /> Upload Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
              <div className="image-previews">
                {imagePreview.map((url, index) => (
                  <div key={index} className="image-preview-container">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => {
                        const newImages = formData.images.filter(
                          (_, i) => i !== index
                        );
                        setFormData((prev) => ({ ...prev, images: newImages }));
                        setImagePreview((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Operating Hours */}
        <section className="form-section">
          <h3>Operating Hours</h3>
          <div className="form-group">
            <label htmlFor="hours.weekdays">Weekdays *</label>
            <input
              type="text"
              id="hours.weekdays"
              name="hours.weekdays"
              value={formData.hours.weekdays}
              onChange={handleChange}
              placeholder="e.g., 6:00 AM - 11:00 PM"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="hours.weekends">Weekends *</label>
            <input
              type="text"
              id="hours.weekends"
              name="hours.weekends"
              value={formData.hours.weekends}
              onChange={handleChange}
              placeholder="e.g., 7:00 AM - 9:00 PM"
              required
            />
          </div>
        </section>

        {/* Amenities */}
        <section className="form-section">
          <h3>Amenities</h3>
          <div className="form-group">
            <div className="amenity-input-group">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="Add amenity (e.g., Swimming Pool)"
              />
              <button type="button" onClick={handleAmenityAdd}>
                Add
              </button>
            </div>
            <div className="amenities-list">
              {formData.amenities.map((amenity, index) => (
                <div key={index} className="amenity-tag">
                  {amenity}
                  <button type="button" onClick={() => removeAmenity(index)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipment Management - Replaced with info message */}
        <div className="form-section equipment-info-section">
          <h3>Equipment Management</h3>
          <div
            className="info-message"
            style={{
              padding: "15px 20px",
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeeba",
              borderRadius: "4px",
              color: "#856404",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "20px" }}>⚠️</span>
              <span style={{ fontWeight: "500" }}>
                Equipment Setup Available After Approval
              </span>
            </div>
            <p style={{ margin: "0 0 15px 0" }}>
              You can add and manage equipment for your gym once your
              registration is approved. Visit the Equipment Management page
              after approval to set up your gym's equipment.
            </p>
            <button
              type="button"
              className="btn btn-outline-warning"
              onClick={() => navigate("/equipment-management")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "transparent",
                border: "1px solid #856404",
                color: "#856404",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <FaPlus /> View Equipment Management
            </button>
          </div>
        </div>

        {/* Certificate Upload */}
        <section className="form-section">
          <h3>Gym Registration Certificate</h3>
          <div className="form-group">
            <p className="certificate-info">
              Please upload your official gym registration certificate. This
              document helps verify your gym's legal status and compliance with
              local regulations.
            </p>
            <div className="certificate-upload-container">
              <label className="certificate-upload-button">
                <FaUpload /> Upload Certificate
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData((prev) => ({
                        ...prev,
                        certificate: file,
                      }));
                    }
                  }}
                  style={{ display: "none" }}
                />
              </label>
              {formData.certificate && (
                <div className="certificate-preview">
                  <span>{formData.certificate.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, certificate: null }))
                    }
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Gender Access */}
        <section className="form-section">
          <h3>Gender Access</h3>
          <div className="form-group">
            <label htmlFor="allowedGenders">Allowed Genders *</label>
            <select
              id="allowedGenders"
              name="allowedGenders"
              value={formData.allowedGenders}
              onChange={handleChange}
              required
            >
              <option value="Both">Both</option>
              <option value="Male">Male Only</option>
              <option value="Female">Female Only</option>
            </select>
          </div>
        </section>

        {/* Notes & Contact Details */}
        <section className="form-section">
          <h3>Notes & Contact Details</h3>
          <div className="form-group">
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Enter any additional notes or contact details for your gym..."
            />
          </div>
        </section>

        <div className="form-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/owner-dashboard")}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Register Gym
          </button>
        </div>
      </form>

      {error && (
        <div
          className="error-message"
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #ef9a9a",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default RegisterGym;
