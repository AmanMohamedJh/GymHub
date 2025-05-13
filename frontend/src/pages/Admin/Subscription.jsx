import React, { useState } from 'react';
import './Styles/SubscriptionManagement.css';

const SubscriptionDashboard = () => {
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, type: 'Monthly', amount: 50, description: 'Access to all gym facilities for 30 days' },
    { id: 2, type: 'Yearly', amount: 500, description: 'Full access for 12 months with a discount' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [newAmount, setNewAmount] = useState('');

  const openEditModal = (subscription) => {
    setCurrentSubscription(subscription);
    setNewAmount(subscription.amount);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSubscription(null);
    setNewAmount('');
  };

  const handleSave = () => {
    if (newAmount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }
    setSubscriptions(
      subscriptions.map((sub) =>
        sub.id === currentSubscription.id ? { ...sub, amount: parseFloat(newAmount) } : sub
      )
    );
    closeModal();
  };

  return (
    <div className="dashboard-wrapper">
      <div className="subscription-card">
        <h1 className="subscription-title">Gym Subscription Management</h1>
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
                  <td className="subscription-table-cell">{subscription.type}</td>
                  <td className="subscription-table-cell">${subscription.amount}</td>
                  <td className="subscription-table-cell">{subscription.description}</td>
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
            <h2 className="modal-title">Edit {currentSubscription?.type} Subscription</h2>
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
              <button onClick={closeModal} className="modal-cancel-button">Cancel</button>
              <button onClick={handleSave} className="modal-save-button">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionDashboard;
