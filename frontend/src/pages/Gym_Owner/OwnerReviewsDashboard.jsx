import React, { useState, useEffect } from "react";
import { FaReply, FaTrash } from "react-icons/fa";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Styles/OwnerReviewsDashboard.css";

const categoryFields = [
  { key: "staff", label: "Staff" },
  { key: "facilities", label: "Facilities" },
  { key: "cleanliness", label: "Cleanliness" },
  { key: "comfort", label: "Comfort" },
  { key: "freeWifi", label: "Free Wifi" },
  { key: "valueForMoney", label: "Value for money" },
  { key: "location", label: "Location" },
];

// --- Modal Components ---
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="owner-modal-overlay" onClick={onClose}>
      <div className="owner-modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const ReplyModal = ({ isOpen, onClose, onReply, value, setValue, review }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="owner-modal-title">Reply to Review</div>
    {review && (
      <div className="owner-modal-subtitle">
        You are replying to{" "}
        <span className="owner-modal-user">
          {typeof review.clientName === "string" && review.clientName.trim()
            ? review.clientName
            : "Unknown"}
        </span>
        's review
      </div>
    )}
    <textarea
      className="owner-modal-textarea owner-modal-textarea-upgraded"
      placeholder={`Write your reply to ${
        review
          ? typeof review.clientName === "string" && review.clientName.trim()
            ? review.clientName
            : "Unknown"
          : "this user"
      }...`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      rows={5}
      autoFocus
    />
    <div className="owner-modal-actions">
      <button
        className="owner-modal-btn owner-modal-btn-primary"
        onClick={onReply}
      >
        Reply
      </button>
      <button className="owner-modal-btn" onClick={onClose}>
        Cancel
      </button>
    </div>
  </Modal>
);

const DeleteModal = ({ isOpen, onClose, onDelete }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="owner-modal-title owner-modal-title-delete">
      Delete Review?
    </div>
    <div className="owner-modal-desc">
      Are you sure you want to delete this review? This action cannot be undone.
    </div>
    <div className="owner-modal-actions">
      <button
        className="owner-modal-btn owner-modal-btn-danger"
        onClick={onDelete}
      >
        Delete
      </button>
      <button className="owner-modal-btn" onClick={onClose}>
        Cancel
      </button>
    </div>
  </Modal>
);

