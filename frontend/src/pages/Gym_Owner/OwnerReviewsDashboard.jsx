import React, { useState, useEffect } from "react";
import { FaReply, FaTrash } from "react-icons/fa";
import SearchBar from "../../Components/Search/SearchBar";
import "./Styles/OwnerReviewsDashboard.css";

const OwnerReviewsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch data from your API here
        // const response = await fetch('/api/owner/reviews');
        // const data = await response.json();
        // setReviews(data);

        // For now, use mock data
        const mockReviews = [
          {
            id: 1,
            clientName: "John Doe",
            rating: 4,
            text: "Great facilities and excellent trainers!",
            date: "2025-03-15",
            gymName: "FitZone",
            gymLocation: "New York",
            reply: "",
          },
          {
            id: 2,
            clientName: "Jane Smith",
            rating: 5,
            text: "Best gym experience ever. Very clean and well-maintained.",
            date: "2025-03-16",
            gymName: "PowerHouse",
            gymLocation: "Los Angeles",
            reply: "",
          },
        ];

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setReviews(mockReviews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const calculateStats = () => {
    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews ||
      0;
    const recentReviews = reviews.filter((review) => {
      const reviewDate = new Date(review.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return reviewDate >= weekAgo;
    }).length;

    return { totalReviews, averageRating, recentReviews };
  };

  const handleReply = (review) => {
    setSelectedReview(review);
    setShowReplyModal(true);
  };

  const handleDelete = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const submitReply = () => {
    const updatedReviews = reviews.map((review) =>
      review.id === selectedReview.id ? { ...review, reply: replyText } : review
    );
    setReviews(updatedReviews);
    setShowReplyModal(false);
    setReplyText("");
  };

  const confirmDelete = () => {
    const updatedReviews = reviews.filter(
      (review) => review.id !== selectedReview.id
    );
    setReviews(updatedReviews);
    setShowDeleteModal(false);
  };

  const stats = calculateStats();

  const filteredReviews = reviews.filter(
    (review) =>
      review.gymName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!dateFilter || review.date === dateFilter)
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="owner-reviews-main">
      <div className="owner-reviews-content">
        {/* Stats Cards */}
        <div className="owner-reviews-stats">
          <div className="owner-reviews-stat-card">
            <div className="owner-reviews-stat-title">Total Reviews</div>
            <div className="owner-reviews-stat-value">{stats.totalReviews}</div>
          </div>
          <div className="owner-reviews-stat-card">
            <div className="owner-reviews-stat-title">Average Rating</div>
            <div className="owner-reviews-stat-value">
              {stats.averageRating.toFixed(1)}★
            </div>
          </div>
          <div className="owner-reviews-stat-card">
            <div className="owner-reviews-stat-title">
              Recent Reviews (7 days)
            </div>
            <div className="owner-reviews-stat-value">
              {stats.recentReviews}
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="owner-reviews-search">
          <SearchBar
            searchTerm={searchTerm}
            dateFilter={dateFilter}
            onSearchChange={setSearchTerm}
            onDateChange={setDateFilter}
          />
        </div>

        {/* Table Section */}
        <div className="owner-reviews-table-container">
          <table className="owner-reviews-table">
            <thead>
              <tr>
                <th>CLIENT NAME</th>
                <th>GYM NAME</th>
                <th>LOCATION</th>
                <th>RATING</th>
                <th>REVIEW</th>
                <th>DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.clientName}</td>
                  <td>{review.gymName}</td>
                  <td>{review.gymLocation}</td>
                  <td>{review.rating}★</td>
                  <td>{review.text}</td>
                  <td>{review.date}</td>
                  <td>
                    <div className="owner-reviews-actions">
                      <button
                        className="owner-reviews-action-btn owner-reviews-edit"
                        onClick={() => handleReply(review)}
                      >
                        <FaReply />
                      </button>
                      <button
                        className="owner-reviews-action-btn owner-reviews-delete"
                        onClick={() => handleDelete(review)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showReplyModal && (
        <div className="owner-reviews-modal">
          <div className="owner-reviews-modal-content">
            <div className="owner-reviews-modal-header">
              <h2>Reply to Review</h2>
              <button
                className="owner-reviews-modal-close"
                onClick={() => setShowReplyModal(false)}
              >
                ×
              </button>
            </div>
            <div className="owner-reviews-modal-body">
              <p>
                <strong>Client:</strong> {selectedReview.clientName}
              </p>
              <p>
                <strong>Gym:</strong> {selectedReview.gymName}
              </p>
              <p>
                <strong>Rating:</strong> {selectedReview.rating}★
              </p>
              <p>
                <strong>Review:</strong> {selectedReview.text}
              </p>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
              />
            </div>
            <div className="owner-reviews-modal-footer">
              <button
                className="owner-reviews-modal-btn owner-reviews-modal-cancel"
                onClick={() => setShowReplyModal(false)}
              >
                Cancel
              </button>
              <button
                className="owner-reviews-modal-btn owner-reviews-modal-confirm"
                onClick={submitReply}
              >
                Submit Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="owner-reviews-modal">
          <div className="owner-reviews-modal-content">
            <div className="owner-reviews-modal-header">
              <h2>Delete Review</h2>
              <button
                className="owner-reviews-modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="owner-reviews-modal-body">
              <p>Are you sure you want to delete this review?</p>
              <p>
                <strong>Gym:</strong> {selectedReview.gymName}
              </p>
              <p>
                <strong>Client:</strong> {selectedReview.clientName}
              </p>
            </div>
            <div className="owner-reviews-modal-footer">
              <button
                className="owner-reviews-modal-btn owner-reviews-modal-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="owner-reviews-modal-btn owner-reviews-modal-delete"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerReviewsDashboard;
