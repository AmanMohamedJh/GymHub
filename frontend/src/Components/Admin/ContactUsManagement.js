import React, { useState, useEffect } from "react";
import {
  getContactMessages,
  deleteContactMessage,
  replyToContactMessage,
} from "../../utils/contactApi";
import "./Styles/ContactUsManagement.css";

const ContactUsManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      await deleteContactMessage(messageId);
      alert("Message deleted successfully");
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message");
    }
  };

  const handleSendReply = async (messageId) => {
    if (!reply.trim()) {
      alert("Please enter a reply before sending");
      return;
    }

    try {
      await replyToContactMessage(messageId, reply);
      alert("Reply sent successfully");
      setSelectedMessage(null);
      setReply("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="contact-management-container">
      <h2>Contact Us Management</h2>

      {selectedMessage ? (
        <div className="reply-container">
          <h3>Reply to {selectedMessage.name}</h3>
          <div className="message-details">
            <p>
              <strong>From:</strong> {selectedMessage.name} (
              {selectedMessage.email})
            </p>
            <p>
              <strong>Subject:</strong>{" "}
              {selectedMessage.subject || "No Subject"}
            </p>
            <p>
              <strong>Message:</strong>
            </p>
            <div className="original-message">{selectedMessage.message}</div>
          </div>

          <div className="reply-form">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here..."
              rows={6}
            ></textarea>
            <div className="reply-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setSelectedMessage(null);
                  setReply("");
                }}
              >
                Cancel
              </button>
              <button
                className="send-btn"
                onClick={() => handleSendReply(selectedMessage._id)}
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="messages-count">
            <p>Total Messages: {messages.length}</p>
            <p>
              Pending: {messages.filter((m) => m.status === "pending").length}
            </p>
            <p>
              Replied: {messages.filter((m) => m.status === "replied").length}
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="no-messages">No messages found</div>
          ) : (
            <div className="messages-table-container">
              <table className="messages-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr
                      key={message._id}
                      className={message.status === "pending" ? "pending" : ""}
                    >
                      <td>{message.name}</td>
                      <td>{message.email}</td>
                      <td>{message.subject || "No Subject"}</td>
                      <td className="message-preview">
                        {message.message.length > 50
                          ? `${message.message.substring(0, 50)}...`
                          : message.message}
                      </td>
                      <td>{formatDate(message.createdAt)}</td>
                      <td>
                        <span className={`status ${message.status}`}>
                          {message.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="reply-btn"
                          onClick={() => setSelectedMessage(message)}
                          disabled={message.status === "replied"}
                        >
                          Reply
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteMessage(message._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContactUsManagement;
