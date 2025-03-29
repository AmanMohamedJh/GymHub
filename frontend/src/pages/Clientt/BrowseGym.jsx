import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaSearch,
  FaDumbbell,
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";
import "./Styles/browseGyms.css";

const BrowseGyms = () => {
  // Example gym data (replace with API data)
  const gyms = [
    {
      id: 1,
      name: "Fitness Zone",
      location: "Colombo",
      type: "Strength Training",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      features: ["24/7 Access", "Personal Training", "Modern Equipment"],
    },
    {
      id: 2,
      name: "Powerhouse Gym",
      location: "Kandy",
      type: "Cardio",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      features: ["Group Classes", "Cardio Zone", "Nutrition Planning"],
    },
    {
      id: 3,
      name: "Flex Fitness",
      location: "Galle",
      type: "Yoga",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1598136490941-30d885318abd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
      features: ["Yoga Studio", "Meditation Room", "Expert Instructors"],
    },
    {
      id: 4,
      name: "Muscle Factory",
      location: "Negombo",
      type: "CrossFit",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      features: ["CrossFit Area", "Olympic Lifting", "High-Intensity Training"],
    },
    {
      id: 5,
      name: "Total Fitness",
      location: "Matara",
      type: "Strength Training",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
      features: ["Free Weights", "Cardio Equipment", "Locker Rooms"],
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSelectedType(e.target.value);
  };

  const filteredGyms = gyms.filter((gym) => {
    return (
      (gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gym.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedType === "All" || gym.type === selectedType)
    );
  });

  return (
    <div className="browse-gyms-page">
      <div className="browse-gyms-header">
        <h1>Find Your Perfect Gym</h1>
        <p>Discover the best fitness facilities across Sri Lanka</p>
      </div>

      <div className="browse-gyms-container">
        <div className="filters-container">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by gym name or location"
              className="search-bar"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
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
                <div
                  className="gym-image"
                  style={{ backgroundImage: `url(${gym.image})` }}
                >
                  <div className="gym-type-badge">{gym.type}</div>
                </div>
                <div className="gym-content">
                  <h3 className="gym-name">{gym.name}</h3>
                  <div className="gym-rating">
                    <FaStar className="star-icon" />
                    <span>{gym.rating}</span>
                  </div>
                  <p className="gym-location">
                    <FaMapMarkerAlt className="location-icon" />
                    {gym.location}
                  </p>
                  <div className="gym-features">
                    {gym.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        <FaDumbbell className="feature-icon" />
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Link to={`/gym/${gym.id}`} className="btn-view">
                    <FaChartLine className="btn-icon" />
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <FaDumbbell className="no-results-icon" />
              <p>No gyms found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseGyms;
