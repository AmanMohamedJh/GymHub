import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import SeeGymBookingsModal from "./SeeGymBookingsModal";
import { Link } from "react-router-dom";
import {
  FaDumbbell,
  FaCalendarAlt,
  FaChartLine,
  FaUser,
  FaStar,
  FaClock,
  FaClipboardList,
  FaMapMarkerAlt,
  FaTrashAlt,
} from "react-icons/fa";
import "./Styles/dashboard.css";
import { useClientProfile } from "../../context/Client/clientProfileContex";
import { useDashboard } from "../../hooks/Client/DashbordHooks";

const ClientDashboard = () => {
  const { user } = useAuthContext();
  const { profile } = useClientProfile();
  const {
    fetchTotalBookings,
    fetchAllBookings,
    cancelBooking,
    deleteBooking,
    getFitnessSummary,
  } = useDashboard();

  // State for joined gyms
  const [joinedGyms, setJoinedGyms] = useState([]);
  const [joinedGymsLoading, setJoinedGymsLoading] = useState(false);
  const [joinedGymsError, setJoinedGymsError] = useState(null);

  useEffect(() => {
    // Fetch joined gyms for the client
    const fetchJoinedGyms = async () => {
      if (!user?._id) return;
      setJoinedGymsLoading(true);
      setJoinedGymsError(null);
      try {
        const res = await fetch(
          `/api/users/${user._id}/ClientGymRegistrations`,
          {
            headers: {
              Authorization: user?.token ? `Bearer ${user.token}` : "",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch joined gyms");
        const data = await res.json();
        setJoinedGyms(Array.isArray(data) ? data : []);
      } catch (err) {
        setJoinedGymsError(err.message || "Could not load joined gyms");
      } finally {
        setJoinedGymsLoading(false);
      }
    };
    fetchJoinedGyms();
  }, [user]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBookings, setTotalBookings] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingModalGym, setBookingModalGym] = useState(null);
  const [modalGymDetails, setModalGymDetails] = useState(null);
  const [modalAmenitiesLoading, setModalAmenitiesLoading] = useState(false);
  // --- See Bookings Modal State ---
  const [seeBookingsModalOpen, setSeeBookingsModalOpen] = useState(false);
  const [seeBookingsGym, setSeeBookingsGym] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    date: "",
    time: "",
    amenities: [],
  });
  const [bookingSubmitStatus, setBookingSubmitStatus] = useState(null);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  // --- Booking Modal Handlers ---
  const handleOpenBookingModal = async (gymReg) => {
    setBookingModalGym(gymReg);
    setModalAmenitiesLoading(true);
    setModalGymDetails(null);
    setBookingForm((form) => ({
      ...form,
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      date: "",
      time: "",
      amenities: [],
    }));
    setBookingSubmitStatus(null);
    setIsModalOpen(true);
    try {
      const res = await fetch(`/api/gym/public/${gymReg.gymId._id}`);
      if (res.ok) {
        const data = await res.json();
        setModalGymDetails(data);
      } else {
        setModalGymDetails(null);
      }
    } catch {
      setModalGymDetails(null);
    } finally {
      setModalAmenitiesLoading(false);
    }
  };
  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleBookingAmenityChange = (e) => {
    const { value, checked } = e.target;
    setBookingForm((prev) => {
      const amenities = checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((a) => a !== value);
      return { ...prev, amenities };
    });
  };
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingSubmitStatus(null);
    if (!bookingModalGym) return;
    try {
      const res = await fetch(
        `/api/gym-booking/${bookingModalGym.gymId._id}/bookGym`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
          body: JSON.stringify({ ...bookingForm, clientId: user?._id }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setBookingSubmitStatus("Booking successful!");
        setIsModalOpen(false);
        setShowBookingSuccess(true);
      } else {
        setBookingSubmitStatus(data.error || "Booking failed.");
      }
    } catch {
      setBookingSubmitStatus("Network error. Please try again.");
    }
  };
  const [bookingUpdated, setBookingUpdated] = useState(false);

  const [fitnessSummary, setFitnessSummary] = useState({
    totalWorkouts: 0,
    totalGoals: 0,
    averageProgress: 0,
  });

  // --- Upcoming Trainer Sessions for this client ---
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcomingSessions = async () => {
      if (!user?._id) return;
      try {
        const res = await fetch(
          `/api/clientTrainerSessions/client/${user._id}/full`,
          {
            headers: {
              Authorization: user?.token ? `Bearer ${user.token}` : "",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch upcoming sessions");
        const bookings = await res.json();
        setUpcomingSessions(Array.isArray(bookings) ? bookings : []);
      } catch (err) {
        setUpcomingSessions([]);
      }
    };
    fetchUpcomingSessions();
  }, [user, bookingUpdated]);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        const [{ totalBookings, upcomingBookings }, allBookings, fitnessData] =
          await Promise.all([
            fetchTotalBookings(),
            fetchAllBookings(),
            getFitnessSummary(),
          ]);
        setTotalBookings(totalBookings);
        setUpcomingBookings(upcomingBookings);
        setBookings(allBookings);
        setFitnessSummary(fitnessData);
      } catch (err) {
        setError(
          err.message || "An error occurred while loading dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, [profile, bookingUpdated]);

  // Cancel a trainer session booking (not gym booking!)
  const cancelTrainerSession = async (bookingId) => {
    try {
      const res = await fetch(
        `/api/clientTrainerSessions/cancel/${bookingId}`,
        {
          method: "PATCH", // PATCH matches backend route
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
        }
      );
      let data;
      try {
        data = await res.json();
      } catch {
        // If response is not JSON (e.g., HTML error page)
        throw new Error("Server error or route not found");
      }
      if (!res.ok) throw new Error(data.error || "Failed to cancel session");
      return true;
    } catch (err) {
      throw err;
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await cancelTrainerSession(bookingId);
      alert("Session has been successfully cancelled.");
      setBookingUpdated((prev) => !prev);
    } catch (error) {
      console.error("Cancellation error:", error);
      alert(
        "An error occurred while cancelling the session. Please try again."
      );
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      await deleteBooking(bookingId);
      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
      alert("Booking deleted successfully");
      setBookingUpdated((prev) => !prev);
    } catch (error) {
      alert("An error occurred while deleting the booking");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="dashboard-main-container">
      <div className="dashboard-header-main">
        <h2>Welcome, {user?.name}</h2>
      </div>

      {/* Analytics Section */}
      <div className="dashboard-stats-grid">
        <div
          className="dashboard-stat-item"
          onClick={() => setIsModalOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <FaDumbbell className="dashboard-icon" />
          <h3>Total Bookings</h3>
          <div className="dashboard-number">
            {loading ? "..." : totalBookings || 0}
          </div>
        </div>
        <div className="dashboard-stat-item">
          <FaCalendarAlt className="dashboard-icon" />
          <h3>Upcoming Bookings</h3>
          <div className="dashboard-number">
            {loading ? "..." : upcomingBookings || 0}
          </div>
        </div>
        <div className="dashboard-stat-item">
          <FaCalendarAlt className="dashboard-icon" />
          <h3>Upcoming Classes</h3>
          <div className="dashboard-number">{upcomingSessions.length}</div>
        </div>
        <div className="dashboard-stat-item">
          <FaChartLine className="dashboard-icon" />
          <h3>Progress Score</h3>
          <div className="dashboard-number">
            {fitnessSummary.averageProgress}%
          </div>
        </div>
      </div>

      {/* Joined Gyms Section */}
      <div className="dashboard-content-box">
        <div className="dashboard-section-header">
          <h3>Manage Gym Bookings</h3>
        </div>
        <div className="dashboard-grid">
          {joinedGymsLoading ? (
            <div>Loading joined gyms...</div>
          ) : joinedGymsError ? (
            <div style={{ color: "red" }}>{joinedGymsError}</div>
          ) : joinedGyms.length === 0 ? (
            <div>You have not joined any gyms yet.</div>
          ) : (
            joinedGyms.map((gymReg, idx) => (
              <div
                key={gymReg._id || idx}
                className="dashboard-item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 160,
                }}
              >
                <div>
                  <h4>{gymReg.gymId?.name || "Unknown Gym"}</h4>
                  <div className="dashboard-item-details">
                    <p>
                      <FaCalendarAlt /> Joined:{" "}
                      {gymReg.startDate
                        ? new Date(gymReg.startDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <FaClipboardList /> Status: {gymReg.status || "Active"}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <button
                    style={{
                      background: "#e53935",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      padding: "10px 24px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                    onClick={() => handleOpenBookingModal(gymReg)}
                  >
                    Book a class
                  </button>
                  <button
                    style={{
                      background: "#fff",
                      color: "#e53935",
                      border: "2px solid #e53935",
                      borderRadius: 6,
                      padding: "10px 24px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                    onClick={() => {
                      setSeeBookingsGym(gymReg);
                      setSeeBookingsModalOpen(true);
                    }}
                  >
                    See Bookings
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upcoming Classes Section */}
      <div className="dashboard-content-box">
        <div className="dashboard-section-header">
          <h3>Upcoming Classes</h3>
          <button
            className="dashboard-btn-primary"
            style={{ float: "right", marginBottom: 16 }}
            onClick={() => navigate("/client-browse-trainer")}
          >
            <FaCalendarAlt style={{ marginRight: 6 }} /> Book New Class
          </button>
        </div>
        <div className="dashboard-grid">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((booking) => {
              const s = booking.trainerSession || {};
              return (
                <div
                  key={booking._id}
                  className="dashboard-item"
                  style={{ position: "relative" }}
                >
                  <h4 style={{ fontWeight: 600 }}>
                    {s.title || "Trainer Session"}
                  </h4>
                  <div
                    className="dashboard-item-details"
                    style={{ marginBottom: 8 }}
                  >
                    <p>
                      <strong>Date:</strong> <FaCalendarAlt />{" "}
                      {s.date ? new Date(s.date).toLocaleDateString() : "N/A"}
                    </p>
                    <p>
                      <strong>Time:</strong> <FaClock /> {s.time || "N/A"}
                    </p>
                    <p>
                      <strong>Trainer Name:</strong> <FaUser />{" "}
                      {s.trainerName ||
                        (s.trainer && s.trainer.name) ||
                        "Trainer"}
                    </p>
                    <p>
                      <strong>Type:</strong> {s.type || "N/A"}
                    </p>
                    <p>
                      <strong>Duration:</strong> {s.duration || "N/A"}
                    </p>
                  </div>
                  <button
                    style={{
                      padding: "6px 18px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 15,
                      background: "#e74c3c",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                    }}
                    onClick={() => handleCancel(booking._id)}
                  >
                    Cancel
                  </button>
                </div>
              );
            })
          ) : (
            <div>No upcoming trainer sessions found.</div>
          )}
        </div>
      </div>

      {/* Progress Summary Section */}
      <div className="dashboard-content-box">
        <div className="dashboard-section-header">
          <h3>Progress Summary</h3>
          <Link
            to="/client-progress-tracking"
            style={{ textDecoration: "none" }}
          >
            <button className="dashboard-btn-primary">
              <FaChartLine /> View Full Progress
            </button>
          </Link>
        </div>
        <div className="dashboard-grid">
          <div className="dashboard-item">
            <h4>Total Workouts</h4>
            <div className="dashboard-item-details">
              <p>
                <FaStar /> {fitnessSummary.totalWorkouts}
              </p>
            </div>
          </div>
          <div className="dashboard-item">
            <h4>Total Goals</h4>
            <div className="dashboard-item-details">
              <p>
                <FaStar /> {fitnessSummary.totalGoals}
              </p>
            </div>
          </div>
          <div className="dashboard-item">
            <h4>Average Progress</h4>
            <div className="dashboard-item-details">
              <p>
                <FaStar /> {fitnessSummary.averageProgress}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for All Bookings */}
      <>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
              <h2 className="form-title" style={{ marginBottom: "1.2rem" }}>
                Book a Class
              </h2>
              {bookingModalGym?.gymId?.name && (
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "1.15rem",
                    marginBottom: "0.7rem",
                    color: "#e74c3c",
                  }}
                >
                  Gym: {bookingModalGym.gymId.name}
                </div>
              )}
              <form className="modal-form" onSubmit={handleBookingSubmit}>
                <div className="modal-form-row">
                  <div className="modal-form-section">
                    <label htmlFor="fullName">Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="client"
                      value={bookingForm.fullName}
                      onChange={handleBookingInputChange}
                      required
                      readOnly
                    />
                  </div>
                  <div className="modal-form-section">
                    <label htmlFor="bookingDate">Booking Date</label>
                    <input
                      type="date"
                      id="bookingDate"
                      name="date"
                      value={bookingForm.date}
                      onChange={handleBookingInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-form-row">
                  <div className="modal-form-section">
                    <label htmlFor="timeSlot">Time Slot</label>
                    <input
                      type="time"
                      id="timeSlot"
                      name="time"
                      value={bookingForm.time}
                      onChange={handleBookingInputChange}
                      required
                    />
                  </div>
                  <div className="modal-form-section">
                    <label htmlFor="contactNumber">Contact Number</label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="phone"
                      placeholder="07XXXXXXXX"
                      value={bookingForm.phone}
                      onChange={handleBookingInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-form-row">
                  <div className="modal-form-section">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="client@gmail.com"
                      value={bookingForm.email}
                      onChange={handleBookingInputChange}
                      required
                      readOnly
                    />
                  </div>
                  <div className="modal-form-section">
                    <label htmlFor="amenities">Amenities</label>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        minHeight: 32,
                      }}
                    >
                      {modalAmenitiesLoading ? (
                        <span style={{ color: "#888", fontSize: "0.98rem" }}>
                          Loading amenities...
                        </span>
                      ) : modalGymDetails &&
                        Array.isArray(modalGymDetails.amenities) &&
                        modalGymDetails.amenities.length > 0 ? (
                        modalGymDetails.amenities.map((amenity, idx) => (
                          <label key={idx} style={{ fontWeight: 500 }}>
                            <input
                              type="checkbox"
                              value={amenity}
                              checked={bookingForm.amenities.includes(amenity)}
                              onChange={handleBookingAmenityChange}
                            />{" "}
                            {amenity}
                          </label>
                        ))
                      ) : (
                        <span style={{ color: "#888", fontSize: "0.98rem" }}>
                          No amenities available for this gym.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button type="submit" className="modal-submit-button">
                  BOOK NOW
                </button>
                {bookingSubmitStatus && (
                  <div
                    style={{
                      color: bookingSubmitStatus.includes("success")
                        ? "green"
                        : "red",
                      marginTop: 10,
                    }}
                  >
                    {bookingSubmitStatus}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
        <h2>All Bookings</h2>
        <div className="dashboard-grid">
          {bookings.length > 0 ? (
            bookings.map((booking, index) => {
              const bookingTime = new Date(booking.bookingTime);
              const currentTime = new Date();
              const isFutureBooking =
                bookingTime > currentTime && booking.status !== "Cancelled";
              return (
                <div key={index} className="dashboard-item">
                  <h4>
                    <strong>{booking.gymName}</strong>
                  </h4>
                  <div className="dashboard-item-details">
                    <p>
                      <FaMapMarkerAlt /> {booking.gymLocation?.street},{" "}
                      {booking.gymLocation?.city},{" "}
                      {booking.gymLocation?.district}
                    </p>
                    <p>
                      <FaCalendarAlt /> {bookingTime.toLocaleString()}
                    </p>
                    <p>
                      <FaClipboardList /> Amenities:{" "}
                      {booking.selectedAmenities.join(", ")}
                    </p>
                    <p>
                      <FaClock /> Status: {booking.status}
                    </p>
                    <p>
                      <FaClipboardList /> Contact Email: {booking.email}
                    </p>
                    <p>
                      <FaClipboardList /> Contact Number:{" "}
                      {booking.contactNumber}
                    </p>
                    <div className="booking-actions">
                      {isFutureBooking ? (
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancel(booking._id)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(booking._id)}
                        >
                          <FaTrashAlt />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No bookings available</div>
          )}
        </div>
      </>

      {/* See Bookings Modal */}
      <SeeGymBookingsModal
        gym={seeBookingsGym}
        userId={user?._id}
        open={seeBookingsModalOpen}
        onClose={() => setSeeBookingsModalOpen(false)}
        token={user?.token}
        onLeaveGym={(registrationId) => {
          setJoinedGyms((prev) =>
            prev.filter((reg) => reg._id !== registrationId)
          );
          setSeeBookingsModalOpen(false);
        }}
      />

      {/* Booking Success Popup */}
      {showBookingSuccess && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <h2>Booking Successful!</h2>
            <p>Your booking was submitted successfully.</p>
            <div className="success-popup-buttons">
              <button
                className="success-btn"
                onClick={() => setShowBookingSuccess(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
