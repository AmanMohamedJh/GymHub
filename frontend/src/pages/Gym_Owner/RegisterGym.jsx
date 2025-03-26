import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { useSubscription } from "../../context/Subscription/SubscriptionContext";
import "./Styles/RegisterGym.css";

const RegisterGym = () => {
  const navigate = useNavigate();
  const { subscription } = useSubscription();
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: {
      address: "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
      placeId: "",
      url: "", // Google Maps URL
    },
    images: [],
    amenities: [],
    hours: {
      weekdays: "",
      weekends: "",
    },
    allowedGenders: "Both",
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

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    // Initialize map centered on a default location (e.g., Sri Lanka)
    const defaultLocation = { lat: 7.8731, lng: 80.7718 };
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 8,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    // Initialize search box
    const searchBox = new window.google.maps.places.SearchBox(
      searchBoxRef.current
    );
    mapInstance.controls[window.google.maps.ControlPosition.TOP_CENTER].push(
      searchBoxRef.current
    );

    // Create marker
    const markerInstance = new window.google.maps.Marker({
      map: mapInstance,
      draggable: true,
    });

    // Listen for search box changes
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      // Update map and marker
      mapInstance.setCenter(place.geometry.location);
      mapInstance.setZoom(15);
      markerInstance.setPosition(place.geometry.location);

      // Update form data
      updateLocationData(place);
    });

    // Listen for marker drag events
    markerInstance.addListener("dragend", () => {
      const position = markerInstance.getPosition();
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: position }, (results, status) => {
        if (status === "OK" && results[0]) {
          updateLocationData(results[0]);
        }
      });
    });

    setMap(mapInstance);
    setMarker(markerInstance);
  };

  const updateLocationData = (place) => {
    const location = {
      address: place.formatted_address,
      coordinates: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
      placeId: place.place_id,
      url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    };

    setFormData((prev) => ({
      ...prev,
      location,
    }));
  };

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
              <label>Location *</label>
              <div className="location-search-container">
                <div className="search-box-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    ref={searchBoxRef}
                    type="text"
                    placeholder="Search for your gym location..."
                    className="location-search-input"
                  />
                </div>
                <div className="map-container" ref={mapRef}></div>
                {formData.location.address && (
                  <div className="location-details">
                    <p className="formatted-address">
                      <FaMapMarkerAlt /> {formData.location.address}
                    </p>
                    <a
                      href={formData.location.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-on-maps"
                    >
                      View on Google Maps
                    </a>
                  </div>
                )}
              </div>
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
              <div
                className="equipment-input-group"
                style={{ justifyContent: "center" }}
              >
                <button
                  type="button"
                  className="add-equipment-button"
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

          {/* Certificate Upload */}
          <div className="form-section">
            <h3>Gym Registration Certificate</h3>
            <div className="form-group">
              <p className="certificate-info">
                Please upload your official gym registration certificate. This
                document helps verify your gym's legal status and compliance
                with local regulations.
              </p>
              <div className="certificate-upload-container">
                <label className="certificate-upload-button">
                  <FaUpload /> Upload Certificate
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData((prev) => ({
                          ...prev,
                          certificate: file,
                        }));
                      }
                    }}
                    style={{ display: "none" }}
                  />
                </label>
                {formData.certificate && (
                  <div className="certificate-preview">
                    <span>{formData.certificate.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, certificate: null }))
                      }
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>
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
