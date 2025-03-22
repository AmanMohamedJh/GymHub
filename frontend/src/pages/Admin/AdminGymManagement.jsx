import React, { useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaCheck, FaTimes, FaFilter, FaPlus } from 'react-icons/fa';
import './Styles/AdminGymManagement.css';

const AdminGymManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [gyms, setGyms] = useState([
    { id: 1, name: 'FitLife Gym', location: 'Downtown', status: 'active', members: 150, rating: 4.5 },
    { id: 2, name: 'PowerHouse', location: 'Westside', status: 'pending', members: 0, rating: 0 },
    { id: 3, name: 'Elite Fitness', location: 'Eastside', status: 'active', members: 200, rating: 4.8 },
    { id: 4, name: 'GymZone', location: 'Northside', status: 'inactive', members: 75, rating: 3.9 },
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredGyms = gyms.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || gym.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'pending': return 'status-pending';
      case 'inactive': return 'status-inactive';
      default: return '';
    }
  };

  const stats = [
    { title: 'Total Gyms', value: gyms.length },
    { title: 'Active Gyms', value: gyms.filter(g => g.status === 'active').length },
    { title: 'Pending Approval', value: gyms.filter(g => g.status === 'pending').length },
    { title: 'Total Members', value: gyms.reduce((acc, gym) => acc + gym.members, 0) },
  ];

  const handleStatusChange = (id, newStatus) => {
    setGyms(gyms.map(gym => 
      gym.id === id ? { ...gym, status: newStatus } : gym
    ));
    alert(`Gym status updated to ${newStatus}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this gym?')) {
      setGyms(gyms.filter(gym => gym.id !== id));
      alert('Gym deleted successfully');
    }
  };

  return (
    <div className="admin-management-container">
      <div className="management-header">
        <h2>Gym Management</h2>
        <div className="header-actions">
          <div className="search-filter-container">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search gyms..."
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
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button className="add-btn">
            <FaPlus />
            Add New Gym
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
                <th>Gym Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Members</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGyms.map(gym => (
                <tr key={gym.id}>
                  <td>{gym.name}</td>
                  <td>{gym.location}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(gym.status)}`}>
                      {gym.status}
                    </span>
                  </td>
                  <td>{gym.members}</td>
                  <td>{gym.rating.toFixed(1)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn edit">
                        <FaEdit />
                      </button>
                      {gym.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleStatusChange(gym.id, 'active')} 
                            className="icon-btn approve"
                          >
                            <FaCheck />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(gym.id, 'inactive')} 
                            className="icon-btn reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleDelete(gym.id)} 
                          className="icon-btn delete"
                        >
                          <FaTrash />
                        </button>
                      )}
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

export default AdminGymManagement;
