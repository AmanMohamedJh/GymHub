import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import "./Styles/browseTrainers.css";

const BrowseTrainers = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [filterExpertise, setFilterExpertise] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/trainer/registration/all"
        );
        if (!response.ok) throw new Error("Failed to fetch trainers");
        const data = await response.json();
        setTrainers(data);
        setFilteredTrainers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  useEffect(() => {
    // Filtering logic for search, experience, and expertise
    let filtered = trainers.filter(trainer => {
      const matchesName = trainer.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesExperience = filterExperience ? (trainer.yearsOfExperience >= parseInt(filterExperience)) : true;
      const matchesExpertise = filterExpertise ? (trainer.trainingType === filterExpertise) : true;
      return matchesName && matchesExperience && matchesExpertise;
    });
    setFilteredTrainers(filtered);
  }, [searchQuery, filterExperience, filterExpertise, trainers]);


  return (
    <div className="browse-trainers-container">
      <h2 className="page-title">Browse Trainers</h2>

      <div className="trainer-search-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="trainer-search-input"
        />
        <select
          value={filterExperience}
          onChange={e => setFilterExperience(e.target.value)}
          className="trainer-filter-select"
        >
          <option value="">All Years</option>
          <option value="1">1+ years</option>
          <option value="2">2+ years</option>
          <option value="3">3+ years</option>
          <option value="5">5+ years</option>
          <option value="10">10+ years</option>
        </select>
        <select
          value={filterExpertise}
          onChange={e => setFilterExpertise(e.target.value)}
          className="trainer-filter-select"
        >
          <option value="">All Expertise</option>
          {Array.from(new Set(trainers.map(t => t.trainingType).filter(Boolean))).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="trainers-list">
        {loading && <p>Loading trainers...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && !error && filteredTrainers.length === 0 && (
          <p>No trainers found.</p>
        )}
        {filteredTrainers.map((trainer) => {
          // Avatar initials fallback
          const initials = trainer.name
            ? trainer.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
            : 'TR';
          return (
            <div key={trainer._id} className="trainer-card">
              <div className="avatar-spacer" />
              <div className="trainer-avatar">
                {initials}
              </div>
              <h3>{trainer.name}</h3>
              <div className="divider" />
              <div className="trainer-details">
                <p><span className="label">Expertise:</span> {trainer.trainingType || "N/A"}</p>
                <p><span className="label">Age:</span> {trainer.age ? trainer.age : "N/A"}</p>
                <p><span className="label">Experience:</span> {trainer.yearsOfExperience ? `${trainer.yearsOfExperience} years` : "N/A"}</p>
              </div>
              <button
                className="btn-red"
                onClick={() => navigate(`/trainer/details/${trainer._id}`)}
              >
                <FaChartLine style={{ marginRight: 8 }} /> <span>View Trainer Sessions</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrowseTrainers;
