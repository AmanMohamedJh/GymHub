import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import "./Styles/browseGyms.css";

const BrowseGyms = () => {
  const [gyms, setGyms] = useState([]);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [city, setCity] = useState("");
  const [amenity, setAmenity] = useState("");
  const [minRating, setMinRating] = useState("");

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

  const handleAdvancedSearch = () => setAdvancedSearch((v) => !v);

  const filteredGyms = gyms.filter((gym) => {
    let match = true;
    if (city && gym.location?.city) {
      match =
        match && gym.location.city.toLowerCase().includes(city.toLowerCase());
    }
    if (amenity && gym.amenities) {
      match =
        match &&
        gym.amenities.some((a) =>
          a.toLowerCase().includes(amenity.toLowerCase())
        );
    }
    if (minRating && gym.avgRating) {
      match = match && gym.avgRating >= parseFloat(minRating);
    }
    return match;
  });

  return (
    <div className="browse-gyms-page-bg">
      <div className="browsegyms-container">
        <div className="browsegyms-titlebar-bg">
          <div className="browsegyms-titlebar-content">
            <h1 className="browsegyms-hero-title">
              Explore Sri Lanka's Top Gyms
            </h1>
            <p className="browsegyms-hero-sub">
              Smart search. Real reviews. Modern fitness.
            </p>
            <div className="filters-container-modern browsegyms-titlebar-search">
              <div className="search-wrapper-modern">
                <input
                  type="text"
                  placeholder="Quick search by city..."
                  className="search-bar browsegyms-search-bar-modern"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <button
                  className="advanced-search-toggle"
                  onClick={handleAdvancedSearch}
                >
                  {advancedSearch ? "Hide Advanced" : "Advanced Search"}
                </button>
              </div>
              {advancedSearch && (
                <div className="advanced-search-fields">
                  <input
                    type="text"
                    placeholder="Amenity (e.g. pool, parking)"
                    className="browsegyms-search-bar-modern"
                    value={amenity}
                    onChange={(e) => setAmenity(e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="Min Rating"
                    className="browsegyms-search-bar-modern"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="gyms-list browsegyms-list grid-browsegyms-list grid-browsegyms-list-tight">
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
                      {gym.avgRating ? gym.avgRating : "No rating"}
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
