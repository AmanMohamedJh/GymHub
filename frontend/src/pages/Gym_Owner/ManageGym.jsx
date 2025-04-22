import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./Styles/ManageGym.css";

const ManageGym = () => {
  const { gymId } = useParams();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [gymData, setGymData] = useState(null);
  const [clients] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      joinDate: "2025-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      joinDate: "2025-02-01",
    },
  ]);

  const [equipment] = useState([
    {
      id: 1,
      name: "Treadmill",
      quantity: 5,
      condition: "Good",
    },
    {
      id: 2,
      name: "Dumbbells Set",
      quantity: 10,
      condition: "Excellent",
    },
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageEditModal, setShowImageEditModal] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    const fetchGymData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/gym/${gymId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch gym data");
        const data = await response.json();
        // Transform backend data to UI shape
        const transformed = {
          name: data.name || "",
          location: data.location
            ? [data.location.street, data.location.city, data.location.district]
                .filter(Boolean)
                .join(", ")
            : "",
          images: (data.images || []).map((img) =>
            img.startsWith("http")
              ? img
              : `${
                  process.env.REACT_APP_API_URL
                    ? process.env.REACT_APP_API_URL.replace(/\/$/, "")
                    : ""
                }/${img.replace(/^\//, "")}`
          ),
          hours: data.operatingHours || { weekdays: "", weekends: "" },
          allowedGenders: data.genderAccess || "",
          amenities: data.amenities || [],
          statistics: data.statistics || {
            totalClients: 0,
            monthlyRevenue: "",
            popularPlan: "",
            peakHours: "",
          },
          pricing: data.pricing || { monthly: 0, yearly: 0 },
        };
        setGymData(transformed);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gym data:", error);
        setLoading(false);
      }
    };
    if (gymId) fetchGymData();
  }, [gymId, user]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (gymData?.images?.length || 0));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + (gymData?.images?.length || 0)) %
        (gymData?.images?.length || 0)
    );
  };

  const handleDeleteGym = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this gym? This action cannot be undone."
      )
    ) {
      // Add delete logic here
      console.log("Gym deleted");
    }
  };

  const openImageEditModal = () => setShowImageEditModal(true);
  const closeImageEditModal = () => {
    setShowImageEditModal(false);
    setImageFiles([]);
  };

  const handleRemoveImage = (index) => {
    setGymData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
    // TODO: Remove from backend if needed
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleSaveImages = () => {
    if (imageFiles.length === 0) return closeImageEditModal();
    // Simulate upload and add to gymData
    const newImageURLs = imageFiles.map((file) => URL.createObjectURL(file));
    setGymData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...newImageURLs],
    }));
    closeImageEditModal();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading gym data...</p>
      </div>
    );
  }

  if (!gymData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>No gym data found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="manage-gym-container">
        {/* Header Section */}
        <div className="gym-header">
          <h1>{gymData.name}</h1>
          <p className="location">{gymData.location}</p>
        </div>

        {/* Image Slideshow */}
        <div className="slideshow-container">
          <button className="slide-btn prev" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <div className="slideshow-image" style={{ position: "relative" }}>
            <img
              src={
                gymData.images && gymData.images.length > 0
                  ? gymData.images[currentSlide]
                  : ""
              }
              alt={`Gym view ${currentSlide + 1}`}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "260px",
                borderRadius: "8px",
                background: "#eee",
              }}
            />
            {/* Pencil icon for editing images */}
            <button
              className="edit-image-btn"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "rgba(255,255,255,0.8)",
                border: "none",
                borderRadius: "50%",
                padding: 7,
                cursor: "pointer",
              }}
              onClick={openImageEditModal}
              aria-label="Edit Images"
            >
              <FaEdit size={18} color="#222" />
            </button>
          </div>
          <button className="slide-btn next" onClick={nextSlide}>
            <FaChevronRight />
          </button>
          <div className="slide-dots">
            {(gymData.images || []).map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Image Edit Modal */}
        {showImageEditModal && (
          <div
            className="modal-overlay managegym-modal-overlay"
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            <div className="modal-content managegym-modal-content">
              <button
                onClick={closeImageEditModal}
                className="managegym-modal-close"
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="managegym-modal-title">Manage Gym Images</h2>
              <div className="managegym-modal-images">
                {(gymData.images || []).length === 0 ? (
                  <div className="managegym-modal-noimages">No images yet.</div>
                ) : (
                  (gymData.images || []).map((img, idx) => (
                    <div className="managegym-modal-imgbox" key={idx}>
                      <img
                        src={img}
                        alt={`gym-img-${idx}`}
                        className="managegym-modal-img"
                      />
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="managegym-modal-remove"
                        aria-label="Remove"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
              <label
                htmlFor="gym-image-upload"
                className="managegym-modal-uploadlabel"
              >
                <input
                  id="gym-image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <span
                  className="managegym-modal-uploadbtn"
                  tabIndex={0}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    document.getElementById("gym-image-upload").click()
                  }
                >
                  Choose Files
                </span>
              </label>
              {imageFiles.length > 0 && (
                <div className="managegym-modal-filestatus">
                  {imageFiles.length} new image(s) selected
                </div>
              )}
              <button
                className="save-btn managegym-modal-save"
                onClick={handleSaveImages}
                disabled={imageFiles.length === 0}
              >
                Save Images
              </button>
            </div>
          </div>
        )}

        {/* Gym Details Section */}
        <div className="details-section">
          <h2>Gym Details</h2>
          <div className="details-grid">
            <div className="detail-card">
              <h3>Location</h3>
              <p>{gymData.location}</p>
            </div>
            <div className="detail-card">
              <h3>Hours</h3>
              <p>Weekdays: {gymData.hours.weekdays}</p>
              <p>Weekends: {gymData.hours.weekends}</p>
            </div>
            <div className="detail-card">
              <h3>Amenities</h3>
              <ul>
                {(gymData.amenities || []).map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
            <div className="detail-card">
              <h3>Allowed Genders</h3>
              <p>{gymData.allowedGenders}</p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="statistics-section">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Clients</h3>
              <p>{gymData.statistics.totalClients}</p>
            </div>
            <div className="stat-card">
              <h3>Monthly Revenue</h3>
              <p>{gymData.statistics.monthlyRevenue}</p>
            </div>
            <div className="stat-card">
              <h3>Popular Plan</h3>
              <p>{gymData.statistics.popularPlan}</p>
            </div>
            <div className="stat-card">
              <h3>Peak Hours</h3>
              <p>{gymData.statistics.peakHours}</p>
            </div>
          </div>
        </div>

        {/* Membership Pricing Section */}
        <div className="pricing-section">
          <h2>Membership Pricing</h2>
          <div className="pricing-grid">
            <div className="price-card">
              <h3>Monthly Plan</h3>
              <p className="price">₹{gymData.pricing.monthly}</p>
              <button className="edit-btn">
                <FaEdit /> Edit
              </button>
            </div>
            <div className="price-card">
              <h3>Yearly Plan</h3>
              <p className="price">₹{gymData.pricing.yearly}</p>
              <button className="edit-btn">
                <FaEdit /> Edit
              </button>
            </div>
          </div>
        </div>

        {/* Clients Management Section */}
        <div className="clients-section">
          <h2>Clients Management</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.joinDate}</td>
                    <td className="actions">
                      <button className="icon-btn">
                        <FaEnvelope />
                      </button>
                      <button className="icon-btn">
                        <FaInfoCircle />
                      </button>
                      <button className="icon-btn delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Equipment Management Section */}
        <div className="equipment-section">
          <h2>Equipment Management</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Quantity</th>
                  <th>Condition</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.condition}</td>
                    <td className="actions">
                      <button className="icon-btn">
                        <FaEdit />
                      </button>
                      <button className="icon-btn delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="add-btn">Add New Equipment</button>
        </div>

        {/* Notes & Contact Section */}
        <div className="notes-section">
          <h2>Notes & Contact Details</h2>
          <div className="notes-container">
            <textarea
              placeholder="Add important notes about the gym..."
              rows="4"
            ></textarea>
            <button className="save-btn">Save Notes</button>
          </div>
        </div>

        {/* Delete Gym Section */}
        <div className="delete-section">
          <h2>Delete Gym</h2>
          <p className="warning">Warning: This action cannot be undone.</p>
          <button
            className="delete-btn"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Gym
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal - Moved outside main container */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              <FaTrash /> Confirm Delete
            </h3>
            <p>
              Are you sure you want to delete this gym? This action cannot be
              undone.
            </p>
            <div className="modal-buttons">
              <button
                className="cancel-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button className="delete-button" onClick={handleDeleteGym}>
                Delete Gym
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageGym;
