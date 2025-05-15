import React, { useState, useEffect } from "react";
import "./Styles/ManageTrainerTips.css";
import { useAuthContext } from "../../hooks/useAuthContext";


export default function ManageTrainerTips() {
  const { user } = useAuthContext();
  const [tips, setTips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTip, setNewTip] = useState({ title: "", description: "" });
  const [editTipId, setEditTipId] = useState(null);
  const [editTip, setEditTip] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch tips from backend
  useEffect(() => {
    // Fetch tips for the logged-in user
    const fetchTips = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/trainer/tips/my", {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : ""
          }
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch tips");
        }
        const tipsData = await res.json();
        setTips(Array.isArray(tipsData) ? tipsData : []);
      } catch (err) {
        // Optionally display error to user in UI if you want
        console.error("Error fetching tips:", err.message);
        setTips([]);
      }
    };
    if (user?.token) fetchTips();
  }, [user]);

  // Open Add modal
  const handleOpenModal = () => {
    setShowModal(true);
    setNewTip({ title: "", description: "" });
  };

  // Open Edit modal
  const handleOpenEditModal = (tip) => {
    setEditTipId(tip._id);
    setEditTip({ title: tip.title, description: tip.description });
    setShowEditModal(true);
  };


  const handleCloseModal = () => {
    setShowModal(false);
    setNewTip({ title: "", description: "" });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditTipId(null);
    setEditTip({ title: "", description: "" });
  };


  const handleChange = (e) => {
    setNewTip({ ...newTip, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditTip({ ...editTip, [e.target.name]: e.target.value });
  };


  // Add or edit tip in backend
  // Add new tip to backend
  const handleSaveTip = async () => {
    if (!user?.token) return;
    if (!(newTip.title || "").trim() || !(newTip.description || "").trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/trainer/tips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ title: newTip.title, description: newTip.description })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add tip");
      setTips([data, ...tips]);
      handleCloseModal();
    } catch (err) {
      setError(err.message || "Failed to add tip");
    } finally {
      setLoading(false);
    }
  };

  // Edit tip in backend
  const handleEditTip = async () => {
    if (!user?.token) return;
    if (!(editTip.title || "").trim() || !(editTip.description || "").trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:4000/api/trainer/tips/${editTipId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ title: editTip.title, description: editTip.description })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to edit tip");
      setTips(tips => tips.map(tip => (tip._id === editTipId ? data : tip)));
      handleCloseEditModal();
    } catch (err) {
      setError(err.message || "Failed to edit tip");
    } finally {
      setLoading(false);
    }
  };



  const handleDeleteTip = async (id) => {
    if (!user?.token) return;
    try {
      const res = await fetch(`http://localhost:4000/api/trainer/tips/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete tip");
      }
      setTips(tips => tips.filter(tip => tip._id !== id));
    } catch (err) {
      console.error("Delete tip error:", err.message);
      // Optionally set error state here
    }
  };


  return (
    <div className="manage-trainer-tips-page">
      <div className="tips-header">
        <h1>Manage Workout Tips</h1>
        <button className="add-tip-btn" onClick={() => handleOpenModal()}>+ Add New Tip</button>
      </div>
      <div className="tips-list">
        {tips.length === 0 ? (
          <div className="empty-tips">No tips added yet.</div>
        ) : (
          tips.map(tip => (
            <div className="tip-card" key={tip._id}>
              <div className="tip-header">
                <div>
                  <h2>{tip.title}</h2>
                  <p className="tip-content">{tip.description}</p>
                </div>
                <div className="tip-actions">
                  <button className="edit-btn" onClick={() => handleOpenEditModal(tip)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteTip(tip._id)}>Delete</button>
                </div>
              </div>
              <div className="tip-replies">
                <h4>User Replies</h4>
                {tip.replies.length === 0 ? (
                  <div className="no-replies">No replies yet.</div>
                ) : (
                  tip.replies.map((reply, idx) => (
                    <div className="reply" key={reply._id || idx}>
                      <span className="reply-user">{reply.user}:</span> {reply.comment}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add New Tip</h2>
            <input
              type="text"
              name="title"
              value={newTip.title}
              onChange={handleChange}
              placeholder="Tip Title"
              className="modal-input"
              maxLength={60}
              autoFocus
            />
            <textarea
              name="description"
              value={newTip.description}
              onChange={handleChange}
              placeholder="Write your tip here..."
              className="modal-textarea"
              rows={4}
              maxLength={350}
            />
            <div className="modal-actions">
              <button className="save-btn" onClick={handleSaveTip}>Add Tip</button>
              <button className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={handleCloseEditModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Edit Tip</h2>
            <input
              type="text"
              name="title"
              value={editTip.title}
              onChange={handleEditChange}
              placeholder="Tip Title"
              className="modal-input"
              maxLength={60}
              autoFocus
            />
            <textarea
              name="description"
              value={editTip.description}
              onChange={handleEditChange}
              placeholder="Write your tip here..."
              className="modal-textarea"
              rows={4}
              maxLength={350}
            />
            <div className="modal-actions">
              <button className="save-btn" onClick={handleEditTip}>Save Changes</button>
              <button className="cancel-btn" onClick={handleCloseEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
