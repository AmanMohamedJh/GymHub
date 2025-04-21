import React, { useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FaPlus,
  FaMapMarkerAlt,
  FaComments,
  FaTimes,
  FaDollarSign,
  FaUsers,
  FaDumbbell,
  FaUserCheck,
  FaUserClock,
  FaCog,
  FaStar,
  FaUser,
  FaArrowUp,
  FaArrowDown,
  FaTools,
} from "react-icons/fa";
import "./Styles/OwnerDashboard.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import gymImage from "./Styles/images/gym-background2.jpg.jpg";

const OwnerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const analytics = {
    totalGyms: 5,
    registeredGyms: 3,
    pendingGyms: 2,
  };

  const registeredGyms = [
    {
      _id: 1,
      name: "FitZone",
      location: "New York",
      images: [gymImage],
    },
    {
      _id: 2,
      name: "PowerHouse",
      location: "Los Angeles",
      images: [gymImage],
    },
  ];

  const feedback = [
    {
      _id: 1,
      clientName: "John Doe",
      message: "Great facilities and trainers!",
      rating: 5,
    },
    {
      _id: 2,
      clientName: "Jane Doe",
      message: "Excellent equipment and atmosphere",
      rating: 4,
    },
  ];

  const defaultGymImage = gymImage;

  const [registeredGymsData, setRegisteredGyms] = React.useState([]);
  const [gymsError, setGymsError] = React.useState(null);
  const [loadingGyms, setLoadingGyms] = React.useState(false);

  const [pendingGyms, setPendingGyms] = React.useState([]);
  const [loadingPendingGyms, setLoadingPendingGyms] = React.useState(false);
  const [pendingGymsError, setPendingGymsError] = React.useState(null);
  const [trackGym, setTrackGym] = React.useState(null); // which gym to track progress
  const [showTrackModal, setShowTrackModal] = React.useState(false);
  const [deleteGymId, setDeleteGymId] = React.useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const [reportModal, setReportModal] = React.useState({
    open: false,
    status: null,
  });

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoadingGyms(true);
        setGymsError(null);
        const response = await fetch("/api/gym/owner-gyms?status=approved", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch gyms.");
        }
        const data = await response.json();
        setRegisteredGyms(data);
      } catch (error) {
        setGymsError(error.message || "Failed to fetch gyms.");
      } finally {
        setLoadingGyms(false);
      }
    };
    if (user?.token) fetchGyms();
  }, [user?.token]);

  useEffect(() => {
    const fetchPendingGyms = async () => {
      try {
        setLoadingPendingGyms(true);
        setPendingGymsError(null);
        // Fetch pending gyms
        const pendingRes = await fetch("/api/gym/owner-gyms?status=pending", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const pendingData = pendingRes.ok ? await pendingRes.json() : [];
        // Fetch rejected gyms
        const rejectedRes = await fetch("/api/gym/owner-gyms?status=rejected", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const rejectedData = rejectedRes.ok ? await rejectedRes.json() : [];
        setPendingGyms([...pendingData, ...rejectedData]);
      } catch (error) {
        setPendingGymsError(error.message || "Failed to fetch pending gyms.");
      } finally {
        setLoadingPendingGyms(false);
      }
    };
    if (user?.token) fetchPendingGyms();
  }, [user?.token]);

  const handleTrackProgress = (gym) => {
    setTrackGym(gym);
    setShowTrackModal(true);
  };
  const closeTrackModal = () => {
    setShowTrackModal(false);
    setTrackGym(null);
  };

  const handleCancelRequest = (gymId) => {
    setDeleteGymId(gymId);
    setShowDeleteConfirm(true);
  };
  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeleteGymId(null);
  };
  const confirmDeleteGym = async () => {
    if (!deleteGymId) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/gym/${deleteGymId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete gym.");
      }
      setPendingGyms((prev) => prev.filter((g) => g._id !== deleteGymId));
      closeDeleteConfirm();
    } catch (err) {
      alert(err.message || "Failed to delete gym.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadReport = (status, format) => async () => {
    try {
      const res = await fetch(`/api/gym/owner-gyms?status=${status}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch gyms for report.");
      const gyms = await res.json();
      if (!gyms.length) {
        alert("No gyms found for this status.");
        return;
      }
      if (format === "csv") {
        const headers = Object.keys(gyms[0]);
        const csvRows = [headers.join(",")];
        gyms.forEach((gym) => {
          csvRows.push(
            headers.map((h) => JSON.stringify(gym[h] ?? "")).join(",")
          );
        });
        const csv = csvRows.join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${status}_gyms_report.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else if (format === "pdf") {
        const doc = new jsPDF();
        // Branding/Header
        doc.setFontSize(20);
        doc.setTextColor(231, 76, 60);
        doc.text(
          `${status.charAt(0).toUpperCase() + status.slice(1)} Gyms Report`,
          14,
          18
        );
        // Statistics Section
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);
        doc.text(`Total Gyms: ${gyms.length}`, 14, 28);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);
        // Define and format columns
        const columns = [
          { header: "Name", field: "name" },
          { header: "District", field: "location.district" },
          { header: "Status", field: "status" },
          { header: "Owner", field: "ownerId" },
          { header: "Created", field: "createdAt" },
        ];
        const headers = columns.map((col) => col.header);
        const body = gyms.map((gym) =>
          columns.map((col) => {
            // Support nested fields
            if (col.field.includes(".")) {
              const [parent, child] = col.field.split(".");
              return gym[parent]?.[child] ?? "";
            }
            // Format dates
            if (
              col.field.toLowerCase().includes("date") ||
              col.field.toLowerCase().includes("created")
            ) {
              return gym[col.field]
                ? new Date(gym[col.field]).toLocaleDateString()
                : "";
            }
            // Default
            return gym[col.field] ?? "";
          })
        );
        autoTable(doc, {
          startY: 40,
          head: [headers],
          body,
          styles: { fontSize: 11 },
          headStyles: { fillColor: [231, 76, 60] },
          alternateRowStyles: { fillColor: [253, 246, 227] },
        });
        doc.save(`${status}_gyms_report.pdf`);
      }
      setReportModal({ open: false, status: null });
    } catch (err) {
      alert("Error generating report: " + err.message);
      setReportModal({ open: false, status: null });
    }
  };

  return (
    <div className="owner_dashboard_container">
      <div className="owner_dashboard_header">
        <h2>Welcome, {user?.name}</h2>
      </div>

      {/* Analytics Section */}
      <div className="owner_dashboard_stats">
        <div className="owner_stat_card">
          <FaDumbbell className="owner_stat_icon" />
          <div className="owner_stat_content">
            <h3>Total Gyms</h3>
            <div className="owner_stat_number">{analytics.totalGyms}</div>
            <div className="owner_stat_trend positive">
              <FaArrowUp /> 12% this month
            </div>
          </div>
        </div>

        <div className="owner_stat_card">
          <FaUserCheck className="owner_stat_icon" />
          <div className="owner_stat_content">
            <h3>Registered Gyms</h3>
            <div className="owner_stat_number">{analytics.registeredGyms}</div>
            <div className="owner_stat_trend positive">
              <FaArrowUp /> 8% this month
            </div>
          </div>
        </div>

        <div className="owner_stat_card">
          <FaUserClock className="owner_stat_icon" />
          <div className="owner_stat_content">
            <h3>Pending Gyms</h3>
            <div className="owner_stat_number">{analytics.pendingGyms}</div>
            <div className="owner_stat_trend negative">
              <FaArrowDown /> 3% this month
            </div>
          </div>
        </div>
      </div>

      {/* Add Gym Button */}
      <div className="owner_add_gym">
        <Link to="/register-gym" className="owner_add_btn">
          <FaPlus /> Add New Gym
        </Link>
      </div>

      {/* Registered Gyms Section */}
      <div className="owner_content_section">
        <h3>Registered Gyms</h3>
        <div className="owner_gym_grid">
          {registeredGymsData.map((gym) => (
            <div key={gym._id} className="owner_gym_card">
              <div
                className="owner_gym_image"
                style={{
                  backgroundImage: `url(${gym.images[0] || defaultGymImage})`,
                }}
              ></div>
              <h4>{gym.name}</h4>
              <div className="owner_gym_location">
                <FaMapMarkerAlt />
                {gym.location && typeof gym.location.district === "string"
                  ? gym.location.district
                  : "N/A"}
              </div>
              <Link
                to={`/gym-dashboard/${gym._id}`}
                className="owner_manage_btn"
              >
                <FaCog /> Manage Gym
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Gyms Section */}
      <div className="dashboard-content-box">
        <h3>Pending Gyms</h3>
        {loadingPendingGyms ? (
          <div>Loading pending gyms...</div>
        ) : pendingGymsError ? (
          <div style={{ color: "red" }}>{pendingGymsError}</div>
        ) : pendingGyms.length === 0 ? (
          <div>No pending or rejected gyms found.</div>
        ) : (
          <div className="dashboard-gym-grid">
            {pendingGyms.map((gym) => (
              <div key={gym._id} className="dashboard-gym-item">
                <div
                  className="dashboard-gym-image"
                  style={{
                    backgroundImage: `url(${
                      (gym.images && gym.images[0]) || defaultGymImage
                    })`,
                  }}
                ></div>
                <div className="dashboard-gym-title-row">
                  <h4 className="dashboard-gym-title">
                    {gym.name}
                    {gym.status === "rejected" && (
                      <span className="dashboard-gym-rejected-badge">
                        <FaTimes className="dashboard-gym-rejected-icon" />{" "}
                        Rejected
                      </span>
                    )}
                  </h4>
                </div>
                <div className="dashboard-location">
                  <FaMapMarkerAlt />
                  {gym.location && typeof gym.location.district === "string"
                    ? gym.location.district
                    : "N/A"}
                </div>
                <button
                  className="dashboard-btn-primary"
                  style={{ width: "100%", marginBottom: 8 }}
                  onClick={() => handleTrackProgress(gym)}
                >
                  Track Progress
                </button>
                <button
                  className="dashboard-btn-secondary dashboard-btn-danger"
                  onClick={() => handleCancelRequest(gym._id)}
                  style={{ width: "100%" }}
                >
                  <FaTimes /> Cancel Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Client Feedback Section */}
      <div className="dashboard-content-box">
        <div className="dashboard-section-header">
          <h3>Recent Client Feedback</h3>
          <Link to="/reviews-dashboard">
            <button className="dashboard-btn-primary">
              <FaComments /> Manage Reviews
            </button>
          </Link>
        </div>
        <div className="dashboard-feedback-grid">
          {feedback.map((item) => (
            <div key={item._id} className="dashboard-feedback-item">
              <div className="dashboard-feedback-header">
                <FaUser />
                <h4>{item.clientName}</h4>
              </div>
              <div className="dashboard-feedback-message">{item.message}</div>
              <div className="dashboard-feedback-rating">
                <FaStar />
                {item.rating}/5
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Management Section - Enhanced */}
      <div className="owner_content_section">
        <h3>Equipment Management</h3>
        <div className="dashboard-action-cards">
          <Link to="/equipment-management" className="dashboard-action-card">
            <div className="dashboard-action-icon">
              <FaTools />
            </div>
            <div className="dashboard-action-content">
              <h4>Equipment Inventory</h4>
              <p>
                Track, maintain and manage all your gym equipment in one place
              </p>
            </div>
          </Link>
          <Link to="/register-gym" className="dashboard-action-card">
            <div className="dashboard-action-icon">
              <FaPlus />
            </div>
            <div className="dashboard-action-content">
              <h4>Add New Equipment</h4>
              <p>Register new equipment items for your gym facilities</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Report Generation Section */}
      <div className="dashboard-content-box dashboard-report-section">
        <h3 className="dashboard-report-title">
          <span role="img" aria-label="report">
            📊
          </span>{" "}
          Report Generation
        </h3>
        <p className="dashboard-report-desc">
          Download beautiful, detailed reports of your gyms by status. Export
          all fields, including images and locations!
        </p>
        <div className="dashboard-report-btn-row">
          <button
            className="dashboard-report-btn dashboard-report-registered"
            onClick={() => setReportModal({ open: true, status: "approved" })}
          >
            {" "}
            <FaUserCheck /> Registered Gyms Report{" "}
          </button>
          <button
            className="dashboard-report-btn dashboard-report-pending"
            onClick={() => setReportModal({ open: true, status: "pending" })}
          >
            {" "}
            <FaUserClock /> Pending Gyms Report{" "}
          </button>
          <button
            className="dashboard-report-btn dashboard-report-rejected"
            onClick={() => setReportModal({ open: true, status: "rejected" })}
          >
            {" "}
            <FaTimes /> Rejected Gyms Report{" "}
          </button>
        </div>
      </div>

      {/* Report Download Modal */}
      {reportModal.open && (
        <div className="report-modal-overlay">
          <div className="report-modal-window">
            <h3 className="report-modal-title">Download Report</h3>
            <p className="report-modal-desc">
              Choose your preferred format for the{" "}
              <b>
                {reportModal.status.charAt(0).toUpperCase() +
                  reportModal.status.slice(1)}
              </b>{" "}
              gyms report:
            </p>
            <div className="report-modal-btn-row">
              <button
                className="report-modal-btn report-modal-btn-excel"
                onClick={handleDownloadReport(reportModal.status, "csv")}
              >
                Excel (.csv)
              </button>
              <button
                className="report-modal-btn report-modal-btn-pdf"
                onClick={handleDownloadReport(reportModal.status, "pdf")}
              >
                PDF (.pdf)
              </button>
            </div>
            <button
              className="modal-close-btn"
              onClick={() => setReportModal({ open: false, status: null })}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Track Progress Modal */}
      {showTrackModal && trackGym && (
        <div
          className="modal-overlay"
          style={{
            zIndex: 1000,
            background: "rgba(0,0,0,0.22)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="modal-window"
            style={{
              maxWidth: 500,
              width: "95%",
              padding: 38,
              borderRadius: 20,
              background: "#fff",
              boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
              position: "relative",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: 18,
                right: 22,
                fontSize: 26,
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#444",
              }}
              onClick={closeTrackModal}
              aria-label="Close"
            >
              ×
            </button>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div
                style={{
                  width: 140,
                  height: 140,
                  margin: "0 auto 18px auto",
                  borderRadius: 18,
                  background: `url(${
                    (trackGym.images && trackGym.images[0]) || defaultGymImage
                  }) center/cover no-repeat`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              ></div>
              <h2
                style={{
                  margin: "10px 0 0 0",
                  fontWeight: 700,
                  fontSize: "2rem",
                  color: "#323232",
                  letterSpacing: "-1px",
                }}
              >
                {trackGym.name}
              </h2>
              <div style={{ color: "#888", marginBottom: 8, fontSize: 17 }}>
                <FaMapMarkerAlt /> {trackGym.location?.district || "N/A"}
              </div>
              <div
                style={{
                  borderBottom: "2px solid #f25c3b",
                  width: 80,
                  margin: "0 auto 12px auto",
                }}
              ></div>
            </div>
            {/* Progress Bar */}
            <div style={{ margin: "32px 0 16px 0" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    color:
                      trackGym.status === "pending"
                        ? "#007bff"
                        : trackGym.status === "approved"
                        ? "#2ecc40"
                        : "#e74c3c",
                    fontWeight: 600,
                  }}
                >
                  {trackGym.status === "pending"
                    ? "Pending"
                    : trackGym.status === "approved"
                    ? "Approved"
                    : "Rejected"}
                </span>
                <span style={{ color: "#888" }}>Admin Review</span>
              </div>
              <div
                style={{
                  height: 12,
                  borderRadius: 6,
                  background: "#eee",
                  width: "100%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: 12,
                    borderRadius: 6,
                    background:
                      trackGym.status === "approved"
                        ? "linear-gradient(90deg,#2ecc40 70%,#eee 70%)"
                        : trackGym.status === "pending"
                        ? "linear-gradient(90deg,#007bff 40%,#eee 40%)"
                        : "linear-gradient(90deg,#e74c3c 100%,#eee 0%)",
                    width: "100%",
                    transition: "background 0.5s",
                  }}
                ></div>
              </div>
              {trackGym.status === "rejected" && (
                <div
                  style={{
                    color: "#e74c3c",
                    marginTop: 16,
                    fontWeight: 500,
                    fontSize: 16,
                  }}
                >
                  Sorry for the rejection. Your gym did not meet the
                  requirements at this time.
                  <br />
                  Please review the feedback from admin or contact support for
                  more details.
                </div>
              )}
              {/* Motivational Quote */}
              <div
                style={{
                  marginTop: 18,
                  color: "#666",
                  fontStyle: "italic",
                  fontSize: 15,
                  textAlign: "center",
                }}
              >
                {trackGym.status === "pending"
                  ? "Great things take time. Your gym is under review!"
                  : trackGym.status === "approved"
                  ? "Congratulations! Your gym is approved and ready to shine."
                  : "Every setback is a setup for a comeback. Keep striving!"}
              </div>
            </div>
            <div
              style={{ margin: "24px 0 8px 0", color: "#333", fontSize: 16 }}
            >
              <strong>Notes:</strong> {trackGym.notes || "No additional notes."}
            </div>
            <button
              className="dashboard-btn-secondary dashboard-btn-danger"
              style={{
                width: "100%",
                marginTop: 16,
                fontWeight: 600,
                fontSize: 18,
              }}
              onClick={() => handleCancelRequest(trackGym._id)}
            >
              <FaTimes /> Cancel Request
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="modal-overlay"
          style={{
            zIndex: 1100,
            background: "rgba(0,0,0,0.22)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="modal-window"
            style={{
              maxWidth: 400,
              width: "96%",
              padding: 32,
              borderRadius: 14,
              background: "#fff",
              boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
              textAlign: "center",
              position: "relative",
            }}
          >
            <h3
              style={{
                fontWeight: 700,
                marginBottom: 14,
                color: "#222",
                fontSize: 22,
              }}
            >
              Are you sure you want to cancel this request?
            </h3>
            <div
              style={{ margin: "16px 0 28px 0", color: "#444", fontSize: 16 }}
            >
              This action will permanently delete your gym registration request.
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <button
                className="dashboard-btn-secondary"
                onClick={closeDeleteConfirm}
                style={{
                  flex: 1,
                  fontWeight: 600,
                  fontSize: 16,
                  padding: "10px 0",
                }}
                disabled={deleting}
              >
                No, Keep Request
              </button>
              <button
                className="dashboard-btn-danger"
                onClick={confirmDeleteGym}
                style={{
                  flex: 1,
                  fontWeight: 600,
                  fontSize: 16,
                  padding: "10px 0",
                }}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Cancel Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
