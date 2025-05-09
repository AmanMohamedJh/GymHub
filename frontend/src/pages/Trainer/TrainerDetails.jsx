import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Styles/TrainerDetails.css";

const statusColors = {
  "active": "#27ae60",
  "paused": "#f1c40f",
  "cancelled": "#e74c3c"
};

const TrainerDetails = () => {
  const { trainerId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Use only public endpoints: treat trainerId as userId
useEffect(() => {
  setLoading(true);
  setError("");
  setSessions([]);

  if (!trainerId || typeof trainerId !== "string" || trainerId.length < 10) {
    setError("Invalid or missing trainerId in URL.");
    setLoading(false);
    return;
  }

  const url = `/api/trainer/session/active/${trainerId}`;
  console.log('[TrainerDetails] Fetching active sessions from:', url);
  fetch(url)
    .then(async res => {
      console.log('[TrainerDetails] Response status:', res.status);
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('[TrainerDetails] Failed to parse JSON:', text);
        throw new Error('Invalid server response (not JSON).');
      }
      if (!res.ok) {
        console.error('[TrainerDetails] API error:', data.error || text);
        throw new Error(data.error || `API error: ${res.status}`);
      }
      if (!Array.isArray(data)) throw new Error("Sessions not found or invalid response.");
      console.log('[TrainerDetails] Sessions received:', data);
      setSessions(data);
      setError("");
    })
    .catch(err => {
      console.error('[TrainerDetails] Fetch error:', err);
      setError(err.message);
      setSessions([]);
    })
    .finally(() => setLoading(false));
}, [trainerId]);


  console.log("[TrainerDetails] Render: loading=", loading, "error=", error, "sessions=", sessions);
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
                    <button style={{
                      padding: '8px 22px',
                      background: 'linear-gradient(90deg, #ff5858, #f09819)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                      Join Session
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerDetails;
