import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Styles/SubscriptionManagement.css";
import { useAuthContext } from "../../hooks/useAuthContext";

const API_BASE_URL = "http://localhost:4000/api/admin";

const SubscriptionDashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [newAmount, setNewAmount] = useState("");
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        if (!user?.token) {
          throw new Error("No authentication token available");
        }
        const response = await axios.get(`${API_BASE_URL}/subscriptions`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setSubscriptions(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch subscriptions"
        );
      }
    };

    fetchSubscriptions();
  }, [user]);

  const openEditModal = (subscription) => {
    setCurrentSubscription(subscription);
    setNewAmount(subscription.amount?.toString());
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSubscription(null);
    setNewAmount("");
  };

  const handleSave = async () => {
    try {
      if (!user?.token) {
        throw new Error("No authentication token available");
      }
      const response = await axios.put(
        `${API_BASE_URL}/subscriptions/${currentSubscription.id}/update-price`,
        { price: parseFloat(newAmount) },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSubscriptions(
        subscriptions.map((sub) =>
          sub.id === currentSubscription.id
            ? { ...sub, amount: response.data.price || parseFloat(newAmount) }
            : sub
        )
      );
      closeModal();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update subscription price"
      );
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="subscription-card">
        <h1 className="subscription-title">Gym Subscription Management</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="subscription-table-container">
          <table className="subscription-table">
            <thead>
              <tr className="subscription-table-header">
                <th className="subscription-table-heading">Plan</th>
                <th className="subscription-table-heading">Amount ($)</th>
                <th className="subscription-table-heading">Description</th>
                <th className="subscription-table-heading">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => (
                <tr key={subscription.id} className="subscription-table-row">
                  <td className="subscription-table-cell">
                    {subscription.type}
                  </td>
                  <td className="subscription-table-cell">
                    ${subscription.amount}
                  </td>
                  <td className="subscription-table-cell">
                    {subscription.description}
                  </td>
                  <td className="subscription-table-cell">
                    <button
                      onClick={() => openEditModal(subscription)}
                      className="edit-subscription-button"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">
              Edit {currentSubscription?.type} Subscription
            </h2>
            <div className="modal-field">
              <label className="modal-label">Amount ($)</label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="modal-input-field"
                min="0"
                step="0.01"
              />
            </div>
            <div className="modal-buttons">
              <button onClick={closeModal} className="modal-cancel-button">
                Cancel
              </button>
              <button onClick={handleSave} className="modal-save-button">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionDashboard;
