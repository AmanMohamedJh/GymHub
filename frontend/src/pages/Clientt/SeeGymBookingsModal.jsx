import React, { useEffect, useState } from "react";
import "./Styles/Modal.css";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaClock,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";

const SeeGymBookingsModal = ({
  gym,
  userId,
  open,
  onClose,
  token,
  onLeaveGym,
}) => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/gymBooking/bookingDetails/${userId}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch bookings");
        // Filter bookings for this gym only
        setBookings(data.filter((b) => b.gymId === gym.gymId._id));
      } catch (err) {
        setError(err.message || "Could not load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [gym, userId, open, token]);

  if (!open) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div
        className="modal-content"
        style={{
          maxWidth: "900px",
          width: "95vw",
          minHeight: 300,
          overflowY: "auto",
        }}
      >
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.2rem",
          }}
        >
          <h2 className="form-title" style={{ margin: 0 }}>
            Bookings for {gym?.gymId?.name || "this gym"}
          </h2>
          <button
            style={{
              background: "#fff",
              color: "#e53935",
              border: "2px solid #e53935",
              borderRadius: 6,
              padding: "8px 18px",
              fontWeight: 600,
              cursor: "pointer",
              marginLeft: 16,
            }}
            onClick={async () => {
              if (!window.confirm("Are you sure you want to leave this gym?"))
                return;
              try {
                // You may need to get registrationId from props or state
                const res = await fetch(
                  `/api/gyms/${gym.gymId._id}/Clientregistrations/${gym._id}`,
                  {
                    method: "DELETE",
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                  }
                );
                const data = await res.json();
                if (res.ok) {
                  if (typeof onLeaveGym === "function") onLeaveGym(gym._id);
                } else {
                  alert(data.error || "Failed to leave gym");
                }
              } catch (err) {
                alert("Network error");
              }
            }}
          >
            Leave Gym
          </button>
        </div>
        {loading ? (
          <div style={{ color: "#888", fontSize: "1.1rem", padding: 20 }}>
            Loading bookings...
          </div>
        ) : error ? (
          <div style={{ color: "red", fontSize: "1.1rem", padding: 20 }}>
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ color: "#888", fontSize: "1.05rem", padding: 20 }}>
            No bookings found for this gym.
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
            {bookings.map((booking, idx) => (
              <div
                key={booking._id || idx}
                className="dashboard-item"
                style={{
                  position: "relative",
                  minWidth: 320,
                  flex: "1 1 320px",
                  maxWidth: 400,
                  background: "#fff",
                  border: "1.5px solid #e53935",
                  borderRadius: 16,
                  boxShadow: "0 4px 16px rgba(229,57,53,0.07)",
                  padding: 28,
                  marginBottom: 24,
                  overflow: "visible",
                }}
              >
                {/* Status Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background:
                      booking.status === "Completed"
                        ? "#43a047"
                        : booking.status === "Cancelled"
                        ? "#757575"
                        : "#fb8c00",
                    color: "#fff",
                    padding: "6px 18px",
                    borderRadius: 18,
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: 1,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                    zIndex: 2,
                    textTransform: "uppercase",
                    border:
                      booking.status === "Completed"
                        ? "2px solid #388e3c"
                        : booking.status === "Cancelled"
                        ? "2px solid #616161"
                        : "2px solid #fb8c00",
                  }}
                >
                  {booking.status}
                </div>
                <h4 style={{ color: "#e53935", marginBottom: 8, marginTop: 8 }}>
                  {gym.gymId?.name}
                </h4>
                <div className="dashboard-item-details">
                  <p>
                    <FaCalendarAlt />{" "}
                    {new Date(booking.bookingTime).toLocaleString()}
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
                    <FaClipboardList /> Contact Number: {booking.contactNumber}
                  </p>
                  <div style={{ display: "flex", gap: "1rem", marginTop: 16 }}>
                    {/* Cancel Button: Only for Pending & future bookings */}
                    {booking.status === "Pending" &&
                      new Date(booking.bookingTime) > new Date() && (
                        <button
                          style={{
                            background: "#e53935",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            padding: "8px 18px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                          onClick={async () => {
                            try {
                              const res = await fetch(
                                `/api/gym-booking/cancel/${booking._id}`,
                                {
                                  method: "PUT",
                                  headers: {
                                    Authorization: token
                                      ? `Bearer ${token}`
                                      : "",
                                  },
                                }
                              );
                              const data = await res.json();
                              if (res.ok) {
                                setBookings((prev) =>
                                  prev.map((b) =>
                                    b._id === booking._id
                                      ? { ...b, status: "Cancelled" }
                                      : b
                                  )
                                );
                              } else {
                                alert(data.error || "Failed to cancel booking");
                              }
                            } catch (err) {
                              alert("Network error");
                            }
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    {/* Delete Button: Only for Completed or Cancelled bookings */}
                    {(booking.status === "Completed" ||
                      booking.status === "Cancelled") && (
                      <button
                        style={{
                          background: "#fff",
                          color: "#e53935",
                          border: "2px solid #e53935",
                          borderRadius: 6,
                          padding: "8px 18px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onClick={async () => {
                          if (
                            !window.confirm(
                              "Are you sure you want to delete this booking?"
                            )
                          )
                            return;
                          try {
                            const res = await fetch(
                              `/api/gym-booking/delete/${booking._id}`,
                              {
                                method: "DELETE",
                                headers: {
                                  Authorization: token ? `Bearer ${token}` : "",
                                },
                              }
                            );
                            const data = await res.json();
                            if (res.ok) {
                              setBookings((prev) =>
                                prev.filter((b) => b._id !== booking._id)
                              );
                            } else {
                              alert(data.error || "Failed to delete booking");
                            }
                          } catch (err) {
                            alert("Network error");
                          }
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeeGymBookingsModal;
