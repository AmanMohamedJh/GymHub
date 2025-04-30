import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./Styles/ManageGym.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ManageGym = () => {
  const { gymId } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageEditModal, setShowImageEditModal] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [showClientReportModal, setShowClientReportModal] = useState(false);

  const [editValues, setEditValues] = useState({
    weekdays: "",
    weekends: "",
    amenities: "",
    allowedGenders: "",
    amenityInput: "",
  });

  const [notesValue, setNotesValue] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteAcknowledge, setDeleteAcknowledge] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

        // Parallel fetches for statistics
        const [reviewsRes, clientsRes] = await Promise.all([
          fetch(`/api/gym-reviews/${gymId}`),
          fetch(`/api/gyms/${gymId}/Clientregistrations`, {
            headers: { Authorization: `Bearer ${user?.token}` },
            credentials: "include",
          }),
        ]);
        const reviews = reviewsRes.ok ? await reviewsRes.json() : [];
        const clients = clientsRes.ok ? await clientsRes.json() : [];

        // Transform backend data to UI shape
        const transformed = {
          name: data.name || "",
          location: data.location
            ? [data.location.street, data.location.city, data.location.district]
                .filter(Boolean)
                .join(", ")
            : "",
          locationObj: data.location || { coordinates: {} },
          images: (data.images || []).map((img) =>
            img.startsWith("http") ? img : `/${img.replace(/^\//, "")}`
          ),
          hours: data.operatingHours || { weekdays: "", weekends: "" },
          allowedGenders: data.genderAccess || "",
          amenities: data.amenities || [],
          statistics: {
            totalClients: Array.isArray(clients) ? clients.length : 0,
            reviewCount: Array.isArray(reviews) ? reviews.length : 0,
            announcementCount: 0,
            eventCount: 0,
          },
          pricing: data.pricing || { monthly: 0, yearly: 0 },
          certificate: data.certificate || null,
          notes: data.notes || "",
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

  useEffect(() => {
    setEditValues({
      weekdays: gymData?.hours?.weekdays || "",
      weekends: gymData?.hours?.weekends || "",
      amenities: (gymData?.amenities || []).join(", "),
      allowedGenders: gymData?.allowedGenders || "",
      amenityInput: "",
    });
  }, [gymData]);

  useEffect(() => {
    setNotesValue(gymData?.notes || "");
  }, [gymData]);

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

  // --- Report Generation Functions ---
  const fetchClientsForReport = async (gymId, user) => {
    const res = await fetch(`/api/gymOwner/gyms/${gymId}/Clientregistrations`, {
      headers: { Authorization: `Bearer ${user?.token}` },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch clients for report.");
    return await res.json();
  };

  const handleDownloadClientReport = (format) => async () => {
    try {
      const clients = await fetchClientsForReport(gymId, user);
      if (!clients.length) {
        alert("No clients found for this gym.");
        return;
      }
      if (format === "csv") {
        const headers = [
          "Full Name",
          "Email",
          "Phone",
          "Status",
          "Start Date",
          "DOB",
          "Gender",
          "Fitness Level",
          "Fitness Goals",
        ];
        const csvRows = [headers.join(",")];
        clients.forEach((client) => {
          csvRows.push(
            [
              JSON.stringify(client.fullName ?? ""),
              JSON.stringify(client.email ?? ""),
              JSON.stringify(client.phone ?? ""),
              JSON.stringify(client.status ?? ""),
              JSON.stringify(
                client.startDate
                  ? new Date(client.startDate).toLocaleDateString()
                  : ""
              ),
              JSON.stringify(
                client.dob ? new Date(client.dob).toLocaleDateString() : ""
              ),
              JSON.stringify(client.gender ?? ""),
              JSON.stringify(client.fitnessLevel ?? ""),
              JSON.stringify(client.fitnessGoals ?? ""),
            ].join(",")
          );
        });
        const csv = csvRows.join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `client_report_${gymId}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else if (format === "pdf") {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.setTextColor(39, 174, 96);
        doc.text("Client Report", 14, 18);
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);
        doc.text(`Total Clients: ${clients.length}`, 14, 28);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);
        const headers = ["Full Name", "Email", "Phone", "Status", "Start Date"];
        const body = clients.map((client) => [
          client.fullName ?? "",
          client.email ?? "",
          client.phone ?? "",
          client.status ?? "",
          client.startDate
            ? new Date(client.startDate).toLocaleDateString()
            : "",
        ]);
        autoTable(doc, {
          startY: 40,
          head: [headers],
          body,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [39, 174, 96] },
          alternateRowStyles: { fillColor: [240, 255, 244] },
        });
        doc.save(`client_report_${gymId}.pdf`);
      }
      setShowClientReportModal(false);
    } catch (err) {
      alert("Error generating report: " + err.message);
      setShowClientReportModal(false);
    }
  };

  const handleSaveAllEdits = async () => {
    let patchBody = {};
    // Hours (must send as JSON string)
    patchBody.operatingHours = JSON.stringify({
      weekdays: editValues.weekdays || "",
      weekends: editValues.weekends || "",
    });
    // Amenities (must send as JSON string)
    patchBody.amenities = JSON.stringify(
      (editValues.amenities || "")
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
    );
    // Allowed Genders (send as genderAccess, not allowedGenders)
    let val = editValues.allowedGenders;
    if (!["Both", "Male", "Female"].includes(val)) val = "Both";
    patchBody.genderAccess = val;

    try {
      const response = await fetch(`/api/gym/${gymId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(patchBody),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update gym");
      }
      const updatedGym = await response.json();
      setGymData((prev) => ({
        ...prev,
        hours: updatedGym.operatingHours,
        amenities: updatedGym.amenities,
        allowedGenders: updatedGym.genderAccess,
      }));
      setIsEditing(false);
    } catch (error) {
      alert("Error updating gym: " + error.message);
    }
  };
  const handleCancelAllEdits = () => {
    setEditValues({
      weekdays: gymData?.hours?.weekdays || "",
      weekends: gymData?.hours?.weekends || "",
      amenities: (gymData?.amenities || []).join(", "),
      allowedGenders: gymData?.allowedGenders || "",
      amenityInput: "",
    });
    setIsEditing(false);
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Gym Details</h2>
            {!isEditing && (
              <button
                className="icon-btn edit-pen"
                onClick={() => setIsEditing(true)}
                title="Edit All Details"
              >
                <FaEdit />
              </button>
            )}
          </div>
          <div className="details-grid">
            {/* Location Section (read-only, with warning) */}
            <div className="detail-card">
              <h3>Location</h3>
              <p>{gymData.location}</p>
              <div
                style={{
                  color: "#e74c3c",
                  fontWeight: "bold",
                  marginTop: 8,
                  fontSize: "0.98rem",
                }}
              >
                You can't change the location after the gym is verified and
                certified by Admin
              </div>
            </div>
            <div className="detail-card">
              <h3>Hours</h3>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editValues.weekdays}
                    onChange={(e) =>
                      setEditValues({ ...editValues, weekdays: e.target.value })
                    }
                    placeholder="Weekdays"
                    className="edit-input"
                    style={{ marginBottom: 4 }}
                  />
                  <input
                    type="text"
                    value={editValues.weekends}
                    onChange={(e) =>
                      setEditValues({ ...editValues, weekends: e.target.value })
                    }
                    placeholder="Weekends"
                    className="edit-input"
                  />
                </>
              ) : (
                <>
                  <p>Weekdays: {gymData.hours.weekdays}</p>
                  <p>Weekends: {gymData.hours.weekends}</p>
                </>
              )}
            </div>
            <div className="detail-card">
              <h3>Amenities</h3>
              {isEditing ? (
                <>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input
                      type="text"
                      value={editValues.amenityInput || ""}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          amenityInput: e.target.value,
                        })
                      }
                      placeholder="Add amenity (e.g., Swimming Pool)"
                      className="edit-input"
                      style={{ flex: 1 }}
                    />
                    <button
                      className="save-btn edit-save-btn"
                      style={{ minWidth: 70, width: 80 }}
                      onClick={() => {
                        if (
                          editValues.amenityInput &&
                          editValues.amenityInput.trim() !== ""
                        ) {
                          setEditValues((ev) => ({
                            ...ev,
                            amenities: (ev.amenities
                              ? ev.amenities.split(",").map((a) => a.trim())
                              : []
                            )
                              .concat(ev.amenityInput.trim())
                              .join(", "),
                            amenityInput: "",
                          }));
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {(editValues.amenities
                      ? editValues.amenities
                          .split(",")
                          .map((a) => a.trim())
                          .filter(Boolean)
                      : []
                    ).map((amenity, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: "#f5f5f5",
                          border: "1px solid #e74c3c",
                          color: "#333",
                          borderRadius: 16,
                          padding: "4px 12px",
                          display: "flex",
                          alignItems: "center",
                          fontSize: 14,
                        }}
                      >
                        {amenity}
                        <button
                          style={{
                            marginLeft: 8,
                            background: "none",
                            border: "none",
                            color: "#e74c3c",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: 16,
                          }}
                          onClick={() => {
                            setEditValues((ev) => ({
                              ...ev,
                              amenities: ev.amenities
                                ? ev.amenities
                                    .split(",")
                                    .map((a) => a.trim())
                                    .filter((_, i) => i !== idx)
                                    .join(", ")
                                : "",
                            }));
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <ul>
                  {(gymData.amenities || []).map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="detail-card">
              <h3>Allowed Genders</h3>
              {isEditing ? (
                <select
                  value={editValues.allowedGenders}
                  onChange={(e) =>
                    setEditValues({
                      ...editValues,
                      allowedGenders: e.target.value,
                    })
                  }
                  className="edit-input"
                >
                  <option value="Both">Both</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p>{gymData.allowedGenders}</p>
              )}
            </div>
          </div>
          {isEditing && (
            <div style={{ marginTop: 24, textAlign: "right" }}>
              <button
                className="save-btn edit-save-btn"
                onClick={handleSaveAllEdits}
              >
                Save
              </button>
              <button
                className="cancel-btn edit-cancel-btn"
                onClick={handleCancelAllEdits}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Map Section */}
        {gymData &&
        gymData.locationObj &&
        gymData.locationObj.coordinates &&
        typeof gymData.locationObj.coordinates.lat === "number" &&
        typeof gymData.locationObj.coordinates.lng === "number" ? (
          <div
            className="map-section"
            style={{
              margin: "32px 0",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ marginBottom: 16 }}>Gym Location</h2>
            <div style={{ height: 340, width: "100%" }}>
              <MapContainer
                center={[
                  gymData.locationObj.coordinates.lat,
                  gymData.locationObj.coordinates.lng,
                ]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                dragging={false}
                doubleClickZoom={false}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    gymData.locationObj.coordinates.lat,
                    gymData.locationObj.coordinates.lng,
                  ]}
                >
                  <Popup>{gymData.location || "Gym Location"}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        ) : (
          <div
            className="map-section"
            style={{ margin: "32px 0", textAlign: "center", color: "#888" }}
          >
            <h2 style={{ color: "#fff" }}>Gym Location</h2>
            <div style={{ padding: 32 }}>
              Map unavailable: No coordinates found for this gym.
            </div>
          </div>
        )}

        {/* Statistics Section */}
        <div
          className="statistics-section"
          style={{
            margin: "36px 0",
            padding: 24,
            background: "rgba(255,255,255,0.97)",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginBottom: 20, fontWeight: 700 }}>Statistics</h2>
          <div
            className="statistics-grid"
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {/* Total Clients */}
            <div
              className="stat-card"
              style={{
                flex: 1,
                minWidth: 220,
                background: "#fff",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                padding: 24,
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  color: "#e74c3c",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  marginBottom: 8,
                }}
              >
                Total Clients
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>
                {gymData.statistics?.totalClients ?? 0}
              </div>
            </div>
            {/* Number of Reviews */}
            <div
              className="stat-card"
              style={{
                flex: 1,
                minWidth: 220,
                background: "#fff",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                padding: 24,
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  color: "#e74c3c",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  marginBottom: 8,
                }}
              >
                Number of Reviews
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>
                {gymData.statistics?.reviewCount ?? 0}
              </div>
            </div>
            {/* Number of Announcements */}
            <div
              className="stat-card"
              style={{
                flex: 1,
                minWidth: 220,
                background: "#fff",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                padding: 24,
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  color: "#e74c3c",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  marginBottom: 8,
                }}
              >
                Number of Announcements
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>
                {gymData.statistics?.announcementCount ?? 0}
              </div>
            </div>
            {/* Number of Events */}
            <div
              className="stat-card"
              style={{
                flex: 1,
                minWidth: 220,
                background: "#fff",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                padding: 24,
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  color: "#e74c3c",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  marginBottom: 8,
                }}
              >
                Number of Events
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>
                {gymData.statistics?.eventCount ?? 0}
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div
          className="certificates-section"
          style={{
            margin: "36px 0",
            padding: 24,
            background: "rgba(255,255,255,0.97)",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginBottom: 20, fontWeight: 700 }}>Certificates</h2>
          {gymData.certificate ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={
                  gymData.certificate.startsWith("http")
                    ? gymData.certificate
                    : `/` + gymData.certificate.replace(/^\//, "")
                }
                alt="Certificate"
                style={{
                  maxWidth: 350,
                  maxHeight: 320,
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                  marginBottom: 16,
                  background: "#fff",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div
                style={{
                  color: "#e74c3c",
                  fontWeight: "bold",
                  fontSize: "1.05rem",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                <span role="img" aria-label="lock">
                  🔒
                </span>{" "}
                You can't change or add certificates after being approved by the
                Admin
              </div>
            </div>
          ) : (
            <div
              style={{
                color: "#888",
                textAlign: "center",
                fontSize: "1.05rem",
                padding: 32,
              }}
            >
              No certificate uploaded for this gym.
            </div>
          )}
        </div>

        {/* Clients Management Section */}
        <div className="clients-section">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2>Clients Management</h2>
            <button
              className="see-all-clients-btn"
              onClick={() => navigate(`/owner/gym/clients/${gymId}`)}
              style={{
                marginLeft: "auto",
                fontWeight: 600,
                background: "#fff",
                border: "2px solid #eb5757",
                color: "#eb5757",
                borderRadius: "8px",
                padding: "8px 18px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              See All Clients
            </button>
          </div>
          <div style={{ marginTop: "2.2rem", textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.7rem",
                  justifyContent: "center",
                }}
              >
                <button
                  className="client-report-btn"
                  style={{
                    background:
                      "linear-gradient(90deg, #27ae60 0%, #6fcf97 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "1.08rem",
                    border: "none",
                    borderRadius: "999px",
                    padding: "12px 32px",
                    boxShadow: "0 2px 12px rgba(39,174,96,0.12)",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.55rem",
                  }}
                  onClick={() => setShowClientReportModal(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#fff"
                      d="M12 2a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 11.586V3a1 1 0 0 1 1-1Zm7 14a1 1 0 0 1 1 1v2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-2a1 1 0 0 1 1-1Z"
                    />
                  </svg>
                  Client Report
                </button>
              </div>
              <div className="client-report-desc">
                Here you can generate detailed reports on your clients'
                involvement, attendance, and membership history in this gym.
                Download reports to analyze trends, track engagement, and keep
                records for your business needs. Click "Client Report" to get
                started.
              </div>
            </div>
          </div>
        </div>

        {/* Client Report Modal */}
        {showClientReportModal && (
          <div className="modal-overlay" style={{ zIndex: 10000 }}>
            <div
              className="modal-content"
              style={{
                maxWidth: 400,
                textAlign: "center",
                padding: "2.5rem 2rem",
              }}
            >
              <h2
                style={{
                  color: "#eb5757",
                  fontWeight: 700,
                  marginBottom: "1.2rem",
                }}
              >
                Download Report
              </h2>
              <p style={{ color: "#222", marginBottom: "2rem" }}>
                Choose your preferred format for the <b>Client</b> report:
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1.2rem",
                  justifyContent: "center",
                  marginBottom: "2rem",
                }}
              >
                <button
                  style={{
                    flex: 1,
                    background:
                      "linear-gradient(90deg, #27ae60 0%, #6fcf97 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "999px",
                    padding: "13px 0",
                    fontWeight: 600,
                    fontSize: "1.07rem",
                    cursor: "pointer",
                    opacity: 1,
                  }}
                  onClick={handleDownloadClientReport("csv")}
                >
                  Excel (.csv)
                </button>
                <button
                  style={{
                    flex: 1,
                    background:
                      "linear-gradient(90deg, #f2c94c 0%, #f2994a 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "999px",
                    padding: "13px 0",
                    fontWeight: 600,
                    fontSize: "1.07rem",
                    cursor: "pointer",
                    opacity: 1,
                  }}
                  onClick={handleDownloadClientReport("pdf")}
                >
                  PDF (.pdf)
                </button>
              </div>
              <button
                className="cancel-btn"
                style={{
                  background: "none",
                  border: "none",
                  color: "#eb5757",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  cursor: "pointer",
                  marginTop: "0.5rem",
                }}
                onClick={() => setShowClientReportModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

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
            {isEditingNotes ? (
              <>
                <textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  rows="4"
                  style={{ width: "100%", marginBottom: 12 }}
                />
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    className="save-btn"
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/gym/${gymId}`, {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`,
                          },
                          body: JSON.stringify({ notes: notesValue }),
                        });
                        if (!res.ok) throw new Error("Failed to update notes");
                        setIsEditingNotes(false);
                        setGymData((prev) => ({ ...prev, notes: notesValue }));
                      } catch (err) {
                        alert("Error updating notes: " + err.message);
                      }
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setNotesValue(gymData.notes || "");
                      setIsEditingNotes(false);
                    }}
                  >
                    Cancel
                  </button>
                  {gymData.notes && (
                    <button
                      className="delete-btn"
                      style={{
                        marginLeft: "auto",
                        background: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 16px",
                        fontWeight: 600,
                      }}
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/gym/${gymId}`, {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${user?.token}`,
                            },
                            body: JSON.stringify({ notes: "" }),
                          });
                          if (!res.ok)
                            throw new Error("Failed to delete notes");
                          setNotesValue("");
                          setGymData((prev) => ({ ...prev, notes: "" }));
                          setIsEditingNotes(false);
                        } catch (err) {
                          alert("Error deleting notes: " + err.message);
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <textarea
                  value={gymData.notes || ""}
                  readOnly
                  rows="4"
                  style={{
                    width: "100%",
                    marginBottom: 12,
                    background: "#f9f9f9",
                    color: "#444",
                  }}
                  placeholder="Add important notes about the gym..."
                />
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setNotesValue(gymData.notes || "");
                      setIsEditingNotes(true);
                    }}
                  >
                    {gymData.notes ? "Edit Notes" : "Add Notes"}
                  </button>
                  {gymData.notes && (
                    <button
                      className="delete-btn"
                      style={{
                        background: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 16px",
                        fontWeight: 600,
                      }}
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/gym/${gymId}`, {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${user?.token}`,
                            },
                            body: JSON.stringify({ notes: "" }),
                          });
                          if (!res.ok)
                            throw new Error("Failed to delete notes");
                          setNotesValue("");
                          setGymData((prev) => ({ ...prev, notes: "" }));
                        } catch (err) {
                          alert("Error deleting notes: " + err.message);
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Delete Gym Section */}
        <div className="delete-section">
          <h2>Delete Gym</h2>
          <p>Warning: This action cannot be undone.</p>
          <button
            className="delete-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Gym
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="delete-modal-overlay">
            <div className="delete-modal">
              <h3>Are you absolutely sure?</h3>
              <ul className="delete-effects">
                <li>
                  All gym data (clients, reviews, equipment, schedules) will be
                  permanently deleted.
                </li>
                <li>
                  Clients and trainers will lose access to this gym's
                  information.
                </li>
                <li>Any future events or announcements will be lost.</li>
                <li>This action cannot be undone.</li>
              </ul>
              <div className="delete-warning">
                <b>
                  Type <span style={{ color: "#e74c3c" }}>Delete gym</span>{" "}
                  below to confirm:
                </b>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type 'Delete gym' to confirm"
                  className="delete-confirm-input"
                  autoFocus
                />
              </div>
              <div className="delete-radio-row">
                <input
                  type="radio"
                  id="acknowledge"
                  checked={deleteAcknowledge}
                  onChange={() => setDeleteAcknowledge(!deleteAcknowledge)}
                />
                <label htmlFor="acknowledge" style={{ marginLeft: 8 }}>
                  I have read and understand these effects
                </label>
              </div>
              {deleteError && <div className="delete-error">{deleteError}</div>}
              <div className="delete-modal-actions">
                <button
                  className="delete-btn"
                  disabled={
                    deleteConfirmText !== "Delete gym" ||
                    !deleteAcknowledge ||
                    deleting
                  }
                  onClick={async () => {
                    setDeleting(true);
                    setDeleteError("");
                    try {
                      const res = await fetch(`/api/gym/${gymId}`, {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${user?.token}`,
                        },
                      });
                      if (!res.ok) throw new Error("Failed to delete gym");
                      setShowDeleteModal(false);
                      // Optionally redirect or refresh
                      window.location.href = "/dashboard";
                    } catch (err) {
                      setDeleteError(err.message);
                    } finally {
                      setDeleting(false);
                    }
                  }}
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                    setDeleteAcknowledge(false);
                    setDeleteError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageGym;
