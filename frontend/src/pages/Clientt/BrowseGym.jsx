
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChartLine, FaLocationArrow, FaMapMarkerAlt } from "react-icons/fa";
import "./Styles/browseGyms.css";

const BrowseGyms = () => {
  const [gyms, setGyms] = useState([]); // Original gym list
  const [filteredGyms, setFilteredGyms] = useState([]); // Filtered gyms
  const [searchQuery, setSearchQuery] = useState(""); // Search location query
  const [filterRating, setFilterRating] = useState(0); // Filter rating (0 means no rating filter)

  // Fetch gyms once when the component is mounted
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const res = await fetch("/api/gym/getALlgym");
        const data = await res.json();
        console.log("Fetched gyms:", data); // Debugging: Check the fetched data
        setGyms(Array.isArray(data) ? data : []);
        setFilteredGyms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching gyms:", err); // Debugging: Log error
        setGyms([]);
        setFilteredGyms([]); // Handle error
      }
    };
    fetchGyms();
  }, []);

  // This useEffect will re-filter the gyms based on searchQuery and filterRating
  useEffect(() => {
    console.log("Filtering gyms with searchQuery:", searchQuery, "filterRating:", filterRating); // Debugging
    filterGyms(searchQuery, filterRating); // Reapply the filters when either of them changes
  }, [searchQuery, filterRating]);

  // Search bar input change handler
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query
  };

  // Rating filter change handler
  const handleFilterChange = (e) => {
    setFilterRating(Number(e.target.value)); // Update the selected rating
  };

  // Filtering function based on location and rating
  const filterGyms = (query, rating) => {
    console.log("Filtering with query:", query, "and rating:", rating); // Debugging
    const filtered = gyms.filter((gym) => {
      const queryLower = query.toLowerCase();

      // Check if gym name or location matches the query
      const nameMatches = gym.name?.toLowerCase().includes(queryLower);
      const locationMatches =
        gym.location?.city?.toLowerCase().includes(queryLower) ||
        gym.location?.district?.toLowerCase().includes(queryLower) ||
        gym.location?.street?.toLowerCase().includes(queryLower);

      // Rating filter: Only include gyms with rating >= filterRating
      return (
        (query ? nameMatches || locationMatches : true) &&
        (rating ? gym.avgRating >= rating : true)
      );
    });


    console.log("Filtered gyms:", filtered); // Debugging: Check the filtered gyms
    setFilteredGyms(filtered); // Set filtered gyms to state
  };

  const handleFindNearbyGyms = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log("User Lat:", latitude, "User Lng:", longitude, "Accuracy in meters:", accuracy);

        // Use this accurate position in your state
        const userLat = latitude;
        const userLng = longitude;
        const radiusKm = 80;

        const filtered = gyms.filter((gym) => {
          if (!gym.location?.coordinates) return false;
          const gymLat = gym.location?.coordinates?.lat;
          const gymLng = gym.location?.coordinates?.lng;
          console.log(gym.name, "userLat: ", userLat, " userLng: ", userLng, " gymLat: ", gymLat, " gymLng: ", gymLng);

          if (gymLat === undefined || gymLng === undefined) return false;

          const distance = getDistanceFromLatLonInKm(userLat, userLng, gymLat, gymLng);
          console.log("dis:", distance, "rad:", radiusKm);
          return distance <= radiusKm;
        });

        setFilteredGyms(filtered);
      },
      (error) => {
        console.error("Error getting location:", error);
        if (error.code === 1) {
          // Do nothing if location access is denied
        } else if (error.code === 2) {
          alert("Location unavailable. Please check your device location settings.");
        } else if (error.code === 3) {
          alert("Location request timed out. Please try again.");
        } else {
          alert("Failed to get your location. Please check your browser and device settings.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  return (
    <div className="browse-trainers-container">
      <h2 className="page-title">Find Your Perfect Gym</h2>

      <div className="advanced-search-container">
        <div className="advanced-search-bar">
          <span className="search-icon-wrapper">
            <FaLocationArrow className="search-icon" />
          </span>
          <input
            type="text"
            placeholder="Search by city, district, or gym name..."
            className="advanced-search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search gyms by location or name"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              type="button"
            >
              ×
            </button>
          )}
          {/* Suggestions dropdown (optional, can be improved with real suggestions) */}
          {searchQuery && filteredGyms.length > 0 && (
            <ul className="search-suggestions-list">
              {filteredGyms.slice(0, 5).map((gym) => (
                <li
                  key={gym._id}
                  className="search-suggestion-item"
                  onClick={() => setSearchQuery(gym.name)}
                >
                  <FaMapMarkerAlt className="suggestion-icon" /> {gym.name} — {gym.location?.city || "-"}
                </li>
              ))}
            </ul>
          )}
        </div>
        <select
          className="advanced-filter-rating"
          value={filterRating}
          onChange={handleFilterChange}
          aria-label="Filter gyms by rating"
        >
          <option value={0}>All Ratings</option>
          <option value={4}>4+ Stars</option>
          <option value={4.5}>4.5+ Stars</option>
          <option value={5}>5 Stars</option>
        </select>
        <button className="advanced-nearby-btn" onClick={handleFindNearbyGyms} aria-label="Find gyms near me">
          <FaMapMarkerAlt /> Nearby Gyms
        </button>
      </div>

      <div className="trainers-list">
        {filteredGyms.length === 0 ? (
          <div>No gyms available at your region.</div>
        ) : (
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
                        : `${process.env.REACT_APP_API_URL
                            ? process.env.REACT_APP_API_URL.replace(/\/$/, "")
                            : ""
                          }/${gym.images[0].replace(/^\//, "")}`
                      : "/placeholder.jpg"
                  }
                  alt={gym.name}
                  className="browsegyms-gym-image"
                />
                <div className="browsegyms-info-container">
                  <div className="browsegyms-info-row">
                    <div className="browsegyms-info-detail location">
                      <span className="browsegyms-info-label">Location:</span>
                      <span className="browsegyms-info-value">{gym.location?.city || "-"}</span>
                    </div>
                    <div className="browsegyms-info-detail rating">
                      <span className="browsegyms-info-label">Rating:</span>
                      <span className="browsegyms-info-value">{gym.avgRating ? `${gym.avgRating}★` : "No rating"}</span>
                    </div>
                  </div>
                  <div className="browsegyms-info-detail facilities-row">
                    <span className="browsegyms-info-label">Facilities:</span>
                    <div className="browsegyms-info-value facilities-list">
                      {(gym.amenities && gym.amenities.length > 0) ? (
                        gym.amenities.map((amenity, idx) => (
                          <span key={idx} className="browsegyms-offer-item badge">{amenity}</span>
                        ))
                      ) : (
                        <span className="browsegyms-offer-item">None listed</span>
                      )}
                    </div>
                  </div>
                </div>
                <Link to={`/gyms/${gym._id}`} className="browsegyms-details-link">
                  <button className="browsegyms-details-btn">
                    <FaChartLine /> View Full Details
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}

    </div>
  </div>
 );
};

export default BrowseGyms;
