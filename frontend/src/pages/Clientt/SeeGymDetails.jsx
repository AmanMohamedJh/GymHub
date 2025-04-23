import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Styles/seeGymDetails.css";
import "./Styles/seeGymDetailsModal.css";

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
  // Reset slideIndex when images array changes
  useEffect(() => {
    setSlideIndex(0);
  }, [gym?.images?.length]);

  const nextSlide = () => {
    if (Array.isArray(gym.images) && gym.images.length > 1) {
      setSlideIndex((prev) => (prev + 1) % gym.images.length);
    }
  };
  const prevSlide = () => {
    if (Array.isArray(gym.images) && gym.images.length > 1) {
      setSlideIndex(
        (prev) => (prev - 1 + gym.images.length) % gym.images.length
      );
    }
  };

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

  const [showModal, setShowModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    age: "",
    gender: "",
    fitnessGoals: "",
    medical: "",
    fitnessLevel: "",
    startDate: "",
    promoCode: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  //this will lock the behind body when modal is open and when scrolling
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("seegymdetails-modal-open");
    } else {
      document.body.classList.remove("seegymdetails-modal-open");
    }
    return () => document.body.classList.remove("seegymdetails-modal-open");
  }, [showModal]);

  useEffect(() => {
    // Mock user data
    const user = {
      fullName: "John Wick",
      email: "johnwick@email.com",
      phone: "0123456789",
    };
    setRegisterForm((f) => ({
      ...f,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((f) => ({ ...f, [name]: value }));
    if (name === "dob") {
      // Calculate age
      const birth = new Date(value);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
      setRegisterForm((f) => ({ ...f, age: age > 0 ? age : "" }));
    }
  };

  if (loading) return <div className="seegymdetails-loading">Loading...</div>;
  if (error) return <div className="seegymdetails-error">{error}</div>;
  if (!gym) return <div className="seegymdetails-error">Gym not found.</div>;

  return (
    <div className="seegymdetails-container">
      <div className="seegymdetails-header-glass">
        <h1 className="seegymdetails-title">{gym.name}</h1>
        <span className="seegymdetails-city">{gym.location?.city}</span>
        <p className="seegymdetails-description-blurb">
          {gym.notes?.slice(0, 120) || "Discover the best gym experience!"}
        </p>
      </div>
      <div className="seegymdetails-main">
        <div className="seegymdetails-imagebox">
          {/* Slideshow for images */}
          {Array.isArray(gym.images) && gym.images.length > 0 ? (
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
              src={"/placeholder.jpg"}
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
            <h3>Description</h3>
            <p>{gym.notes || "No description provided."}</p>
          </div>
          <div className="seegymdetails-section">
            <h3>Amenities</h3>
            <div className="seegymdetails-amenities">
              {(gym.amenities || []).map((a, i) => (
                <span key={i} className="seegymdetails-amenity-item">
                  {a}
                </span>
              ))}
            </div>
          </div>
          <div className="seegymdetails-section">
            <h3>Operating Hours</h3>
            <ul className="seegymdetails-hours">
              {gym.operatingHours &&
                Object.entries(gym.operatingHours).map(([day, hours]) => (
                  <li key={day}>
                    <b>{day}:</b> <span>{hours}</span>
                  </li>
                ))}
            </ul>
          </div>
          <div className="seegymdetails-section">
            <h3>Gender Access</h3>
            <span>{gym.genderAccess || "Unspecified"}</span>
          </div>
          <div className="seegymdetails-section">
            <h3>Equipment</h3>
            <ul className="seegymdetails-equipment-list">
              {Array.isArray(equipment) && equipment.length > 0 ? (
                equipment.map((eq) => (
                  <li
                    key={eq._id || eq.name}
                    className="seegymdetails-equipment-item"
                  >
                    <b>{eq.name}</b> <span>({eq.condition})</span>{" "}
                    {eq.notes && <span>- {eq.notes}</span>}
                  </li>
                ))
              ) : (
                <li>No equipment listed.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {/* Map Section */}
      {(() => {
        const lat = gym.location?.coordinates?.lat;
        const lng = gym.location?.coordinates?.lng;
        if (
          typeof lat === "number" &&
          typeof lng === "number" &&
          !isNaN(lat) &&
          !isNaN(lng)
        ) {
          return (
            <div className="seegymdetails-map-section">
              <h3>Location Map</h3>
              <MapContainer
                center={[lat, lng]}
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
                <Marker position={[lat, lng]}>
                  <Popup>{gym.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          );
        }
        return null;
      })()}
      {/* Announcements */}
      <div className="seegymdetails-announcements-section">
        <h3>Announcements</h3>
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
        <h3>Feedbacks</h3>
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
        <button
          className="seegymdetails-register-btn"
          onClick={() => setShowModal(true)}
        >
          Join the Gym
        </button>
      </div>
      {showModal && (
        <div className="seegymdetails-modal-overlay">
          <div className="seegymdetails-modal">
            <button
              className="seegymdetails-modal-close"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <div className="seegymdetails-modal-title">
              Register for this Gym
            </div>
            <form className="seegymdetails-modal-form" autoComplete="off">
              <div className="seegymdetails-modal-section">
                <div className="seegymdetails-modal-row">
                  <div>
                    <label className="seegymdetails-modal-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="seegymdetails-modal-input"
                      name="fullName"
                      value={registerForm.fullName}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="seegymdetails-modal-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="seegymdetails-modal-input"
                      name="email"
                      value={registerForm.email}
                      readOnly
                    />
                  </div>
                </div>
                <div className="seegymdetails-modal-row">
                  <div>
                    <label className="seegymdetails-modal-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="seegymdetails-modal-input"
                      name="phone"
                      value={registerForm.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="seegymdetails-modal-label">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="seegymdetails-modal-input"
                      name="dob"
                      value={registerForm.dob}
                      onChange={handleInputChange}
                    />
                    {registerForm.age && (
                      <small style={{ color: "#1976d2", fontWeight: 500 }}>
                        Age: {registerForm.age}
                      </small>
                    )}
                  </div>
                  <div>
                    <label className="seegymdetails-modal-label">Gender</label>
                    <select
                      className="seegymdetails-modal-select"
                      name="gender"
                      value={registerForm.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="seegymdetails-modal-section">
                <label className="seegymdetails-modal-label">
                  Fitness Goals
                </label>
                <input
                  type="text"
                  className="seegymdetails-modal-input"
                  name="fitnessGoals"
                  value={registerForm.fitnessGoals}
                  onChange={handleInputChange}
                  placeholder="e.g. Weight Loss, Muscle Gain, General Fitness"
                />
              </div>
              <div className="seegymdetails-modal-section">
                <label className="seegymdetails-modal-label">
                  Medical Conditions / Injuries
                </label>
                <input
                  type="text"
                  className="seegymdetails-modal-input"
                  name="medical"
                  value={registerForm.medical}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>
              <div className="seegymdetails-modal-section">
                <label className="seegymdetails-modal-label">
                  Current Fitness Level
                </label>
                <select
                  className="seegymdetails-modal-select"
                  name="fitnessLevel"
                  value={registerForm.fitnessLevel}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="seegymdetails-modal-section">
                <div className="seegymdetails-modal-row">
                  <div>
                    <label className="seegymdetails-modal-label">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="seegymdetails-modal-input"
                      name="startDate"
                      value={registerForm.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="seegymdetails-modal-label">
                      Promo Code
                    </label>
                    <input
                      type="text"
                      className="seegymdetails-modal-input"
                      name="promoCode"
                      value={registerForm.promoCode}
                      onChange={handleInputChange}
                      placeholder="Enter if you have one"
                    />
                  </div>
                </div>
              </div>
              <div className="seegymdetails-modal-section">
                <label className="seegymdetails-modal-label">
                  Emergency Contact{" "}
                  <span style={{ color: "#aaa", fontWeight: 400 }}>
                    (optional)
                  </span>
                </label>
                <div className="seegymdetails-modal-row">
                  <div>
                    <input
                      type="text"
                      className="seegymdetails-modal-input"
                      name="emergencyName"
                      value={registerForm.emergencyName}
                      onChange={handleInputChange}
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      className="seegymdetails-modal-input"
                      name="emergencyPhone"
                      value={registerForm.emergencyPhone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="seegymdetails-modal-input"
                      name="emergencyRelation"
                      value={registerForm.emergencyRelation}
                      onChange={handleInputChange}
                      placeholder="Relationship"
                    />
                  </div>
                </div>
              </div>
              <button type="button" className="seegymdetails-modal-submit">
                Submit Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeeGymDetails;
