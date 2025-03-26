import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import "./Styles/browseTrainers.css";

const BrowseTrainers = () => {
    // Example trainers data (replace with actual API data)
    const trainers = [
        { id: 1, name: "John Doe", expertise: "Strength Training", rating: 4.5 },
        { id: 2, name: "Jane Smith", expertise: "Yoga", rating: 4.8 },
        { id: 3, name: "Mark Lee", expertise: "CrossFit", rating: 4.7 },
        { id: 4, name: "Emily Taylor", expertise: "Pilates", rating: 4.3 },
        { id: 5, name: "Chris Brown", expertise: "Cardio", rating: 4.6 }
    ];

    const [filteredTrainers, setFilteredTrainers] = useState(trainers);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRating, setFilterRating] = useState(0);

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
                {filteredTrainers.map((trainer) => (
                    <div key={trainer.id} className="trainer-card">
                        <h3>{trainer.name}</h3>
                        <p>Expertise: {trainer.expertise}</p>
                        <p>Rating: {trainer.rating} ★</p>
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
