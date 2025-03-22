import React, { useState } from 'react';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import './Styles/AdminTrainerManagement.css';

const AdminTrainerManagement = () => {
  const [trainers, setTrainers] = useState([
    {
      id: 1,
      name: "John Doe",
      specialization: "Weight Training",
      experience: "5 years",
      gym: "FitLife Gym",
      status: "Active",
      certifications: ["ACE", "NASM"],
      rating: 4.5,
      clientCount: 12
    },
    {
      id: 2,
      name: "Jane Smith",
      specialization: "Yoga",
      experience: "3 years",
      gym: "Power House",
      status: "Suspended",
      certifications: ["ISSA"],
      rating: 4.8,
      clientCount: 8
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [showCertifications, setShowCertifications] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    setTrainers(trainers.map(trainer => 
      trainer.id === id ? { ...trainer, status: newStatus } : trainer
    ));
    alert(`Trainer status updated to ${newStatus}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this trainer? This action cannot be undone.')) {
      setTrainers(trainers.filter(trainer => trainer.id !== id));
      alert('Trainer deleted successfully');
    }
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    setTrainers(trainers.map(trainer => 
      trainer.id === editingTrainer.id ? editingTrainer : trainer
    ));
    setEditingTrainer(null);
    alert('Trainer details updated successfully');
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Specialization', 'Experience', 'Gym', 'Status', 'Rating', 'Client Count'];
    const data = trainers.map(trainer => [
      trainer.name,
      trainer.specialization,
      trainer.experience,
      trainer.gym,
      trainer.status,
      trainer.rating,
      trainer.clientCount
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trainers_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredTrainers = trainers
    .filter(trainer => {
      const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trainer.gym.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || trainer.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'clients':
          return b.clientCount - a.clientCount;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="admin-management-container">
      <div className="admin-header">
        <h2>Trainer Management</h2>
        <div className="admin-actions">
          <div className="search-filter-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search trainers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <FaSearch className="filter-icon" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="sort-box">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="clients">Sort by Clients</option>
              </select>
            </div>
          </div>
          <button className="btn-export" onClick={exportToCSV}>
            <FaSearch /> Export Report
          </button>
        </div>
      </div>

      {editingTrainer ? (
        <div className="edit-form-container">
          <form onSubmit={handleSaveEdit} className="edit-form">
            <h3>Edit Trainer Details</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={editingTrainer.name}
                onChange={(e) => setEditingTrainer({...editingTrainer, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Specialization:</label>
              <input
                type="text"
                value={editingTrainer.specialization}
                onChange={(e) => setEditingTrainer({...editingTrainer, specialization: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Experience:</label>
              <input
                type="text"
                value={editingTrainer.experience}
                onChange={(e) => setEditingTrainer({...editingTrainer, experience: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Gym:</label>
              <input
                type="text"
                value={editingTrainer.gym}
                onChange={(e) => setEditingTrainer({...editingTrainer, gym: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Certifications (comma-separated):</label>
              <input
                type="text"
                value={editingTrainer.certifications.join(', ')}
                onChange={(e) => setEditingTrainer({
                  ...editingTrainer,
                  certifications: e.target.value.split(',').map(cert => cert.trim())
                })}
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-save">Save Changes</button>
              <button type="button" onClick={() => setEditingTrainer(null)} className="btn-cancel">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Gym</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Clients</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainers.map(trainer => (
                <tr key={trainer.id}>
                  <td>{trainer.name}</td>
                  <td>{trainer.specialization}</td>
                  <td>{trainer.experience}</td>
                  <td>{trainer.gym}</td>
                  <td>
                    <span className={`status-badge status-${trainer.status.toLowerCase()}`}>
                      {trainer.status}
                    </span>
                  </td>
                  <td>{trainer.rating} / 5</td>
                  <td>{trainer.clientCount}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => handleStatusChange(trainer.id, 'Active')}
                      className="btn-approve"
                      disabled={trainer.status === 'Active'}
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => handleStatusChange(trainer.id, 'Suspended')}
                      className="btn-reject"
                      disabled={trainer.status === 'Suspended'}
                    >
                      Suspend
                    </button>
                    <button
                      onClick={() => setEditingTrainer(trainer)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTrainer(trainer);
                        setShowCertifications(true);
                      }}
                      className="btn-view"
                    >
                      View Certs
                    </button>
                    <button
                      onClick={() => handleDelete(trainer.id)}
                      className="btn-delete"
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

      {showCertifications && selectedTrainer && (
        <div className="modal">
          <div className="modal-content">
            <h3>Certifications - {selectedTrainer.name}</h3>
            <ul>
              {selectedTrainer.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
            <button onClick={() => setShowCertifications(false)} className="btn-close">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrainerManagement;
