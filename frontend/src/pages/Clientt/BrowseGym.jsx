import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import "./Styles/browseGyms.css";

const BrowseGyms = () => {
  const [gyms, setGyms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const res = await fetch("/api/gym/getALlgym");
        const data = await res.json();
        // Defensive: ensure data is an array
        setGyms(Array.isArray(data) ? data : []);
      } catch (err) {
        setGyms([]);
      }
    };
    fetchGyms();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter by city (case-insensitive)
  const filteredGyms = gyms.filter(
    (gym) =>
      gym.location &&
      gym.location.city &&
      gym.location.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="browse-gyms-page">
      <div className="browse-gyms-header">
        <div className="browsegyms-header-glass">
          <h1 className="browsegyms-main-title">Find Your Perfect Gym</h1>
          <p className="browsegyms-main-sub">
            Discover the best fitness facilities across Sri Lanka
          </p>
        </div>
      </div>
      <div className="browse-gyms-container">
        <div className="filters-container">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search by location"
              className="search-bar browsegyms-search-bar"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="gyms-list browsegyms-list">
          {filteredGyms.length > 0 ? (
            filteredGyms.map((gym) => (
              <div key={gym._id} className="browsegyms-card">
                <div className="browsegyms-card-header">
                  <span className="browsegyms-gym-name">{gym.name}</span>
                </div>
                <div className="browsegyms-card-body">
                  <img
                    src={
                      gym.images && gym.images.length > 0
                        ? gym.images[0].startsWith("http")
                          ? gym.images[0]
                          : `${
                              process.env.REACT_APP_API_URL
                                ? process.env.REACT_APP_API_URL.replace(
                                    /\/$/,
                                    ""
                                  )
                                : ""
                            }/${gym.images[0].replace(/^\//, "")}`
                        : "/placeholder.jpg"
                    }
                    alt={gym.name}
                    className="browsegyms-gym-image"
                  />
                  <div className="browsegyms-info-row">
                    <span className="browsegyms-rating">
                      <FaStar style={{ color: "#fbbf24", marginRight: 4 }} />
                      {/* Mock rating for now */}
                      {gym.rating || 4 + Math.round(Math.random() * 10) / 10}
                    </span>
                    <span className="browsegyms-location">
                      <FaMapMarkerAlt style={{ marginRight: 4 }} />
                      {gym.location?.city || "-"}
                    </span>
                    <Link
                      to={`/gyms/${gym._id}`}
                      className="browsegyms-details-btn"
                    >
                      See more details
                    </Link>
                  </div>
                  <div className="browsegyms-offers">
                    {(gym.amenities || []).map((amenity, idx) => (
                      <span key={idx} className="browsegyms-offer-item">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", width: "100%", color: "#888" }}>
              No gyms found in this location.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseGyms;
