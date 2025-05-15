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
    FaBullseye,
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
        downloadCSVReport,
        fetchJoinedGyms,
        fetchUpcomingSessions,
        cancelTrainerSession,
        submitGymBooking,
        fetchGymPublicDetails,
    } = useDashboard();

    // Joined gyms state
    const [joinedGyms, setJoinedGyms] = useState([]);
    const [joinedGymsLoading, setJoinedGymsLoading] = useState(false);
    const [joinedGymsError, setJoinedGymsError] = useState(null);

    // Booking data state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalBookings, setTotalBookings] = useState(null);
    const [upcomingBookings, setUpcomingBookings] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [bookingUpdated, setBookingUpdated] = useState(false);

    // Modal and booking form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingModalGym, setBookingModalGym] = useState(null);
    const [modalGymDetails, setModalGymDetails] = useState(null);
    const [modalAmenitiesLoading, setModalAmenitiesLoading] = useState(false);
    const [bookingForm, setBookingForm] = useState({
        fullName: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        date: "",
        time: "",
        amenities: [],
    });
    const [bookingSubmitStatus, setBookingSubmitStatus] = useState(null);
    const [showBookingSuccess, setShowBookingSuccess] = useState(false);
    const [seeBookingsGym, setSeeBookingsGym] = useState(null);
    const [seeBookingsModalOpen, setSeeBookingsModalOpen] = useState(false);

    // Fitness summary
    const [fitnessSummary, setFitnessSummary] = useState({
        totalWorkouts: 0,
        totalGoals: 0,
        averageProgress: 0,
    });

    // Upcoming trainer sessions
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const navigate = useNavigate();

    // Fetch joined gyms
    useEffect(() => {
        const loadJoinedGyms = async () => {
            setJoinedGymsLoading(true);
            setJoinedGymsError(null);
            try {
                const gyms = await fetchJoinedGyms();
                setJoinedGyms(Array.isArray(gyms) ? gyms : []);
            } catch (err) {
                setJoinedGymsError(err.message || "Failed to load joined gyms");
            } finally {
                setJoinedGymsLoading(false);
            }
        };
        if (user?._id) {
            loadJoinedGyms();
        }
    }, [user, fetchJoinedGyms]);

    // Fetch all bookings and totals when profile or bookings update
    useEffect(() => {
        const loadBookingsAndTotals = async () => {
            setLoading(true);
            setError(null);
            try {
                const allBookings = await fetchAllBookings();
                setBookings(allBookings || []);

                const totals = await fetchTotalBookings();
                setTotalBookings(totals.totalBookings);
                setUpcomingBookings(totals.upcomingBookings);
            } catch (err) {
                setError(err.message || "Error fetching bookings");
            } finally {
                setLoading(false);
            }
        };

        if (profile) {
            loadBookingsAndTotals();
            setFitnessSummary(getFitnessSummary());
        }
    }, [profile, bookingUpdated, fetchAllBookings, fetchTotalBookings, getFitnessSummary]);

    // Fetch upcoming trainer sessions
    useEffect(() => {
        const loadUpcomingSessions = async () => {
            try {
                const sessions = await fetchUpcomingSessions();
                setUpcomingSessions(Array.isArray(sessions) ? sessions : []);
            } catch {
                setUpcomingSessions([]);
            }
        };
        if (user?._id) {
            loadUpcomingSessions();
        }
    }, [user, bookingUpdated, fetchUpcomingSessions]);

    // Open booking modal and fetch gym public details
    const handleOpenBookingModal = async (gymReg) => {
        setBookingModalGym(gymReg);
        setModalAmenitiesLoading(true);
        setModalGymDetails(null);
        setBookingForm({
            fullName: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            date: "",
            time: "",
            amenities: [],
        });
        setBookingSubmitStatus(null);
        setIsModalOpen(true);

        try {
            const gymDetails = await fetchGymPublicDetails(gymReg.gymId._id);
            setModalGymDetails(gymDetails);
        } catch {
            setModalGymDetails(null);
        } finally {
            setModalAmenitiesLoading(false);
        }
    };

    // Booking form handlers
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

    // Submit gym booking using hook method
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        await submitGymBooking({
            bookingModalGym,
            bookingForm,
            user,
            setBookingSubmitStatus,
            setIsModalOpen,
            setShowBookingSuccess,
            setBookingUpdated,
        });
    };

    // Cancel trainer session booking
    const handleCancel = async (bookingId) => {
        try {
            await cancelTrainerSession(bookingId);
            alert("Session has been successfully cancelled.");
            setBookingUpdated((prev) => !prev);
        } catch (error) {
            console.error("Cancellation error:", error);
            alert("An error occurred while cancelling the session. Please try again.");
        }
    };

    // Delete gym booking
    const handleDelete = async (bookingId) => {
        try {
            await deleteBooking(bookingId);
            setBookings((prev) => prev.filter((b) => b._id !== bookingId));
            alert("Booking deleted successfully");
            setBookingUpdated((prev) => !prev);
        } catch (error) {
            alert("An error occurred while deleting the booking");
            console.error("Delete error:", error);
        }
    };

    // CSV download handler
    const handleDownloadCSV = async () => {
        await downloadCSVReport();
    };

    return (
        <div className="dashboard-main-container">
            <div className="dashboard-header-main">
                <h2>Welcome, {user?.name}</h2>
            </div>

            {/* Statistics Section */}
            <div className="dashboard-statistics-section" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '2rem 1.5rem',
                background: '#fff',
                borderRadius: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                marginBottom: '2rem',
                gap: '2rem',
                flexWrap: 'wrap'
            }}>
                <div className="dashboard-stat-block" style={{ flex: 1, minWidth: 180, textAlign: 'center' }}>
                    <FaChartLine className="dashboard-icon" style={{ fontSize: '2.2rem', color: '#e74c3c' }} />
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#222', margin: '0.5rem 0' }}>
                        {Math.round(fitnessSummary.averageProgress)}%
                    </div>
                    <div style={{ fontSize: '1.1rem', color: '#888' }}>Progress</div>
                </div>
                <div className="dashboard-stat-block" style={{ flex: 1, minWidth: 180, textAlign: 'center' }}>
                    <FaBullseye className="dashboard-icon" style={{ fontSize: '2.2rem', color: '#2980b9' }} />
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#222', margin: '0.5rem 0' }}>
                        {fitnessSummary.totalGoals}
                    </div>
                    <div style={{ fontSize: '1.1rem', color: '#888' }}>Total Goals</div>
                </div>
                <div className="dashboard-stat-block" style={{ flex: 1, minWidth: 180, textAlign: 'center' }}>
                    <FaDumbbell className="dashboard-icon" style={{ fontSize: '2.2rem', color: '#27ae60' }} />
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#222', margin: '0.5rem 0' }}>
                        {fitnessSummary.totalWorkouts}
                    </div>
                    <div style={{ fontSize: '1.1rem', color: '#888' }}>Total Workouts</div>
                </div>
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
                {/* <h2>All Bookings</h2> */}
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
                    ) : null}
                </div>

                {/* Report Generation Section */}
                <div className="report-generation-section" style={{ marginTop: '32px', padding: '24px', background: '#181b20', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#fff', marginBottom: '18px' }}>Generate Report</h2>
                    <button
                        style={{
                            backgroundColor: '#e74c3c',
                            color: '#fff',
                            padding: '10px 24px',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                        }}
                        onClick={handleDownloadCSV}
                    >
                        Download CSV Report
                    </button>
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
