import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import Modal from "../Clientt/Modal";
import "./Styles/TrainerDetails.css";

const statusColors = {
  "active": "#27ae60",
  "paused": "#f1c40f",
  "cancelled": "#e74c3c"
};

const TrainerDetails = () => {
  // ...existing code...
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this session booking?')) return;
    try {
      const response = await fetch(`/api/clientTrainerSessions/cancel/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        }
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to cancel session.');
        return;
      }
      setSessions(prev => prev.map(s =>
        s.bookingId === bookingId
          ? { ...s, joined: false, bookingId: undefined }
          : s
      ));
      alert('Session booking cancelled and deleted.');
    } catch (err) {
      alert('Failed to cancel session.');
    }
  };

  const { trainerId } = useParams();
  const { user } = useAuthContext();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  // Form state
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    emergencyContact: "",
    communication: "Email",
    notes: "",
    consent: false,
    saveDetails: false
  });

  // Use only public endpoints: treat trainerId as userId
useEffect(() => {
  async function fetchData() {
    setLoading(true);
    setError("");
    setSessions([]);

    if (!trainerId || typeof trainerId !== "string" || trainerId.length < 10) {
      setError("Invalid or missing trainerId in URL.");
      setLoading(false);
      return;
    }

    try {
      // Fetch sessions for the trainer
      const sessionsRes = await fetch(`/api/trainer/session/active/${trainerId}`);
      const sessionsData = await sessionsRes.json();
      if (!Array.isArray(sessionsData)) throw new Error("Sessions not found or invalid response.");

      // Fetch bookings for the user
      const bookingsRes = await fetch(`/api/clientTrainerSessions/client/${user._id}`, {
        headers: {
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        }
      });
      const bookingsData = await bookingsRes.json();
      const bookedSessionIds = new Set(bookingsData.map(b => b.sessionBookingId));

      // Mark sessions as joined if user has a booking, and attach bookingId
      const mergedSessions = sessionsData.map(session => {
        const userBooking = bookingsData.find(b => b.sessionBookingId === session._id);
        return {
          ...session,
          joined: !!userBooking,
          bookingId: userBooking ? userBooking._id : undefined
        };
      });

      setSessions(mergedSessions);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch sessions.");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  if (user?._id) {
    fetchData();
  }
}, [trainerId, user?._id, user?.token]);


  // Only log when sessions, error, or loading changes
  React.useEffect(() => {
    console.log("[TrainerDetails] Render: loading=", loading, "error=", error, "sessions=", sessions);
  }, [sessions, error, loading]);

  // Handle open modal
  const handleJoinClick = (session) => {
    setSelectedSession(session);
    setModalOpen(true);
    setForm(f => ({
      ...f,
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || ""
    }));
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSession(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!selectedSession) return;
    try {
      // Prepare booking payload
      const payload = {
        sessionBookingId: selectedSession._id,
        clientId: user?._id, // ensure clientId is included just like gym booking
        clientName: user?.name || '',
        clientEmail: user?.email || '',
        phoneNumber: form.phone,
        emergencyContact: form.emergencyContact,
        preferredCommunication: form.communication,
        fitnessGoals: form.notes,

      };

      // Send booking request
      const response = await fetch('/api/clientTrainerSessions/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If using JWT auth, include:
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to join session.');
        return;
      }
      // Optionally save details
      if (form.saveDetails) {
        localStorage.setItem('clientBookingDetails', JSON.stringify({
          phone: form.phone,
          emergencyContact: form.emergencyContact,
          communication: form.communication,
          notes: form.notes
        }));
      }
      // Update UI: change button to 'Cancel Session' for this session
      setSessions(prev => prev.map(s =>
        s._id === selectedSession._id ? { ...s, joined: true, bookingId: data.booking?._id } : s
      ));
      setModalOpen(false);
    } catch (err) {
      setError('Failed to join session.');
    }
  };

  return (
    <div className="trainer-details-main-container">
      {loading ? (
        <div style={{ color: '#aaa', fontStyle: 'italic' }}>Loading sessions...</div>
      ) : error ? (
        <div className="form-error">{error}</div>
      ) : (
        <div className="trainer-sessions-section">
          <h3>Active Training Sessions</h3>
          <div className="session-card-list">
            {sessions.length === 0 ? (
              <div style={{ color: '#aaa', fontStyle: 'italic' }}>No active sessions found.</div>
            ) : (
              sessions.map(session => (
                <div key={session._id} className="session-card" style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, marginBottom: 10, background: '#f9f9f9' }}>
                  <h4 style={{ margin: 0 }}>{session.title}</h4>
                  <div style={{ fontSize: 14, color: '#555' }}>{session.date} at {session.time} | {session.location}</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>{session.description}</div>
                  <span style={{ fontSize: 12, color: statusColors[session.status] || '#333', fontWeight: 600 }}>
                    Status: {session.status}
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                    {session.joined ? (
                      <button
                        style={{
                          padding: '8px 22px',
                          background: '#7b8ca7',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                        onClick={() => handleCancelBooking(session.bookingId)}
                      >
                        Cancel Session
                      </button>
                    ) : (
                      <button
                        style={{
                          padding: '8px 22px',
                          background: 'linear-gradient(90deg, #ff5858, #f09819)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                        onClick={() => handleJoinClick(session)}
                      >
                        Join Session
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Modal for joining session */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit} style={{ minWidth: 320, maxWidth: 400 }}>
          <h3 style={{ marginTop: 0 }}>Join Session</h3>
          {selectedSession && (
            <div style={{ marginBottom: 12 }}>
              <strong>Session:</strong> {selectedSession.title}<br />
              <small>{selectedSession.date} at {selectedSession.time} | {selectedSession.location}</small>
            </div>
          )}
          <div className="modal-form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleFormChange} required />
          </div>
          <div className="modal-form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleFormChange} required />
          </div>
          <div className="modal-form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleFormChange} required />
          </div>
          <div className="modal-form-group">
            <label>Emergency Contact Number</label>
            <input type="tel" name="emergencyContact" value={form.emergencyContact} onChange={handleFormChange} />
          </div>
          <div className="modal-form-group">
            <label>Preferred Communication</label>
            <select name="communication" value={form.communication} onChange={handleFormChange}>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="SMS">SMS</option>
            </select>
          </div>
          <div className="modal-form-group">
            <label>Fitness Goals / Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={3} placeholder="Share your goals or any notes..." />
          </div>
          <div className="modal-form-group" style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" name="consent" checked={form.consent} onChange={handleFormChange} required />
            <label style={{ marginLeft: 8 }}>I agree to the session rules and terms</label>
          </div>
          <div className="modal-form-group" style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" name="saveDetails" checked={form.saveDetails} onChange={handleFormChange} />
            <label style={{ marginLeft: 8 }}>Save my details for future sessions</label>
          </div>
          <button type="submit" style={{
            marginTop: 16,
            width: '100%',
            padding: '10px 0',
            background: 'linear-gradient(90deg, #ff5858, #f09819)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer'
          }}>Join Now</button>
        </form>
      </Modal>
    </div>
  );
};

export default TrainerDetails;
