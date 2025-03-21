import React, { useState } from "react";
import "../styles/trainereditprofile/trainereditprofile.css";

const TrainerEditProfile = () => {
  const [trainerDetails, setTrainerDetails] = useState({
    name: "John Doe",
    phone: "123-456-7890",
    email: "johndoe@example.com",
    location: "New York, USA",
    bio: "",
  });

  const [certifications, setCertifications] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrainerDetails({ ...trainerDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setCertifications([...certifications, ...imageUrls]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", trainerDetails);
    console.log("Uploaded Certifications:", certifications);
  };

  return (
    <div className="edit-profile">
      <h1 className="edit-profile-title">Edit Your Profile</h1>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={trainerDetails.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={trainerDetails.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={trainerDetails.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={trainerDetails.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Years of Experience:</label>
          <input type="number" placeholder="Enter your years of experience" />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={trainerDetails.bio}
            onChange={handleInputChange}
            rows="4"
            required
          ></textarea>
        </div>

        {/* Certifications Section */}
        <div className="form-group">
          <label htmlFor="certifications">Certifications (Upload Images)</label>
          <input
            type="file"
            id="certifications"
            name="certifications"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <div className="certification-preview">
            {certifications.map((image, index) => (
              <img key={index} src={image} alt={`Certification ${index + 1}`} />
            ))}
          </div>
        </div>

        <div className="form-group">
          <button type="submit" className="submit-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainerEditProfile;