const OwnerReviewsDashboard = () => {
  const { user } = useAuthContext();
  const [gyms, setGyms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [replyValue, setReplyValue] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);

  const [selectedGym, setSelectedGym] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  // --- Filtering logic ---
  const filteredReviews = reviews.filter((r) => {
    let pass = true;
    if (selectedGym !== "all") {
      pass = pass && r.gymId === selectedGym;
    }
    if (ratingFilter === "0") {
      pass = pass && r.rating === 0;
    } else if (ratingFilter === "2+") {
      pass = pass && r.rating >= 2 && r.rating < 5;
    } else if (ratingFilter === "5+") {
      pass = pass && r.rating >= 5 && r.rating < 8;
    } else if (ratingFilter === "8+") {
      pass = pass && r.rating >= 8;
    }
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      pass =
        pass &&
        ((r.clientName && r.clientName.toLowerCase().includes(searchLower)) ||
          (r.heading && r.heading.toLowerCase().includes(searchLower)) ||
          (r.content && r.content.toLowerCase().includes(searchLower)));
    }
    return pass;
  });

  const handleReply = (review) => {
    setSelectedReview(review);
    setReplyModalOpen(true);
  };

  const handleDelete = (review) => {
    setSelectedReview(review);
    setDeleteModalOpen(true);
  };

  const handleReplySubmit = async () => {
    if (!selectedReview || !replyValue.trim()) return;
    try {
      const res = await fetch(
        `/api/gym-reviews/${selectedReview._id}/response`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
          body: JSON.stringify({ response: replyValue.trim() }),
        }
      );
      if (!res.ok) throw new Error("Failed to submit reply");
      const data = await res.json();
      // Update review in local state
      setReviews((prev) =>
        prev.map((r) =>
          r._id === selectedReview._id
            ? { ...r, response: replyValue.trim() }
            : r
        )
      );
      setReplyModalOpen(false);
      setReplyValue("");
    } catch (err) {
      alert(err.message || "Could not submit reply.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;
    try {
      const res = await fetch(`/api/gym-reviews/${selectedReview._id}`, {
        method: "DELETE",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
      });
      if (!res.ok) throw new Error("Failed to delete review");
      // Remove from local state
      setReviews((prev) => prev.filter((r) => r._id !== selectedReview._id));
      setDeleteModalOpen(false);
      setSelectedReview(null);
    } catch (err) {
      alert(err.message || "Could not delete review.");
    }
  };

  const handleOpenReplyModal = (review) => {
    handleReply(review);
  };

  const handleCloseReplyModal = () => {
    setReplyModalOpen(false);
  };

  const handleOpenDeleteModal = (review) => {
    handleDelete(review);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  // Fetch gyms with reviews for this owner (single API call)
  useEffect(() => {
    const fetchGymsWithReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = user?.token;
        console.log("[OwnerReviewsDashboard] Using token:", token);
        const res = await fetch(
          "http://localhost:4000/api/gym-owner/gym-reviews/gyms-with-reviews",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        console.log("[OwnerReviewsDashboard] Response status:", res.status);
        if (!res.ok) {
          const errorText = await res.text();
          console.error("[OwnerReviewsDashboard] Error response:", errorText);
          throw new Error("Failed to fetch gyms with reviews: " + errorText);
        }
        const gymsWithReviews = await res.json();
        console.log(
          "[OwnerReviewsDashboard] Fetched gymsWithReviews:",
          gymsWithReviews
        );
        setGyms(gymsWithReviews);
        //  reviews and attach gym info for display
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
        setError("Failed to fetch gyms with reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchGymsWithReviews();
  }, []);

  return (
    <div className="owner-reviews-main">
      {/* --- Page Title --- */}
      <div className="owner-reviews-page-title-wrapper">
        <h1 className="owner-reviews-page-title">Reviews Dashboard</h1>
      </div>

      {/* --- Loading and Error States --- */}
      {loading && <div className="owner-reviews-loading">Loading...</div>}
      {error && <div className="owner-reviews-error">{error}</div>}

      {/* --- Overall Review Statistics Section --- */}
      <div className="owner-reviews-stats-bar">
        <div className="owner-reviews-stats-summary">
          <span className="owner-reviews-stats-score">
            {filteredReviews.length > 0
              ? (
                  filteredReviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
                  filteredReviews.length
                ).toFixed(1)
              : "-"}
          </span>
          <span className="owner-reviews-stats-status">
            {filteredReviews.length > 0 ? "Good" : "-"}
          </span>
          <span className="owner-reviews-stats-count">
            · {filteredReviews.length} reviews
          </span>
        </div>
        <div className="owner-reviews-stats-categories">
          {categoryFields.map(({ key, label }) => {
            const avg =
              filteredReviews.length > 0
                ? (
                    filteredReviews.reduce(
                      (acc, r) => acc + (r.categoryRatings?.[key] || 0),
                      0
                    ) / filteredReviews.length
                  ).toFixed(1)
                : "-";
            return (
              <div className="cat-bar" key={key}>
                <span className="cat-label">{label}</span>
                <div className="cat-bar-bg">
                  <div
                    className="cat-bar-fill"
                    style={{
                      width: avg !== "-" ? `${(avg / 10) * 100}%` : "0%",
                    }}
                  ></div>
                </div>
                <span className="cat-score">{avg}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Gym Filter Dropdown --- */}
      <div className="owner-reviews-search-bar">
        <select
          className="owner-reviews-search-select"
          value={selectedGym}
          onChange={(e) => setSelectedGym(e.target.value)}
        >
          <option value="all">All Gyms</option>
          {gyms.map((gym) => (
            <option value={gym._id} key={gym._id}>
              {gym.name}
            </option>
          ))}
        </select>
        <select
          className="owner-reviews-search-select"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="all">All ratings</option>
          <option value="0">0</option>
          <option value="2+">2+</option>
          <option value="5+">5+</option>
          <option value="8+">8+</option>
        </select>
        <input
          className="owner-reviews-search-input"
          placeholder="Search by reviewer or title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* --- Reviews List --- */}
      <div className="owner-reviews-list-section">
        {!loading && !error && filteredReviews.length === 0 && (
          <div className="owner-reviews-empty">No reviews found.</div>
        )}
        {filteredReviews.map((review, idx) => (
          <div className="owner-review-card" key={review._id || idx}>
            <div className="owner-review-card-header">
              <span className="owner-review-gym-name">{review.gymName}</span>
              <span className="owner-review-gym-location">
                {review.gymLocation}
              </span>
            </div>
            <div className="owner-review-user-details">
              <span className="owner-review-user-name">
                {typeof review.clientName === "string" &&
                review.clientName.trim()
                  ? review.clientName
                  : "Unknown"}
              </span>
              {review.clientJoined ? (
                <span className="owner-review-user-joined">
                  Joined: {review.clientJoined}
                </span>
              ) : null}
            </div>
            <div className="owner-review-title-row">
              <span className="owner-review-title">{review.heading}</span>
              <span className="owner-review-rating">
                {review.rating}
                <span className="owner-review-star">★</span>
              </span>
            </div>
            <div className="owner-review-desc">{review.content}</div>
            {/* Category-wise scores for this review */}
            {review.categoryRatings && (
              <div className="owner-review-categories">
                {categoryFields.map(({ key, label }) => {
                  const val = review.categoryRatings[key] || 0;
                  return (
                    <div className="cat-bar" key={key}>
                      <span className="cat-label">{label}</span>
                      <div className="cat-bar-bg">
                        <div
                          className="cat-bar-fill"
                          style={{ width: `${(val / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="cat-score">{val !== 0 ? val : "-"}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {review.reply && (
              <div className="owner-review-reply">
                <span className="owner-review-reply-label">Owner Reply:</span>{" "}
                {review.reply}
              </div>
            )}
            {review.response && (
              <div className="owner-review-reply">
                <span className="owner-review-reply-label">Your Reply:</span>
                <span className="owner-review-reply-content">
                  {review.response}
                </span>
              </div>
            )}
            <div className="owner-review-date-row">
              <span className="owner-review-date-label">Reviewed:</span>
              <span className="owner-review-date-value">
                {review.date ? new Date(review.date).toLocaleDateString() : "-"}
              </span>
            </div>
            <div className="owner-review-actions-row">
              <button
                className="owner-review-action-btn reply"
                onClick={() => handleOpenReplyModal(review)}
              >
                <FaReply /> Reply
              </button>
              <button
                className="owner-review-action-btn delete"
                onClick={() => handleOpenDeleteModal(review)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Modals --- */}
      <ReplyModal
        isOpen={replyModalOpen}
        onClose={handleCloseReplyModal}
        review={selectedReview}
        onReply={handleReplySubmit}
        value={replyValue}
        setValue={setReplyValue}
      />
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteConfirm}
        review={selectedReview}
      />
    </div>
  );
};

export default OwnerReviewsDashboard;
