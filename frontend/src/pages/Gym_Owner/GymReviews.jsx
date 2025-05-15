import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Styles/GymReviews.css";

const GymReviews = () => {
  const { gymId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showNotAllowedModal, setShowNotAllowedModal] = useState(false);
  const [modalError, setModalError] = useState("");
  const [reviewForm, setReviewForm] = useState({
    heading: "",
    content: "",
    rating: 5,
    emoji: "🙂",
    categoryRatings: {
      staff: 0,
      facilities: 0,
      cleanliness: 0,
      comfort: 0,
      freeWifi: 0,
      valueForMoney: 0,
      location: 0,
    },
  });
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    joined: "",
  });
  const { user } = useContext(AuthContext);
  const [reviewerFilter, setReviewerFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetch(`/api/gym-reviews/${gymId}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch(() => {
        setReviews([]);
        setLoading(false);
      });
  }, [gymId]);

  // Calculate stats (set to 0 if reviews.length === 0)
  const totalReviews = reviews.length;
  const avgRating = totalReviews
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

  // Category stats
  const categoryFields = [
    { key: "facilities", label: "Facilities" },
    { key: "cleanliness", label: "Cleanliness" },
    { key: "comfort", label: "Comfort" },
    { key: "freeWifi", label: "Free Wifi" },
    { key: "valueForMoney", label: "Value for money" },
    { key: "location", label: "Location" },
    { key: "staff", label: "Staff" },
  ];

  // Calculate category averages
  const categoryAverages = {};
  categoryFields.forEach(({ key }) => {
    categoryAverages[key] = totalReviews
      ? (
          reviews.reduce((sum, r) => sum + (r.categoryRatings?.[key] || 0), 0) /
          totalReviews
        ).toFixed(1)
      : 0;
  });

  // Create unique list of review dates (date of review written)
  const reviewDates = Array.from(
    new Set(
      reviews.map((r) =>
        r.date ? new Date(r.date).toLocaleDateString() : null
      )
    )
  ).filter(Boolean);

  // Filtering logic
  const filteredReviews = reviews.filter((r) => {
    let pass = true;
    if (reviewerFilter && reviewerFilter !== "all") {
      pass = pass && r.clientName === reviewerFilter;
    }
    if (scoreFilter === "0") {
      pass = pass && r.rating === 0;
    } else if (scoreFilter === "5+") {
      pass = pass && r.rating >= 5 && r.rating < 8;
    } else if (scoreFilter === "8+") {
      pass = pass && r.rating >= 8;
    }
    if (dateFilter && dateFilter !== "all") {
      pass = pass && new Date(r.date).toLocaleDateString() === dateFilter;
    }
    return pass;
  });

  const handleWriteReview = async () => {
    setModalError("");
    // Check if user is client of this gym
    try {
      const res = await fetch(`/api/gyms/${gymId}/has-joined/${user?._id}`);
      const data = await res.json();
      if (data.joined) {
        setUserDetails({
          name: data.user?.name || "",
          email: data.user?.email || "",
          joined: data.user?.joined || "",
        });
        setShowReviewModal(true);
      } else {
        setShowNotAllowedModal(true);
      }
    } catch (err) {
      setModalError("Could not verify gym membership.");
      setShowNotAllowedModal(true);
    }
  };

  const handleReviewInput = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleCategoryRating = (cat, value) => {
    setReviewForm((prev) => ({
      ...prev,
      categoryRatings: { ...prev.categoryRatings, [cat]: value },
    }));
  };
  const handleRating = (value) => {
    setReviewForm((prev) => ({
      ...prev,
      rating: value,
      emoji: getEmoji(value),
    }));
  };
  const getEmoji = (val) => {
    if (val >= 9) return "😊";
    if (val >= 7) return "🙂";
    if (val >= 5) return "😐";
    if (val >= 3) return "😕";
    return "😠";
  };
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    // Compose review object
    const review = {
      ...reviewForm,
      gymId,
      clientId: user?._id,
      date: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/gym-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      if (res.ok) {
        setShowReviewModal(false);
        setReviewForm({
          heading: "",
          content: "",
          rating: 5,
          emoji: "🙂",
          categoryRatings: {
            staff: 0,
            facilities: 0,
            cleanliness: 0,
            comfort: 0,
            freeWifi: 0,
            valueForMoney: 0,
            location: 0,
          },
        });
        fetch(`/api/gym-reviews/${gymId}`)
          .then((res) => res.json())
          .then((data) => {
            setReviews(data);
            setLoading(false);
          })
          .catch(() => {
            setReviews([]);
            setLoading(false);
          });
      } else {
        setModalError("Could not submit review.");
      }
    } catch (err) {
      setModalError("Could not submit review.");
    }
  };

  return (
    <div className="gymreviews-container">
      <div className="gymreviews-topbar">
        <h1 className="gymreviews-page-title">
          Reviews of this gym's clients.
        </h1>
        <button className="gymreviews-write-btn" onClick={handleWriteReview}>
          Write a Review
        </button>
      </div>
      <div className="gymreviews-header">
        <div className="gymreviews-score-box">
          <span className="gymreviews-score">{avgRating}</span>
          <span className="gymreviews-status">
            {avgRating >= 7 ? "Good" : avgRating > 0 ? "Average" : "-"}
          </span>
          <span className="gymreviews-count">{totalReviews} reviews</span>
        </div>
        <div className="gymreviews-categories">
          {categoryFields.map(({ key, label }) => (
            <div className="gymreviews-category" key={key}>
              <span>{label}</span>
              <div className="gymreviews-bar-wrap">
                <div
                  className="gymreviews-bar"
                  style={{
                    width: `${categoryAverages[key] * 10}%`,
                    background:
                      categoryAverages[key] >= 7 ? "#e53935" : "#b71c1c",
                  }}
                ></div>
              </div>
              <span className="gymreviews-cat-score">
                {categoryAverages[key]}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="gymreviews-filters">
        <div className="gymreviews-filter-group">
          <label>Reviewers</label>
          <select
            value={reviewerFilter}
            onChange={(e) => setReviewerFilter(e.target.value)}
          >
            <option value="all">All ({totalReviews})</option>
            {Array.from(
              new Set(reviews.map((r) => r.clientName || "Client"))
            ).map((name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="gymreviews-filter-group">
          <label>Review scores</label>
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
          >
            <option value="all">All ({totalReviews})</option>
            <option value="0">0</option>
            <option value="5+">5+</option>
            <option value="8+">8+</option>
          </select>
        </div>
        <div className="gymreviews-filter-group">
          <label>Date Reviewed</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All</option>
            {reviewDates.map((date, i) => (
              <option key={i} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="gymreviews-list-section">
        <h2 className="gymreviews-list-title">Guest reviews</h2>
        {loading && <div>Loading...</div>}
        {!loading && filteredReviews.length === 0 && (
          <div className="gymreviews-no-data">
            No reviews found for the selected filters
          </div>
        )}
        {!loading &&
          filteredReviews.length > 0 &&
          filteredReviews.map((r) => (
            <div key={r._id} className="gymreviews-review-row">
              <div className="gymreviews-user-col">
                <div className="gymreviews-user-name">
                  {r.clientName || "Client"}
                </div>
                <div className="gymreviews-user-joined">
                  Joined: {r.clientJoined || "-"}
                </div>
              </div>
              <div className="gymreviews-review-col">
                <div className="gymreviews-review-header">
                  <span className="gymreviews-review-heading">{r.heading}</span>
                  <span className="gymreviews-review-rating">
                    <span className="gymreviews-review-emoji">{r.emoji}</span>
                    <span className="gymreviews-review-score">{r.rating}</span>
                  </span>
                  <span className="gymreviews-review-date">
                    {new Date(r.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="gymreviews-review-content">{r.content}</div>
                {(r.response || r.ownerResponse) && (
                  <div className="gymreviews-owner-response">
                    <span className="gymreviews-owner-label">
                      Gym Owner Response:
                    </span>
                    <span className="gymreviews-owner-text">
                      {r.response || r.ownerResponse}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      {/* --- Write Review Modal --- */}
      {showReviewModal && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <h2>Write a Review</h2>
            {/* Show user details */}
            <div className="review-modal-user-details">
              <div>
                <b>Name:</b> {userDetails.name}
              </div>
              <div>
                <b>Email:</b> {userDetails.email}
              </div>
              <div>
                <b>Joined:</b> {userDetails.joined}
              </div>
            </div>
            <form onSubmit={handleSubmitReview}>
              <div className="review-modal-label-row">
                <label>Title</label>
                <input
                  name="heading"
                  value={reviewForm.heading}
                  onChange={handleReviewInput}
                  required
                />
              </div>
              <div className="review-modal-label-row">
                <label>Description</label>
                <textarea
                  name="content"
                  value={reviewForm.content}
                  onChange={handleReviewInput}
                  required
                  rows={3}
                />
              </div>
              <label>
                Rating: {reviewForm.rating} {reviewForm.emoji}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={reviewForm.rating}
                onChange={(e) => handleRating(Number(e.target.value))}
              />
              <div className="review-modal-categories">
                <span>Category Ratings (optional):</span>
                {Object.keys(reviewForm.categoryRatings).map((cat) => (
                  <div key={cat} className="review-modal-cat-row">
                    <label>{cat.charAt(0).toUpperCase() + cat.slice(1)}</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={reviewForm.categoryRatings[cat]}
                      onChange={(e) =>
                        handleCategoryRating(cat, Number(e.target.value))
                      }
                    />
                    <span>{reviewForm.categoryRatings[cat]}</span>
                  </div>
                ))}
              </div>
              <div className="review-modal-actions">
                <button type="submit" className="review-modal-submit">
                  Submit
                </button>
                <button type="button" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </button>
              </div>
              {modalError && (
                <div className="review-modal-error">{modalError}</div>
              )}
            </form>
          </div>
        </div>
      )}
      {/* --- Not Allowed Modal --- */}
      {showNotAllowedModal && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <h3>
              Only registered gym-goers can leave a review for this gym.
              <br />
              Please register or log in as a client to share your experience.
            </h3>
            <div className="review-modal-actions single-action">
              <button onClick={() => setShowNotAllowedModal(false)}>
                Go Back
              </button>
            </div>
            {modalError && (
              <div className="review-modal-error">{modalError}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GymReviews;
