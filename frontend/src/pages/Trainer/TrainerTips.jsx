import React, { useEffect, useState } from "react";
import "./Styles/TrainerTips.css";
import { useAuthContext } from "../../hooks/useAuthContext";

function formatDate(date) {
  return new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const TrainerTips = () => {
  const { user } = useAuthContext();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [replySubmitting, setReplySubmitting] = useState({});

  // Fetch all tips on mount
  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/trainer/tips/all", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch trainer tips");
        const data = await res.json();
        setTips(data);
      } catch (err) {
        setError(err.message || "Error loading tips");
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [user]);

  const handleReplyChange = (tipId, value) => {
    setReplyInputs((prev) => ({ ...prev, [tipId]: value }));
  };

  const handleReplySubmit = async (tipId) => {
    if (!replyInputs[tipId] || replyInputs[tipId].trim() === "") return;
    setReplySubmitting((prev) => ({ ...prev, [tipId]: true }));
    setError("");
    try {
      const res = await fetch(`/api/trainer/tips/${tipId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ comment: replyInputs[tipId] }),
      });
      if (!res.ok) throw new Error("Failed to submit reply");
      // The API returns the updated tip
      const updatedTip = await res.json();
      setTips((prev) =>
        prev.map((tip) => (tip._id === tipId ? updatedTip : tip))
      );
      setReplyInputs((prev) => ({ ...prev, [tipId]: "" }));
    } catch (err) {
      setError(err.message || "Error submitting reply");
    } finally {
      setReplySubmitting((prev) => ({ ...prev, [tipId]: false }));
    }
  };

  return (
    <div className="trainer-tips-container">
      <h1 className="trainer-tips-title">Trainer Tips</h1>
      {loading && <div style={{ textAlign: "center", color: "#888" }}>Loading...</div>}
      {error && <div style={{ textAlign: "center", color: "#e53935", marginBottom: 12 }}>{error}</div>}
      <div className="trainer-tips-list">
        {tips.map((tip) => (
          <div key={tip._id} className="trainer-tip-card">
            <div className="trainer-tip-header">
              <span className="trainer-tip-author">{tip.userName}</span>
              <span className="trainer-tip-date">{formatDate(tip.createdAt)}</span>
            </div>
            <div className="trainer-tip-title">{tip.title}</div>
            <div className="trainer-tip-desc">{tip.description}</div>
            <div className="trainer-tip-replies">
              <div className="trainer-tip-replies-title">Replies:</div>
              {(!tip.replies || tip.replies.length === 0) && (
                <div className="trainer-tip-no-replies">No replies yet.</div>
              )}
              {tip.replies && tip.replies.map((reply, idx) => (
                <div key={reply._id || idx} className="trainer-tip-reply">
                  <span className="reply-author">{reply.userName}</span>
                  <span className="reply-date">{formatDate(reply.createdAt)}</span>
                  <div className="reply-comment">{reply.comment}</div>
                </div>
              ))}
              <div className="trainer-tip-reply-form">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyInputs[tip._id] || ""}
                  onChange={(e) => handleReplyChange(tip._id, e.target.value)}
                  className="reply-input"
                  disabled={replySubmitting[tip._id]}
                />
                <button
                  className="reply-submit-btn"
                  onClick={() => handleReplySubmit(tip._id)}
                  disabled={replySubmitting[tip._id]}
                >
                  {replySubmitting[tip._id] ? "Replying..." : "Reply"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerTips;
