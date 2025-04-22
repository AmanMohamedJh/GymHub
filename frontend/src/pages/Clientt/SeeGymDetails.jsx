import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Styles/seeGymDetails.css";

const SeeGymDetails = () => {
  const { gymId } = useParams();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equipment, setEquipment] = useState([]);
  // Mock data for announcements and reviews
  const [announcements] = useState([
    { id: 1, text: "New Yoga classes every Monday!" },
    { id: 2, text: "20% off for students this month!" },
  ]);
  const [reviews] = useState([
    { id: 1, user: "Alice", rating: 5, comment: "Amazing gym, great staff!" },
    { id: 2, user: "Bob", rating: 4, comment: "Good equipment, clean space." },
  ]);

  const [slideIndex, setSlideIndex] = useState(0);
  const nextSlide = () =>
    setSlideIndex((prev) =>
      gym.images && gym.images.length > 0 ? (prev + 1) % gym.images.length : 0
    );
  const prevSlide = () =>
    setSlideIndex((prev) =>
      gym.images && gym.images.length > 0
        ? (prev - 1 + gym.images.length) % gym.images.length
        : 0
    );

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const res = await fetch(`/api/gym/public/${gymId}`);
        if (!res.ok) throw new Error("Failed to fetch gym details");
        const data = await res.json();
        setGym(data);
        // Fetch equipment for this gym from the new public endpoint
        const eqRes = await fetch(`/api/equipment/public/gym/${gymId}`);
        if (eqRes.ok) {
          const eqData = await eqRes.json();
          setEquipment(eqData);
          console.log("Fetched equipment:", eqData);
        } else {
          console.error("Equipment fetch failed:", eqRes.status);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error in fetchGym:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGym();
  }, [gymId]);

  if (loading) return <div className="seegymdetails-loading">Loading...</div>;
  if (error) return <div className="seegymdetails-error">{error}</div>;
  if (!gym) return <div className="seegymdetails-error">Gym not found.</div>;

  return (
    <div className="seegymdetails-container">
      <div className="seegymdetails-header-glass">
        <h1 className="seegymdetails-title">{gym.name}</h1>
        <span className="seegymdetails-city">{gym.location?.city}</span>
        <p
          className="seegymdetails-description-blurb"
          style={{ color: "#222" }}
        >
          {gym.notes?.slice(0, 120) || "Discover the best gym experience!"}
        </p>
      </div>
      <div className="seegymdetails-main">
        <div className="seegymdetails-imagebox">
          {/* Slideshow for images */}
          {Array.isArray(gym.images) && gym.images.length > 1 ? (
            <div
              className="seegymdetails-slideshow"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 370,
                height: 240,
              }}
            >
              <button
                className="seegymdetails-slide-btn left"
                onClick={prevSlide}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  zIndex: 2,
                  background: "#fff",
                  border: "1px solid #1976d2",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  transform: "translateY(-50%)",
                  color: "#1976d2",
                  fontWeight: 700,
                }}
              >
                ‹
              </button>
              {gym.images.map((img, idx) => (
                <img
                  key={idx}
                  src={
                    img.startsWith("http")
                      ? img
                      : `${
                          process.env.REACT_APP_API_URL
                            ? process.env.REACT_APP_API_URL.replace(/\/$/, "")
                            : ""
                        }/${img.replace(/^\//, "")}`
                  }
                  alt={`slide-${idx}`}
                  className="seegymdetails-slide-img"
                  style={{
                    display: idx === slideIndex ? "block" : "none",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: 240,
                    objectFit: "cover",
                    borderRadius: 12,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  }}
                />
              ))}
              <button
                className="seegymdetails-slide-btn right"
                onClick={nextSlide}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  zIndex: 2,
                  background: "#fff",
                  border: "1px solid #1976d2",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  transform: "translateY(-50%)",
                  color: "#1976d2",
                  fontWeight: 700,
                }}
              >
                ›
              </button>
            </div>
          ) : (
            <img
              src={
                gym.images && gym.images.length > 0
                  ? gym.images[0].startsWith("http")
                    ? gym.images[0]
                    : `${
                        process.env.REACT_APP_API_URL
                          ? process.env.REACT_APP_API_URL.replace(/\/$/, "")
                          : ""
                      }/${gym.images[0].replace(/^\//, "")}`
                  : "/placeholder.jpg"
              }
              alt={gym.name}
              className="seegymdetails-image"
              style={{
                width: "100%",
                maxWidth: 370,
                height: 240,
                objectFit: "cover",
                borderRadius: 12,
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              }}
            />
          )}
        </div>
        <div className="seegymdetails-info">
          <div className="seegymdetails-section">
            <h3 style={{ color: "#222" }}>Description</h3>
            <p style={{ color: "#222" }}>
              {gym.notes || "No description provided."}
            </p>
          </div>
          <div className="seegymdetails-section">
            <h3 style={{ color: "#222" }}>Amenities</h3>
            <div className="seegymdetails-amenities">
              {(gym.amenities || []).map((a, i) => (
                <span
                  key={i}
                  className="seegymdetails-amenity-item"
                  style={{ color: "#1976d2" }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
          <div className="seegymdetails-section">
            <h3 style={{ color: "#222" }}>Operating Hours</h3>
            <ul className="seegymdetails-hours">
              {gym.operatingHours &&
                Object.entries(gym.operatingHours).map(([day, hours]) => (
                  <li key={day}>
                    <b style={{ color: "#1976d2" }}>{day}:</b>{" "}
                    <span style={{ color: "#333" }}>{hours}</span>
                  </li>
                ))}
            </ul>
          </div>
          <div className="seegymdetails-section">
            <h3 style={{ color: "#222" }}>Gender Access</h3>
            <span style={{ color: "#1976d2", fontWeight: 500 }}>
              {gym.genderAccess || "Unspecified"}
            </span>
          </div>
          <div className="seegymdetails-section">
            <h3 style={{ color: "#222" }}>Equipment</h3>
            <ul className="seegymdetails-equipment-list">
              {Array.isArray(equipment) && equipment.length > 0 ? (
                equipment.map((eq) => (
                  <li
                    key={eq._id || eq.name}
                    className="seegymdetails-equipment-item"
                    style={{ color: "#333" }}
                  >
                    <b>{eq.name}</b> <span>({eq.condition})</span>{" "}
                    {eq.notes && <span>- {eq.notes}</span>}
                  </li>
                ))
              ) : (
                <li style={{ color: "#aaa" }}>No equipment listed.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {/* Map Section */}
      {gym.location &&
      Array.isArray(gym.location.coordinates) &&
      gym.location.coordinates.length === 2 &&
      typeof gym.location.coordinates[0] === "number" &&
      typeof gym.location.coordinates[1] === "number" &&
      !isNaN(gym.location.coordinates[0]) &&
      !isNaN(gym.location.coordinates[1]) ? (
        <div className="seegymdetails-map-section">
          <h3 style={{ color: "#222" }}>Location Map</h3>
          <MapContainer
            center={[gym.location.coordinates[1], gym.location.coordinates[0]]}
            zoom={15}
            scrollWheelZoom={false}
            style={{
              height: "250px",
              width: "100%",
              borderRadius: "12px",
              marginBottom: "1rem",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[
                gym.location.coordinates[1],
                gym.location.coordinates[0],
              ]}
            >
              <Popup>{gym.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : null}
      {/* Announcements */}
      <div className="seegymdetails-announcements-section">
        <h3 style={{ color: "#222" }}>Announcements</h3>
        <ul>
          {announcements.map((a) => (
            <li key={a.id} className="seegymdetails-announcement">
              {a.text}
            </li>
          ))}
        </ul>
      </div>
      {/* Reviews */}
      <div className="seegymdetails-reviews-section">
        <h3 style={{ color: "#222" }}>Feedbacks</h3>
        <ul>
          {reviews.map((r) => (
            <li key={r.id} className="seegymdetails-review">
              <b>{r.user}</b>{" "}
              <span className="seegymdetails-review-rating">
                {"★".repeat(r.rating)}
              </span>
              : {r.comment}
            </li>
          ))}
        </ul>
      </div>
      <div className="seegymdetails-actions">
        <button className="seegymdetails-register-btn">
          Register for this Gym
        </button>
      </div>
    </div>
  );
};

export default SeeGymDetails;
