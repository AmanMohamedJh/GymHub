import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import "./Styles/browseTrainers.css";

const BrowseTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState(0);
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterTrainers(e.target.value, filterRating);
  };

  const handleFilterChange = (e) => {
    setFilterRating(e.target.value);
    filterTrainers(searchQuery, e.target.value);
  };

  const filterTrainers = (query, rating) => {
    const filtered = trainers.filter((trainer) => {
      return (
        trainer.name.toLowerCase().includes(query.toLowerCase()) &&
        trainer.rating >= rating
      );
    });
    setFilteredTrainers(filtered);
  };

  return (
    <div className="browse-trainers-container">
      <h2 className="page-title">Browse Trainers</h2>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search Trainers..."
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select
          className="filter-rating"
          value={filterRating}
          onChange={handleFilterChange}
        >
          <option value={0}>All Ratings</option>
          <option value={4}>4+ Stars</option>
          <option value={4.5}>4.5+ Stars</option>
          <option value={5}>5 Stars</option>
        </select>
      </div>

      <div className="trainers-list">
        {loading && <p>Loading trainers...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && !error && filteredTrainers.length === 0 && (
          <p>No trainers found.</p>
        )}
        {filteredTrainers.map((trainer) => (
          <div key={trainer._id} className="trainer-card">
            <h3>{trainer.name}</h3>
            <p>Expertise: {trainer.trainingType || "N/A"}</p>
            <p>Age: {trainer.age ? trainer.age : "N/A"}</p>
            <p>
              Experience:{" "}
              {trainer.yearsOfExperience
                ? `${trainer.yearsOfExperience} years`
                : "N/A"}
            </p>

            <Link to="/gymDetails" style={{ textDecoration: "none" }}>
              <button className="btn-view">
                <FaChartLine /> View Full Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseTrainers;
