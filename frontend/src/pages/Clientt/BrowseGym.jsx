
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

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by Location..."
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
        <button className="browsegyms-details-btn" onClick={handleFindNearbyGyms}>
          <FaMapMarkerAlt /> Nearby Gyms
        </button>
      </div>

      <div className="trainers-list">
        {filteredGyms.length === 0 ? (
          <p>No gyms available at your region.</p>
        ) : (
          filteredGyms.map((gym) => (
            <div key={gym._id} className="trainer-card">
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
              </div>
              <p>Location: <FaMapMarkerAlt /> {gym.location?.city || "-"}</p>
              <p>Rating: {gym.avgRating ? gym.avgRating : "No rating"}★</p>
              <p>Facilities:
                {(gym.amenities || []).map((amenity, idx) => (
                  <span key={idx} className="browsegyms-offer-item">
                    {amenity}
                  </span>
                ))}
              </p>

              <Link to={`/gyms/${gym._id}`} style={{ textDecoration: "none" }}>
                <button className="browsegyms-details-btn">
                  <FaChartLine /> View Full Details
                </button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseGyms;
