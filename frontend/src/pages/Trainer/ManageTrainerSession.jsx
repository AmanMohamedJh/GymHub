import React, { useState } from "react";
import "./Styles/ManageTrainerSession.css";
import { FaEdit, FaTrash, FaEye, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import { useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const statusColors = {
  "active": "#27ae60",
  "paused": "#f1c40f",
  "cancelled": "#e74c3c"
};

const ManageTrainerSession = () => {
  const { user } = useAuthContext();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // removed removingClientId state

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/trainer/session/my-sessions", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch sessions");
        setSessions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.token) fetchSessions();
  }, [user]);

  const [editModal, setEditModal] = useState({ open: false, session: null, form: {}, submitting: false, error: '' });

  const openEditModal = (session) => {
    setEditModal({
      open: true,
      session,
      form: {
        title: session.title,
        date: session.date,
        time: session.time,
        location: session.location,
        status: session.status
      },
      submitting: false,
      error: ''
    });
  };

  const closeEditModal = () => setEditModal({ open: false, session: null, form: {}, submitting: false, error: '' });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditModal((prev) => ({ ...prev, form: { ...prev.form, [name]: value } }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditModal((prev) => ({ ...prev, submitting: true, error: '' }));
    try {
      const response = await fetch(`/api/trainer/session/${editModal.session._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(editModal.form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update session');
      setSessions(sessions.map(s => s._id === data.session._id ? data.session : s));
      closeEditModal();
    } catch (err) {
      setEditModal((prev) => ({ ...prev, submitting: false, error: err.message }));
    }
  };

  const handleEdit = (sessionId) => {
    const session = sessions.find(s => s._id === sessionId);
    if (session) openEditModal(session);
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      const response = await fetch(`/api/trainer/session/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete session');
      setSessions(sessions.filter(s => s._id !== sessionId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleShowDetails = (session) => {
    setSelectedSession(session);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSession(null);
    // removed setRemovingClientId
  };

  // Removed handleRemoveClient (not needed, no backend support for client removal from session)

  return (
    <div className="manage-trainer-session-container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
        <h2 style={{marginBottom: 0}}>Manage Training Sessions</h2>
        <button
          className="btn-add-session"
          style={{
            padding: '12px 28px',
            fontWeight: 700,
            fontSize: '1.09rem',
            borderRadius: 10,
            background: '#e74c3c',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(231,76,60,0.15)',
            letterSpacing: '0.01em',
            transition: 'background 0.15s, box-shadow 0.15s',
          }}
          onClick={() => window.location.href='/trainer/add-session'}
        >
          + Add Training Session
        </button>
      </div>
      <div className="session-card-list">
        {loading ? (
          <div>Loading sessions...</div>
        ) : error ? (
          <div className="form-error">{error}</div>
        ) : sessions.length === 0 ? (
          <div className="no-sessions">No training sessions found.</div>
        ) : (
          sessions.map(session => (
            <div className="session-card" key={session._id}>
              <div className="session-header">
                <span className="session-status" style={{ background: statusColors[session.status] }}>{session.status}</span>
                <h3>{session.title}</h3>
              </div>
              <div className="session-info">
                <div><FaCalendarAlt className="icon" /> {session.date} at {session.time}</div>
                <div><FaMapMarkerAlt className="icon" /> {session.location}</div>
                <div><b>Type:</b> {session.type}</div>
                <div><b>Status:</b> <span style={{ color: statusColors[session.status] }}>{session.status}</span></div>
              </div>
              <div className="session-actions">
                <button className="btn-details" onClick={() => handleShowDetails(session)}><FaEye /> All Details</button>
                <button className="btn-edit" onClick={() => handleEdit(session._id)}><FaEdit /> Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(session._id)}><FaTrash /> Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for session details */}
      {showModal && selectedSession && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}><FaTimesCircle /></button>
            <h2>{selectedSession.title} <span className="session-status" style={{ background: statusColors[selectedSession.status] }}>{selectedSession.status}</span></h2>
            <div className="session-details-modal">
              <div><span className="session-details-label">Date:</span> <span className="session-details-value">{selectedSession.date}</span></div>
              <div><span className="session-details-label">Time:</span> <span className="session-details-value">{selectedSession.time}</span></div>
              <div><span className="session-details-label">Location:</span> <span className="session-details-value">{selectedSession.location}</span></div>
              <div><span className="session-details-label">Type:</span> <span className="session-details-value">{selectedSession.type}</span></div>
              <div><span className="session-details-label session-details-description-label">Description:</span> <span className="session-details-value">{selectedSession.description}</span></div>
              <div><span className="session-details-label">Status:</span> <span className={`session-details-status${selectedSession.status === 'active' ? ' active' : ''}`}>{selectedSession.status}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing session */}
      {editModal.open && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeEditModal}><FaTimesCircle /></button>
            <h2>Edit Training Session</h2>
            <form onSubmit={handleEditSubmit} className="edit-session-form">
              <label>Session Name</label>
              <input name="title" value={editModal.form.title} onChange={handleEditChange} required />
              <label>Date</label>
              <input name="date" type="date" value={editModal.form.date} onChange={handleEditChange} required />
              <label>Time</label>
              <input name="time" type="time" value={editModal.form.time} onChange={handleEditChange} required />
              <label>Location</label>
              <input name="location" value={editModal.form.location} onChange={handleEditChange} required />
              <label>Status</label>
              <select name="status" value={editModal.form.status} onChange={handleEditChange} required>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {editModal.error && <div className="form-error">{editModal.error}</div>}
              <button type="submit" className="btn-edit" disabled={editModal.submitting} style={{marginTop: 12}}>
                {editModal.submitting ? 'Updating...' : 'Update'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTrainerSession;
