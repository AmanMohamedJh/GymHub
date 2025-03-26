import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import "./Styles/browseGyms.css";

const BrowseGyms = () => {
    // Example gym data (replace with API data)
    const gyms = [
        { id: 1, name: "Fitness Zone", location: "New York", type: "Strength Training" },
        { id: 2, name: "Powerhouse Gym", location: "Los Angeles", type: "Cardio" },
        { id: 3, name: "Flex Fitness", location: "Chicago", type: "Yoga" },
        { id: 4, name: "Muscle Factory", location: "Miami", type: "CrossFit" },
        { id: 5, name: "Total Fitness", location: "San Francisco", type: "Strength Training" }
    ];

    // State for search and filter
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setSelectedType(e.target.value);
    };

    const filteredGyms = gyms.filter(gym => {
        return (
            (gym.name.toLowerCase().includes(searchTerm.toLowerCase()) || gym.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedType === "All" || gym.type === selectedType)
        );
    });

    return (
        <div className="browse-gyms-container">
            <h2 className="page-title">Browse Gyms</h2>

            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Search for gyms or locations"
                    className="search-bar"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select
                    className="filter-dropdown"
                    value={selectedType}
                    onChange={handleFilterChange}
                >
                    <option value="All">All Types</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Yoga">Yoga</option>
                    <option value="CrossFit">CrossFit</option>
                </select>
            </div>

            <div className="gyms-list">
                {filteredGyms.length > 0 ? (
                    filteredGyms.map((gym) => (
                        <div key={gym.id} className="gym-card">
                            <h3 className="gym-name">{gym.name}</h3>
                            <p className="gym-location">{gym.location}</p>
                            <p className="gym-type">{gym.type}</p>
                            <Link to="/gymDetails" style={{ textDecoration: "none" }}>
                                <button className="btn-view">
                                    <FaChartLine /> View Full Details
                                </button>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No gyms found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default BrowseGyms;
