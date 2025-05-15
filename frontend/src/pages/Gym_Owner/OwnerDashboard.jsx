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

  // Equipment data for analytics
  const [ownerEquipment, setOwnerEquipment] = React.useState([]);
  const [loadingEquipment, setLoadingEquipment] = React.useState(false);
  const [equipmentError, setEquipmentError] = React.useState(null);

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

  // Fetch all equipment for owner
  useEffect(() => {
    const fetchOwnerEquipment = async () => {
      if (!user?.token) return;
      setLoadingEquipment(true);
      setEquipmentError(null);
      try {
        const res = await fetch("/api/equipment/owner", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch equipment.");
        const data = await res.json();
        setOwnerEquipment(data);
      } catch (err) {
        setEquipmentError(err.message || "Failed to fetch equipment.");
      } finally {
        setLoadingEquipment(false);
      }
    };
    fetchOwnerEquipment();
  }, [user?.token]);

  // Debug: Log sample gym data to inspect structure
  useEffect(() => {
    if (registeredGymsData.length > 0) {
      // eslint-disable-next-line
      console.log("Sample gym data:", registeredGymsData[0]);
    }
  }, [registeredGymsData]);

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

  // --- Corrected Dashboard Statistics (from fetched data) ---
  // Only use actual fetched data, not mock or hardcoded analytics
  const totalGyms =
    registeredGymsData.length +
    pendingGyms.filter((g) => g.status === "pending").length;
  const registeredGymsCount = registeredGymsData.length;
  const pendingGymsCount = pendingGyms.filter(
    (g) => g.status === "pending"
  ).length;
  const rejectedGymsCount = pendingGyms.filter(
    (g) => g.status === "rejected"
  ).length;

  // --- Equipment Analytics (calculated from ownerEquipment) ---
  const totalEquipmentOwned = ownerEquipment.length;
  const equipmentByCondition = ownerEquipment.reduce((acc, eq) => {
    acc[eq.condition] = (acc[eq.condition] || 0) + 1;
    return acc;
  }, {});
  const mostCommonEquipment = (() => {
    if (!ownerEquipment.length) return "-";
    const freq = {};
    ownerEquipment.forEach((eq) => {
      freq[eq.name] = (freq[eq.name] || 0) + 1;
    });
    let max = 0,
      name = "-";
    Object.entries(freq).forEach(([k, v]) => {
      if (v > max) {
        max = v;
        name = k;
      }
    });
    return name;
  })();

  const defaultGymImage = gymImage;

  // --- Reviews Data Fetching Logic (shared with OwnerReviewsDashboard) ---
  const [reviews, setReviews] = React.useState([]);
  const [reviewLoading, setReviewLoading] = React.useState(true);
  const [reviewError, setReviewError] = React.useState(null);

  React.useEffect(() => {
    const fetchGymsWithReviews = async () => {
      setReviewLoading(true);
      setReviewError(null);
      try {
        const token = user?.token;
        const res = await fetch(
          "http://localhost:4000/api/gym-owner/gym-reviews/gyms-with-reviews",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch gyms with reviews");
        const gymsWithReviews = await res.json();
        // Flatten all reviews and attach gym info for display
        const allReviews = gymsWithReviews.flatMap((gym) =>
          gym.reviews.map((review) => ({
            ...review,
            gymName: gym.name,
            gymLocation: gym.location?.city || gym.location?.district || "",
            gymId: gym._id,
          }))
        );
        setReviews(allReviews);
      } catch (err) {
        setReviewError("Failed to fetch gyms with reviews");
      } finally {
        setReviewLoading(false);
      }
    };
    if (user?.token) fetchGymsWithReviews();
  }, [user?.token]);

  // --- Review Statistics Calculation (same as OwnerReviewsDashboard) ---
  const filteredReviews = reviews; // No filtering for dashboard summary
  const avgRating =
    filteredReviews.length > 0
      ? (
          filteredReviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
          filteredReviews.length
        ).toFixed(1)
      : "-";
  const totalReviews = filteredReviews.length;
  const categoryFields = [
    { key: "staff", label: "Staff" },
    { key: "facilities", label: "Facilities" },
    { key: "cleanliness", label: "Cleanliness" },
    { key: "comfort", label: "Comfort" },
    { key: "freeWifi", label: "Free Wifi" },
    { key: "valueForMoney", label: "Value for money" },
    { key: "location", label: "Location" },
  ];
  const categoryAverages = {};
  categoryFields.forEach(({ key }) => {
    categoryAverages[key] =
      filteredReviews.length > 0
        ? (
            filteredReviews.reduce(
              (acc, r) => acc + (r.categoryRatings?.[key] || 0),
              0
            ) / filteredReviews.length
          ).toFixed(1)
        : "-";
  });
  const recentReviews = filteredReviews.slice(0, 2);

  return (
    <div className="owner_dashboard_container">
      <div className="owner_dashboard_header">
        <h2>Welcome, {user?.name}</h2>
      </div>

      {/* Analytics Section */}
      <div className="owner_dashboard_stats">
        {/* Total Gyms */}
        <div className="owner_stat_card">
          <span className="owner_stat_icon" style={{ background: "#e74c3c" }}>
            🏋️‍♂️
          </span>
          <div className="owner_stat_content">
            <h3>TOTAL GYMS</h3>
            <div className="owner_stat_number">{totalGyms}</div>
            {/* Example: <span className="stat_growth positive">↑ 12% this month</span> */}
          </div>
        </div>
        {/* Registered Gyms */}
        <div className="owner_stat_card">
          <span className="owner_stat_icon" style={{ background: "#e74c3c" }}>
            ✅
          </span>
          <div className="owner_stat_content">
            <h3>REGISTERED GYMS</h3>
            <div className="owner_stat_number">{registeredGymsCount}</div>
            {/* Example: <span className="stat_growth positive">↑ 8% this month</span> */}
          </div>
        </div>
        {/* Pending Gyms */}
        <div className="owner_stat_card">
          <span className="owner_stat_icon" style={{ background: "#e74c3c" }}>
            ⏳
          </span>
          <div className="owner_stat_content">
            <h3>PENDING GYMS</h3>
            <div className="owner_stat_number">{pendingGymsCount}</div>
            {/* Example: <span className="stat_growth negative">↓ 3% this month</span> */}
          </div>
        </div>
        {/* Rejected Gyms */}
        <div className="owner_stat_card">
          <span className="owner_stat_icon" style={{ background: "#e74c3c" }}>
            ❌
          </span>
          <div className="owner_stat_content">
            <h3>REJECTED GYMS</h3>
            <div className="owner_stat_number">{rejectedGymsCount}</div>
          </div>
        </div>
        {/* New: Approval Rate */}
        <div className="owner_stat_card">
          <span className="owner_stat_icon" style={{ background: "#27ae60" }}>
            ✅
          </span>
          <div className="owner_stat_content">
            <h3>APPROVAL RATE</h3>
            <div className="owner_stat_number">
              {Math.round(
                (registeredGymsData.length /
                  (registeredGymsData.length + pendingGyms.length)) *
                  100
              )}
              %
            </div>
          </div>
        </div>
        {/* New: Avg Registration Time */}
        <div className="owner_stat_card">
          <span className="owner_stat_icon" style={{ background: "#f1c40f" }}>
            ⏱️
          </span>
          <div className="owner_stat_content">
            <h3>AVG REG TIME</h3>
            <div className="owner_stat_number">
              {registeredGymsData.length > 0
                ? Math.round(
                    registeredGymsData
                      .map((g) => {
                        if (
                          g.createdAt &&
                          g.updatedAt &&
                          g.status === "approved"
                        ) {
                          const created = new Date(g.createdAt);
                          const approved = new Date(g.updatedAt);
                          return (approved - created) / (1000 * 60 * 60 * 24); // days
                        }
                        return null;
                      })
                      .filter(Boolean)
                      .reduce((a, b) => a + b, 0) / registeredGymsData.length
                  )
                : 0}{" "}
              days
            </div>
          </div>
        </div>
        {/* New: Latest Registered Gym */}
        <div className="owner_stat_card">
          <span className="owner_stat_icon" style={{ background: "#2980b9" }}>
            🏆
          </span>
          <div className="owner_stat_content">
            <h3>LATEST GYM</h3>
            <div className="owner_stat_number" style={{ fontSize: "1.08rem" }}>
              {registeredGymsData.length > 0
                ? registeredGymsData.reduce(
                    (latest, g) =>
                      !latest ||
                      new Date(g.createdAt) > new Date(latest.createdAt)
                        ? g
                        : latest,
                    null
                  ).name
                : "-"}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#888" }}>
              {registeredGymsData.length > 0
                ? new Date(
                    registeredGymsData.reduce(
                      (latest, g) =>
                        !latest ||
                        new Date(g.createdAt) > new Date(latest.createdAt)
                          ? g
                          : latest,
                      null
                    ).createdAt
                  ).toLocaleDateString()
                : ""}
            </div>
          </div>
        </div>
        {/* New: Oldest Active Gym */}
        <div className="owner_stat_card">
          <span className="owner_stat_icon" style={{ background: "#8e44ad" }}>
            🏅
          </span>
          <div className="owner_stat_content">
            <h3>OLDEST GYM</h3>
            <div className="owner_stat_number" style={{ fontSize: "1.08rem" }}>
              {registeredGymsData.length > 0
                ? registeredGymsData.reduce(
                    (oldest, g) =>
                      !oldest ||
                      new Date(g.createdAt) < new Date(oldest.createdAt)
                        ? g
                        : oldest,
                    null
                  ).name
                : "-"}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#888" }}>
              {registeredGymsData.length > 0
                ? new Date(
                    registeredGymsData.reduce(
                      (oldest, g) =>
                        !oldest ||
                        new Date(g.createdAt) < new Date(oldest.createdAt)
                          ? g
                          : oldest,
                      null
                    ).createdAt
                  ).toLocaleDateString()
                : ""}
            </div>
          </div>
        </div>
        {/* New: Districts Covered */}
        <div className="owner_stat_card">
          <span className="owner_stat_icon" style={{ background: "#16a085" }}>
            🗺️
          </span>
          <div className="owner_stat_content">
            <h3>DISTRICTS COVERED</h3>
            <div className="owner_stat_number">
              {
                new Set(
                  registeredGymsData
                    .map((g) => g.location?.district)
                    .filter(Boolean)
                ).size
              }
            </div>
          </div>
        </div>

        {/* Equipment Analytics: Total Equipment (from ownerEquipment) */}
        <div className="owner_stat_card">
          <span className="owner_stat_icon" style={{ background: "#c0392b" }}>
            🏋️‍♂️
          </span>
          <div className="owner_stat_content">
            <h3>TOTAL EQUIPMENT</h3>
            <div className="owner_stat_number">{totalEquipmentOwned}</div>
          </div>
        </div>
        {/* Equipment Analytics: Equipment by Condition */}
        <div className="owner_stat_card">
          <span className="owner_stat_icon" style={{ background: "#2980b9" }}>
            🛠️
          </span>
          <div className="owner_stat_content">
            <h3>BY CONDITION</h3>
            <div className="owner_stat_number" style={{ fontSize: "1.08rem" }}>
              {Object.entries(equipmentByCondition).length === 0
                ? "-"
                : Object.entries(equipmentByCondition).map(([cond, count]) => (
                    <span key={cond} style={{ marginRight: 8 }}>
                      {cond}: {count}
                    </span>
                  ))}
            </div>
          </div>
        </div>
        {/* Equipment Analytics: Most Common Equipment */}
        <div className="owner_stat_card">
          <span className="owner_stat_icon" style={{ background: "#16a085" }}>
            📦
          </span>
          <div className="owner_stat_content">
            <h3>MOST COMMON</h3>
            <div className="owner_stat_number">{mostCommonEquipment}</div>
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

      {/* Recent Client Feedback Section - BUTTON FIXED TO RIGHT CORNER */}
      <div
        className="gymdetails-reviews-preview"
        style={{
          marginTop: 32,
          marginBottom: 32,
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 2px 10px rgba(31,38,135,0.08)",
          padding: "2rem 2.2rem 2.2rem 2.2rem",
        }}
      >
        <div
          className="gymdetails-reviews-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span
            className="dashboard-section-title"
            style={{ color: "#e53935", fontSize: 26, fontWeight: 700 }}
          >
            Recent Client Feedback
          </span>
          <button
            className="dashboard-btn-secondary"
            style={{
              fontWeight: 600,
              fontSize: 16,
              background: "#e53935",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "0.38rem 1.1rem",
              minWidth: "unset",
              maxWidth: 180,
              width: "auto",
              boxShadow: "0 1px 6px rgba(229,57,53,0.07)",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "background 0.18s, color 0.18s",
              justifyContent: "center",
              whiteSpace: "nowrap",
            }}
            onClick={() => navigate("/owner-reviews-dashboard")}
            type="button"
          >
            <FaComments style={{ marginRight: 8, fontSize: 18 }} />
            Manage Reviews
          </button>
        </div>
        {/* Loader/Error for reviews */}
        {reviewLoading ? (
          <div
            style={{ margin: "1.5rem 0", color: "#e53935", fontWeight: 600 }}
          >
            Loading reviews...
          </div>
        ) : reviewError ? (
          <div
            style={{ margin: "1.5rem 0", color: "#e53935", fontWeight: 600 }}
          >
            {reviewError}
          </div>
        ) : (
          <>
            <div
              className="gymdetails-reviewstats-box"
              style={{ marginBottom: 18 }}
            >
              <span className="gymdetails-reviewstats-score">{avgRating}</span>
              <span className="gymdetails-reviewstats-status">
                {avgRating !== "-" && avgRating >= 7
                  ? "Good"
                  : avgRating > 0
                  ? "Average"
                  : "-"}
              </span>
              <span className="gymdetails-reviewstats-count">
                · {totalReviews} reviews
              </span>
            </div>
            <div
              className="gymdetails-reviewstats-categories"
              style={{ marginBottom: 24 }}
            >
              {categoryFields.map(({ key, label }) => (
                <div className="gymdetails-reviewstats-category" key={key}>
                  <span>{label}</span>
                  <div className="gymdetails-reviewstats-barwrap">
                    <div
                      className="gymdetails-reviewstats-bar"
                      style={{
                        width:
                          categoryAverages[key] !== "-"
                            ? `${(categoryAverages[key] / 10) * 100}%`
                            : "0%",
                        background:
                          categoryAverages[key] !== "-" &&
                          categoryAverages[key] >= 7
                            ? "#e53935"
                            : "#b71c1c",
                      }}
                    ></div>
                  </div>
                  <span className="gymdetails-reviewstats-catscore">
                    {categoryAverages[key]}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="gymdetails-reviews-list"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.5rem",
                marginTop: "2.5rem",
                justifyContent: "flex-start",
              }}
            >
              {recentReviews.length === 0 ? (
                <span style={{ color: "#888", fontWeight: 500 }}>
                  No reviews yet.
                </span>
              ) : (
                recentReviews.map((r) => (
                  <div
                    key={r._id}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 2px 10px rgba(31,38,135,0.08)",
                      padding: "1.2rem 1.5rem",
                      minWidth: 240,
                      maxWidth: 340,
                      flex: "1 1 240px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem",
                      border: "1px solid #f2f2f2",
                      color: "#222",
                      opacity: 1,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: "#222",
                        marginBottom: 2,
                        opacity: 1,
                        background: "none",
                      }}
                    >
                      {r.clientName || "Client"}
                    </span>
                    <span style={{ fontSize: "1.3rem", marginBottom: 4 }}>
                      {r.emoji || "🙂"}
                    </span>
                    <span
                      style={{
                        color: "#e53935",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        marginBottom: 2,
                      }}
                    >
                      Rating: {r.rating || "-"}
                    </span>
                    <span
                      style={{
                        color: "#444",
                        fontSize: "1rem",
                        opacity: 1,
                        background: "none",
                      }}
                    >
                      {r.heading && (
                        <b>
                          {r.heading}
                          <br />
                        </b>
                      )}
                      {r.content}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
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
