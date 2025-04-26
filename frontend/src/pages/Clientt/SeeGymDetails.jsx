import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Styles/seeGymDetails.css";
import "./Styles/seeGymDetailsModal.css";
import "./Styles/successPopup.css";
import { useProfile } from "../../hooks/useProfile";
import { useAuthContext } from "../../hooks/useAuthContext";

const SeeGymDetails = () => {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
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

  useEffect(() => {
    if (gymId) {
      fetch(`/api/gym-reviews/${gymId}`)
        .then((res) => res.json())
        .then((data) => {
          setReviews(data);
          setLoadingReviews(false);
        })
        .catch(() => {
          setReviews([]);
          setLoadingReviews(false);
        });
    }
  }, [gymId]);

  const { user } = useAuthContext();
  const { getProfile } = useProfile();
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
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [clientStatus, setClientStatus] = useState({
    loading: true,
    registered: false,
    status: null,
  });

  useEffect(() => {
    // Fetch real user data for registration modal
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setRegisterForm((f) => ({
            ...f,
            fullName: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
          }));
        }
      } catch (e) {
        // fallback to mock or do nothing
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    // Fetch client registration status for this gym
    const fetchStatus = async () => {
      if (!user || !gymId) return;
      try {
        const res = await fetch(`/api/gymOwner/gyms/${gymId}/client-status`, {
          headers: {
            Authorization: user.token ? `Bearer ${user.token}` : "",
          },
        });
        const data = await res.json();
        setClientStatus({ loading: false, ...data });
      } catch (e) {
        setClientStatus({ loading: false, registered: false, status: null });
      }
    };
    fetchStatus();
  }, [user, gymId]);

  //this will lock the behind body when modal is open and when scrolling
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("seegymdetails-modal-open");
    } else {
      document.body.classList.remove("seegymdetails-modal-open");
    }
    return () => document.body.classList.remove("seegymdetails-modal-open");
  }, [showModal]);

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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    try {
      const res = await fetch(`/api/gymOwner/gyms/${gymId}/Clientregister`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
        body: JSON.stringify(registerForm),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus("Registration successful!");
        setShowModal(false); // Close the registration modal
        setShowSuccessPopup(true); // Show the success popup on the main page
      } else {
        setSubmitStatus(data.error || "Registration failed.");
      }
    } catch (err) {
      setSubmitStatus("Network error. Please try again.");
    }
  };

  if (loading) return <div className="seegymdetails-loading">Loading...</div>;
  if (error) return <div className="seegymdetails-error">{error}</div>;
  if (!gym) return <div className="seegymdetails-error">Gym not found.</div>;

  // --- Review Stats Calculation ---
  const totalReviews = reviews.length;
  const avgRating = totalReviews
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const categoryFields = [
    { key: "staff", label: "Staff" },
    { key: "facilities", label: "Facilities" },
    { key: "cleanliness", label: "Cleanliness" },
    { key: "comfort", label: "Comfort" },
    { key: "freeWifi", label: "Free Wifi" },
    { key: "valueForMoney", label: "Value for money" },
    { key: "location", label: "Location" },
  ];
  const categoryAverages = {};
  categoryFields.forEach(({ key }) => {
    categoryAverages[key] = totalReviews
      ? (
          reviews.reduce((sum, r) => sum + (r.categoryRatings?.[key] || 0), 0) /
          totalReviews
        ).toFixed(1)
      : 0;
  });

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
      {/* Reviews */}
      <div className="gymdetails-reviews-preview">
        <div
          className="gymdetails-reviews-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="gymdetails-reviews-title">Reviews</span>
          <a className="gymreview-readall" href={`/gyms/${gymId}/reviews`}>
            Read all reviews
          </a>
        </div>
        <div className="gymdetails-reviewstats-box">
          <span className="gymdetails-reviewstats-score">{avgRating}</span>
          <span className="gymdetails-reviewstats-status">
            {avgRating >= 7 ? "Good" : avgRating > 0 ? "Average" : "-"}
          </span>
          <span className="gymdetails-reviewstats-count">
            · {totalReviews} reviews
          </span>
        </div>
        <div className="gymdetails-reviewstats-categories">
          {categoryFields.map(({ key, label }) => (
            <div className="gymdetails-reviewstats-category" key={key}>
              <span>{label}</span>
              <div className="gymdetails-reviewstats-barwrap">
                <div
                  className="gymdetails-reviewstats-bar"
                  style={{
                    width: `${categoryAverages[key] * 10}%`,
                    background:
                      categoryAverages[key] >= 7 ? "#e53935" : "#b71c1c",
                  }}
                ></div>
              </div>
              <span className="gymdetails-reviewstats-catscore">
                {categoryAverages[key]}
              </span>
            </div>
          ))}
        </div>
        <div
          className="gymdetails-reviews-list"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginTop: "2.5rem",
          }}
        >
          {loadingReviews ? (
            <div>Loading...</div>
          ) : reviews.length === 0 ? (
            <div>No reviews yet</div>
          ) : (
            reviews.slice(0, 2).map((r) => (
              <div
                key={r._id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 10px rgba(31,38,135,0.08)",
                  padding: "1.2rem 1.5rem",
                  minWidth: 240,
                  maxWidth: 340,
                  flex: "1 1 240px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                  border: "1px solid #f2f2f2",
                  color: "#222",
                  opacity: 1,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#222",
                    marginBottom: 2,
                    opacity: 1,
                    background: "none",
                  }}
                >
                  {r.clientName || "Client"}
                </span>
                <span style={{ fontSize: "1.3rem", marginBottom: 4 }}>
                  {r.emoji || "🙂"}
                </span>
                <span
                  style={{
                    color: "#e53935",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    marginBottom: 2,
                  }}
                >
                  Rating: {r.rating || "-"}
                </span>
                <span
                  style={{
                    color: "#444",
                    fontSize: "1rem",
                    opacity: 1,
                    background: "none",
                  }}
                >
                  {r.content}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="seegymdetails-actions">
        {!clientStatus.loading &&
          user &&
          (clientStatus.registered ? (
            <div className="client-gym-status">
              {clientStatus.status === "active" && (
                <span
                  style={{
                    color: "#219653",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  ✅ You are currently an active member of this gym.
                </span>
              )}
              {clientStatus.status === "paused" && (
                <span
                  style={{
                    color: "#f2c94c",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  ⏸️ Your membership is paused. Contact the gym to reactivate.
                </span>
              )}
              {clientStatus.status === "inactive" && (
                <span
                  style={{
                    color: "#bdbdbd",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  ⚠️ Your membership is inactive. Contact the gym to renew.
                </span>
              )}
              {clientStatus.status === "completed" && (
                <span
                  style={{
                    color: "#1976d2",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  🏁 You have completed your program at this gym.
                </span>
              )}
              {clientStatus.status === "suspended" && (
                <span
                  style={{
                    color: "#eb5757",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  🚫 Your membership is suspended. Contact the gym for details.
                </span>
              )}
            </div>
          ) : (
            <button
              className="seegymdetails-register-btn"
              onClick={() => setShowModal(true)}
            >
              Join the Gym
            </button>
          ))}
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
            <form
              onSubmit={handleRegisterSubmit}
              className="seegymdetails-modal-form"
              autoComplete="off"
            >
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
              {submitStatus && (
                <div className="submit-status">{submitStatus}</div>
              )}
              <button type="submit" className="seegymdetails-modal-submit">
                Submit Registration
              </button>
            </form>
          </div>
        </div>
      )}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <h2>Registration Successful!</h2>
            <p>Your registration was submitted successfully.</p>
            <div className="success-popup-buttons">
              <button
                className="success-btn"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
              <button
                className="success-btn secondary"
                onClick={() => navigate("/")}
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeeGymDetails;
