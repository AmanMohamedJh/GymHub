import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaUser, FaFilter, FaPlus } from 'react-icons/fa';
import './Styles/AdminClientManagement.css';

const AdminClientManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      membershipType: "Premium",
      gym: "FitLife Gym",
      joinDate: "2025-01-15",
      status: "Active",
      lastActive: "2025-03-21",
      paymentStatus: "Paid",
      attendance: 85
    },
    {
      id: 2,
      name: "Mike Wilson",
      email: "mike@example.com",
      membershipType: "Basic",
      gym: "Power House",
      joinDate: "2025-02-01",
      status: "Inactive",
      lastActive: "2025-03-10",
      paymentStatus: "Overdue",
      attendance: 45
    }
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.gym.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Inactive': return 'status-inactive';
      default: return '';
    }
  };

  const stats = [
    { title: 'Total Clients', value: clients.length },
    { title: 'Active Clients', value: clients.filter(c => c.status === 'Active').length },
    { title: 'Premium Members', value: clients.filter(c => c.membershipType === 'Premium').length },
    { title: 'Basic Members', value: clients.filter(c => c.membershipType === 'Basic').length },
  ];

  return (
    <div className="admin-management-container">
      <div className="management-header">
        <h2>Client Management</h2>
        <div className="header-actions">
          <div className="search-filter-container">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="filter-box">
              <FaFilter />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button className="add-btn">
            <FaPlus />
            Add New Client
          </button>
        </div>
      </div>

      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <span className="stat-title">{stat.title}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="management-content">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Gym</th>
                <th>Membership</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id}>
                  <td>
                    <div className="user-info">
                      <FaUser className="user-icon" />
                      <span>{client.name}</span>
                    </div>
                  </td>
                  <td>{client.email}</td>
                  <td>{client.gym}</td>
                  <td>
                    <span className={`membership-badge ${client.membershipType.toLowerCase()}`}>
                      {client.membershipType}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn edit">
                        <FaEdit />
                      </button>
                      <button className="icon-btn delete">
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
    </div>
  );
};

export default AdminClientManagement;
