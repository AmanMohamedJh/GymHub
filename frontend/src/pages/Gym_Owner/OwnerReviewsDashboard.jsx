import React, { useState, useEffect } from 'react';
import { FaReply, FaTrash } from 'react-icons/fa';
import SearchBar from '../../Components/Search/SearchBar';
import './Styles/OwnerReviewsDashboard.css';
import gymImage from './Styles/images/gym-background2.jpg.jpg';

const OwnerReviewsDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockReviews = [
      {
        id: 1,
        clientName: 'John Doe',
        rating: 4,
        text: 'Great facilities and excellent trainers!',
        date: '2025-03-15',
        gymName: 'FitZone',
        gymLocation: 'New York',
        reply: ''
      },
      {
        id: 2,
        clientName: 'Jane Smith',
        rating: 5,
        text: 'Best gym experience ever. Very clean and well-maintained.',
        date: '2025-03-16',
        gymName: 'PowerHouse',
        gymLocation: 'Los Angeles',
        reply: ''
      }
    ];
    setReviews(mockReviews);
  }, []);

  const calculateStats = () => {
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews || 0;
    const recentReviews = reviews.filter(review => {
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
    const updatedReviews = reviews.map(review =>
      review.id === selectedReview.id ? { ...review, reply: replyText } : review
    );
    setReviews(updatedReviews);
    setShowReplyModal(false);
    setReplyText('');
  };

  const confirmDelete = () => {
    const updatedReviews = reviews.filter(review => review.id !== selectedReview.id);
    setReviews(updatedReviews);
    setShowDeleteModal(false);
  };

  const stats = calculateStats();

  const filteredReviews = reviews.filter(review =>
    review.gymName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!dateFilter || review.date === dateFilter)
  );

  return (
    <div className="reviews-dashboard">
      <div className="reviews-header">
        <h1>Manage Feedback & Reviews</h1>
        <div className="breadcrumb">
          Dashboard <span>{'>'}</span> Reviews
        </div>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        dateFilter={dateFilter}
        onSearchChange={setSearchTerm}
        onDateChange={setDateFilter}
      />

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Reviews</h3>
          <div className="value">{stats.totalReviews}</div>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <div className="value">{stats.averageRating.toFixed(1)}★</div>
        </div>
        <div className="stat-card">
          <h3>Recent Reviews (7 days)</h3>
          <div className="value">{stats.recentReviews}</div>
        </div>
      </div>

      <div className="reviews-table">
        <table>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Gym Name</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map(review => (
              <tr key={review.id}>
                <td>{review.clientName}</td>
                <td>{review.gymName}</td>
                <td>{review.gymLocation}</td>
                <td>{review.rating}★</td>
                <td>{review.text}</td>
                <td>{review.date}</td>
                <td className="action-buttons">
                  <button className="reply-btn" onClick={() => handleReply(review)}>
                    <FaReply /> Reply
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(review)}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showReplyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Reply to Review</h2>
            </div>
            <div className="modal-body">
              <p><strong>Client:</strong> {selectedReview.clientName}</p>
              <p><strong>Gym:</strong> {selectedReview.gymName}</p>
              <p><strong>Rating:</strong> {selectedReview.rating}★</p>
              <p><strong>Review:</strong> {selectedReview.text}</p>
              <textarea
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowReplyModal(false)}>Cancel</button>
              <button className="reply-btn" onClick={submitReply}>Submit Reply</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Delete Review</h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this review?</p>
              <p><strong>Gym:</strong> {selectedReview.gymName}</p>
              <p><strong>Client:</strong> {selectedReview.clientName}</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="delete-btn" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerReviewsDashboard;