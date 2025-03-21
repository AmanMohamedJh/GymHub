import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Trainer/Styles/trainerRegistration.css';

const TrainerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    location: '',
    trainerType: '',
    experience: '',
    certificate: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      certificate: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    navigate('/trainer/dashboard');
  };

  return (
    <div className="trainer-registration-container">
      <div className="registration-form-wrapper">
        <h2>Trainer Registration</h2>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Trainer Type</label>
            <select
              name="trainerType"
              value={formData.trainerType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Type</option>
              <option value="yoga">Yoga Instructor</option>
              <option value="bodybuilding">Bodybuilding Coach</option>
              <option value="generalFitness">General Fitness Trainer</option>
              <option value="personal">Personal Trainer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Certificate</label>
            <input
              type="file"
              name="certificate"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="file-input"
            />
          </div>

          <button type="submit" className="submit-btn">Submit Registration</button>
        </form>
      </div>
    </div>
  );
};

export default TrainerRegistration;
