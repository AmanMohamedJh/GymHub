import React, { useState, useEffect } from "react";
import "./Styles/ContactUsManagement.css";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";

const API_BASE_URL = "http://localhost:4000/api/admin";

const ContactUsManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState();
  const [reply, setReply] = useState("");
  const { user } = useAuthContext();






  useEffect(() => {
    fetchMessages();
  }, []);
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contact-messages`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log("Fetched messages:", response.data);
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);

      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/contact-messages/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleSendReply = async (messageId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/contact-messages/${messageId}/reply`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.ok) {
        setSelectedMessage(null);
        setReply("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="contact-management">
      <h2>Contact Messages Management</h2>

      <div className="messages-grid">
        {messages.map((message) => (
          <div key={message._id} className={`message-card ${message.status}`}>
            <div className="message-header">
              <h3>{message.subject}</h3>
              <span className={`status ${message.status}`}>
                {message.status}
              </span>
            </div>
            <div className="message-content">
              <p>
                <strong>From:</strong> {message.name}
              </p>
              <p>
                <strong>Email:</strong> {message.email}
              </p>
              <p>
                <strong>Message:</strong>
              </p>
              <p className="message-text">{message.message}</p>
              <p className="message-date">
                <strong>Received:</strong>{" "}
                {new Date(message.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="action-buttons">
              {message.status === "pending" && (
                <button
                  className="reply-btn"
                  onClick={() => setSelectedMessage(message)}
                >
                  Reply
                </button>
              )}
              <button
                className="delete-btn"
                onClick={() => handleDeleteMessage(message._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedMessage && (
        <div className="reply-modal">
          <div className="modal-content">
            <h3>Reply to {selectedMessage.name}</h3>
            <div className="original-message">
              <p>
                <strong>Original Message:</strong>
              </p>
              <p>{selectedMessage.message}</p>
            </div>
            <div className="reply-form">
              <textarea
                placeholder="Type your reply here..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <div className="modal-buttons">
                <button
                  className="send-btn"
                  onClick={() => handleSendReply(selectedMessage._id)}
                  disabled={!reply.trim()}
                >
                  Send Reply
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setSelectedMessage(null);
                    setReply("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {messages.length === 0 && (
        <div className="no-messages">No contact messages found</div>
      )}
    </div>
  );
};

export default ContactUsManagement;
