import React, { useEffect, useState } from "react";
import "./Styles/seeGymDetailsModal.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Client } from '../../hooks/Client/useClientDetails';
import { useProfile } from "../../hooks/useProfile";


const Clientregister = () => {
  const { getProfile } = useProfile();
  const navigate = useNavigate();
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
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    address: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { registerClient, isLoading, error } = Client();


  useEffect(() => {
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
  console.log("handleRegisterSubmit called");
    e.preventDefault();
    // Validate age before submitting
    if (!registerForm.dob) {
      setSubmitStatus("Please enter your date of birth.");
      return;
    }
    const birth = new Date(registerForm.dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    if (!age || age <= 0) {
      setSubmitStatus("Please enter a valid date of birth.");
      return;
    }
    // Validate required fields
    if (!registerForm.address || registerForm.address.trim() === "") {
      setSubmitStatus("Please enter your address.");
      return;
    }
    const payload = {
      dob: registerForm.dob,
      age: age,
      gender: registerForm.gender,
      address: registerForm.address,
      medical: registerForm.medical ? registerForm.medical : "non",
      startDate: registerForm.startDate,
      emergencyName: registerForm.emergencyName,
      emergencyPhone: registerForm.emergencyPhone,
      emergencyRelation: registerForm.emergencyRelation,
      fitnessGoals: registerForm.fitnessGoals,
      fitnessLevel: registerForm.fitnessLevel,
      promoCode: registerForm.promoCode,
    };

    const success = await registerClient(payload);
    if (success) {
      setShowSuccessPopup(true);
    } else {
      setSubmitStatus(error ? error : "Registration failed. Please check your inputs.");
    }
  };


  return (
    <div className="seegymdetails-container">
      <div className="seegymdetails-modal-overlay">
        <div className="seegymdetails-modal">

          <div className="seegymdetails-modal-title">
            Client Certification Registration
          </div>
          <form
            onSubmit={(e) => { console.log('form submitted'); handleRegisterSubmit(e); }}
            className="seegymdetails-modal-form"
            autoComplete="off"
          >
            {/* Full Name */}
            <div className="seegymdetails-modal-section">
              <label className="seegymdetails-modal-label">Full Name 🧑</label>
              <input
                type="text"
                className="seegymdetails-modal-input"
                name="fullName"
                value={registerForm.fullName}
                readOnly
              />
            </div>
            {/* Email Address */}
            <div className="seegymdetails-modal-section">
              <label className="seegymdetails-modal-label">Email Address 📧</label>
              <input
                type="email"
                className="seegymdetails-modal-input"
                name="email"
                value={registerForm.email}
                readOnly
              />
            </div>
            {/* Phone Number */}
            <div className="seegymdetails-modal-section">
              <label className="seegymdetails-modal-label">Phone Number 📞</label>
              <input
                type="tel"
                className="seegymdetails-modal-input"
                name="phone"
                value={registerForm.phone}
                onChange={handleInputChange}
              />
            </div>
            {/* Address */}
            <div className="seegymdetails-modal-section">
              <label className="seegymdetails-modal-label">Address 🏠</label>
              <input
                type="text"
                className="seegymdetails-modal-input"
                name="address"
                value={registerForm.address}
                onChange={handleInputChange}
                placeholder="Your home address"
              />
            </div>
            {/* Date of Birth */}
            <div className="seegymdetails-modal-section">
              <label className="seegymdetails-modal-label">Date of Birth 🎂</label>
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
            {/* Gender */}
            <div className="seegymdetails-modal-section">
              <label className="seegymdetails-modal-label">Gender ⚧️</label>
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

            <div className="seegymdetails-modal-section">
              <label className="seegymdetails-modal-label">
                Fitness Goals 🎯
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
                Medical Conditions / Injuries 🏥
              </label>
              <input
                type="text"
                className="seegymdetails-modal-input"
                name="medical"
                value={registerForm.medical}
                onChange={handleInputChange}
                placeholder="if any"
              />
            </div>
            <div className="seegymdetails-modal-section">
              <label className="seegymdetails-modal-label">
                Current Fitness Level 🏋️
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
                    Start Date 📅
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
                    Promo Code 🎟️
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
                Emergency Contact 🚨 <span style={{ color: "#aaa", fontWeight: 400 }}>
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
                    placeholder="Name 🧑"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    className="seegymdetails-modal-input"
                    name="emergencyPhone"
                    value={registerForm.emergencyPhone}
                    onChange={handleInputChange}
                    placeholder="Phone Number 📞"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="seegymdetails-modal-input"
                    name="emergencyRelation"
                    value={registerForm.emergencyRelation}
                    onChange={handleInputChange}
                    placeholder="Relationship 🤝"
                  />
                </div>
              </div>
            </div>
            {submitStatus && (
              <div className="submit-status" style={{ color: 'red', marginTop: '10px' }}>{submitStatus}</div>
            )}
            <button type="submit" className="seegymdetails-modal-submit">
              {isLoading ? "Submitting" : "Submit Registration"}
            </button>
          </form>
        </div>
      </div>
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <h2>Registration Successful!</h2>
            <p>Your registration was submitted successfully.</p>
            <div className="success-popup-buttons">
              <button
                className="success-btn"
                onClick={() => navigate("/client-dashboard")}
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

export default Clientregister;
