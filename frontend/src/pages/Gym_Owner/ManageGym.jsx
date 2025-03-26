import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const [loading, setLoading] = useState(true);
  // Mock data - replace with actual data from backend
  const [gymData, setGymData] = useState({
    name: "FitLife Gym",
    location: "123 Fitness Street, City",
    images: [
      "./images/gym-background2.jpg.jpg",
      "./images/gym-background2.jpg.jpg",
      "./images/gym-background2.jpg.jpg",
    ],
    amenities: ["Swimming Pool", "Free WiFi", "Parking", "Locker Room"],
    hours: {
      weekdays: "6:00 AM - 11:00 PM",
      weekends: "7:00 AM - 9:00 PM",
    },
    allowedGenders: "Both",
    statistics: {
      totalClients: 250,
      monthlyRevenue: "Rs150,000",
      popularPlan: "Yearly",
      peakHours: "6:00 PM - 8:00 PM",
    },
    pricing: {
      monthly: 2000,
      yearly: 20000,
    },
  });

  // Mock clients data
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

  // Mock equipment data
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

  // Fetch gym data based on gymId
  useEffect(() => {
    const fetchGymData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch data from your API here
        // const response = await fetch(`/api/gyms/${gymId}`);
        // const data = await response.json();
        // setGymData(data);

        // For now, just simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gym data:", error);
        setLoading(false);
      }
    };

    if (gymId) {
      fetchGymData();
    }
  }, [gymId]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % gymData.images.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + gymData.images.length) % gymData.images.length
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading gym data...</p>
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
          <div className="slideshow-image">
            <img
              src={gymData.images[currentSlide]}
              alt={`Gym view ${currentSlide + 1}`}
            />
          </div>
          <button className="slide-btn next" onClick={nextSlide}>
            <FaChevronRight />
          </button>
          <div className="slide-dots">
            {gymData.images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

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
                {gymData.amenities.map((amenity, index) => (
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
