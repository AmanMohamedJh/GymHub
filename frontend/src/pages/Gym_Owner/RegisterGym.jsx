import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa";
import { useSubscription } from "../../context/Subscription/SubscriptionContext";
import "./Styles/RegisterGym.css";

const RegisterGym = () => {
  const navigate = useNavigate();
  const { subscription } = useSubscription();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    images: [],
    amenities: [],
    hours: {
      weekdays: "",
      weekends: "",
    },
    allowedGenders: "Both",
    pricing: {
      monthly: "",
      yearly: "",
    },
    equipment: [],
    notes: "",
  });

  const [imagePreview, setImagePreview] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [equipmentInput, setEquipmentInput] = useState({
    name: "",
    quantity: "",
    condition: "Good",
  });

  useEffect(() => {
    // Check subscription status
    if (!subscription || subscription.status !== "Active") {
      navigate("/subscription");
    }
  }, [subscription, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview((prev) => [...prev, ...previews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleAmenityAdd = () => {
    if (amenityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput("");
    }
  };

  const removeAmenity = (index) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    navigate("/owner-dashboard");
  };

  return (
    <div className="register-gym-container">
      <div className="register-gym-form">
        <div className="form-header">
          <h2>Register Your Gym</h2>
          <p>Fill in the details below to register your gym</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label htmlFor="name">Gym Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            {/* Gym Images */}
            <div className="form-group">
              <label>Gym Images *</label>
              <div className="image-upload-container">
                <label className="image-upload-button">
                  <FaUpload /> Upload Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </label>
                <div className="image-previews">
                  {imagePreview.map((url, index) => (
                    <img key={index} src={url} alt={`Preview ${index + 1}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="form-section">
            <h3>Operating Hours</h3>
            <div className="form-group">
              <label htmlFor="hours.weekdays">Weekdays *</label>
              <input
                type="text"
                id="hours.weekdays"
                name="hours.weekdays"
                value={formData.hours.weekdays}
                onChange={handleChange}
                placeholder="e.g., 6:00 AM - 11:00 PM"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hours.weekends">Weekends *</label>
              <input
                type="text"
                id="hours.weekends"
                name="hours.weekends"
                value={formData.hours.weekends}
                onChange={handleChange}
                placeholder="e.g., 7:00 AM - 9:00 PM"
                required
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="form-section">
            <h3>Amenities</h3>
            <div className="form-group">
              <div className="amenity-input-group">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  placeholder="Add amenity (e.g., Swimming Pool)"
                />
                <button type="button" onClick={handleAmenityAdd}>
                  Add
                </button>
              </div>
              <div className="amenities-list">
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-tag">
                    {amenity}
                    <button type="button" onClick={() => removeAmenity(index)}>
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Equipment Management */}
          <div className="form-section">
            <h3>Equipment Management</h3>
            <div className="form-group">
              <div className="equipment-input-group">
                <input
                  type="text"
                  value={equipmentInput.name}
                  onChange={(e) =>
                    setEquipmentInput((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Equipment name"
                />
                <input
                  type="number"
                  value={equipmentInput.quantity}
                  onChange={(e) =>
                    setEquipmentInput((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                  placeholder="Quantity"
                  min="1"
                />
                <select
                  value={equipmentInput.condition}
                  onChange={(e) =>
                    setEquipmentInput((prev) => ({
                      ...prev,
                      condition: e.target.value,
                    }))
                  }
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (equipmentInput.name && equipmentInput.quantity) {
                      setFormData((prev) => ({
                        ...prev,
                        equipment: [...prev.equipment, { ...equipmentInput }],
                      }));
                      setEquipmentInput({
                        name: "",
                        quantity: "",
                        condition: "Good",
                      });
                    }
                  }}
                >
                  Add Equipment
                </button>
              </div>
              <div className="equipment-list">
                <table>
                  <thead>
                    <tr>
                      <th>Equipment</th>
                      <th>Quantity</th>
                      <th>Condition</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.equipment.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.condition}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                equipment: prev.equipment.filter(
                                  (_, i) => i !== index
                                ),
                              }));
                            }}
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Membership Pricing */}
          <div className="form-section">
            <h3>Membership Pricing</h3>
            <div className="form-group">
              <label htmlFor="pricing.monthly">Monthly Fee (Rs) *</label>
              <input
                type="number"
                id="pricing.monthly"
                name="pricing.monthly"
                value={formData.pricing.monthly}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pricing.yearly">Yearly Fee (Rs) *</label>
              <input
                type="number"
                id="pricing.yearly"
                name="pricing.yearly"
                value={formData.pricing.yearly}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Gender Access */}
          <div className="form-section">
            <h3>Gender Access</h3>
            <div className="form-group">
              <label htmlFor="allowedGenders">Allowed Genders *</label>
              <select
                id="allowedGenders"
                name="allowedGenders"
                value={formData.allowedGenders}
                onChange={handleChange}
                required
              >
                <option value="Both">Both</option>
                <option value="Male">Male Only</option>
                <option value="Female">Female Only</option>
              </select>
            </div>
          </div>

          {/* Notes & Contact Details */}
          <div className="form-section">
            <h3>Notes & Contact Details</h3>
            <div className="form-group">
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Enter any additional notes or contact details for your gym..."
              />
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/owner-dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Register Gym
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterGym;
