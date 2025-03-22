import React, { useState } from 'react';
import { FaEnvelope, FaReply, FaArchive, FaSearch, FaFilter } from 'react-icons/fa';
import './AdminManagement.css';

const AdminMessages = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'John Doe',
      email: 'john@example.com',
      subject: 'Gym Membership Inquiry',
      message: 'I would like to know more about your premium membership plans...',
      timestamp: '2025-03-21 15:30',
      type: 'inquiry',
      status: 'unread'
    },
    {
      id: 2,
      sender: 'Sarah Wilson',
      email: 'sarah@example.com',
      subject: 'Trainer Application Status',
      message: 'Following up on my trainer application submitted last week...',
      timestamp: '2025-03-21 14:15',
      type: 'application',
      status: 'read'
    },
    {
      id: 3,
      sender: 'FitLife Gym',
      email: 'manager@fitlife.com',
      subject: 'Partnership Proposal',
      message: 'We would like to discuss a potential partnership opportunity...',
      timestamp: '2025-03-21 12:45',
      type: 'business',
      status: 'unread'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleFilter = (e) => {
    setFilterType(e.target.value);
  };

  const handleReply = (message) => {
    setReplyModal(message);
    // Pre-fill with a template
    setReplyText(`Dear ${message.sender},\n\nThank you for your message. `);
  };

  const sendReply = () => {
    // Here you would typically make an API call to send the email
    alert('Reply sent successfully!');
    // Update message status
    setMessages(messages.map(msg => 
      msg.id === replyModal.id ? { ...msg, status: 'read' } : msg
    ));
    setReplyModal(null);
    setReplyText('');
  };

  const archiveMessage = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.sender.toLowerCase().includes(searchTerm) ||
      message.subject.toLowerCase().includes(searchTerm) ||
      message.message.toLowerCase().includes(searchTerm);
    
    const matchesFilter = 
      filterType === 'all' || 
      message.type === filterType ||
      (filterType === 'unread' && message.status === 'unread');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-management-container">
      <div className="admin-header">
        <h2>Message Center</h2>
        <div className="messages-controls">
          <div className="search-filter-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="filter-box">
              <FaFilter className="filter-icon" />
              <select value={filterType} onChange={handleFilter}>
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="inquiry">Inquiries</option>
                <option value="application">Applications</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="messages-area">
        <div className="messages-list">
          {filteredMessages.map(message => (
            <div key={message.id} className={`message-item ${message.status}`}>
              <div className="message-avatar">
                <FaEnvelope />
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">{message.sender}</span>
                  <span className="message-time">{message.timestamp}</span>
                </div>
                <div className="message-subject">{message.subject}</div>
                <div className="message-preview">{message.message}</div>
                <div className="message-actions">
                  <button 
                    className="message-action-btn btn-reply"
                    onClick={() => handleReply(message)}
                  >
                    <FaReply /> Reply
                  </button>
                  <button 
                    className="message-action-btn btn-archive"
                    onClick={() => archiveMessage(message.id)}
                  >
                    <FaArchive /> Archive
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {replyModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Reply to {replyModal.sender}</h3>
            <div className="reply-form">
              <div className="form-group">
                <label>To:</label>
                <input type="text" value={replyModal.email} disabled />
              </div>
              <div className="form-group">
                <label>Subject:</label>
                <input 
                  type="text" 
                  value={`Re: ${replyModal.subject}`}
                  disabled 
                />
              </div>
              <div className="form-group">
                <label>Message:</label>
                <textarea
                  rows="6"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                />
              </div>
              <div className="form-buttons">
                <button className="btn-save" onClick={sendReply}>
                  Send Reply
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => {
                    setReplyModal(null);
                    setReplyText('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
