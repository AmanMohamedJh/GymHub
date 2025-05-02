import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
  FaImage,
  FaAd,
  FaSearch,
  FaCheck,
  FaTimes,
  FaDumbbell,
} from "react-icons/fa";
import "./Styles/AdManager.css";

const AdManager = () => {
  // ...existing state
  // Handler to update ad clicks in state
  const handleAdClickUpdate = (adId, updatedAd) => {
    setAds(prevAds => prevAds.map(ad => (ad._id === adId ? { ...ad, clicks: updatedAd.clicks } : ad)));
  }
  const { user } = useAuthContext();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdForm, setShowAdForm] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userGyms, setUserGyms] = useState([]);
  const [loadingGyms, setLoadingGyms] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    imagePreview: null,
    adType: "popup",
    targetLocation: "",
    targetAgeGroup: "all",
    targetInterests: [],
    startDate: "",
    endDate: "",
    gymId: "",
  });

  // Fetch owner's approved gyms
  useEffect(() => {
    if (user?.token) {
      setLoadingGyms(true);
      
      // Fetch approved gyms from the backend API
      fetch("http://localhost:4000/api/equipment/owner-gyms", {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setUserGyms(data);
        setLoadingGyms(false);
      })
      .catch(err => {
        console.error("Error fetching gyms:", err);
        setError("Failed to load your approved gyms. Please try again later.");
        setLoadingGyms(false);
      });
    }
  }, [user?.token]);

  // Fetch ads from the backend
  useEffect(() => {
    if (user?.token) {
      setLoading(true);
      setError(null);
      
      fetch('http://localhost:4000/api/gym-ads', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched ads:', data);
        setAds(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching ads:', err);
        setError('Failed to load advertisements. Please try again later.');
        setLoading(false);
      });
    }
  }, [user?.token]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  // Handle interests selection
  const handleInterestChange = (interest) => {
    const updatedInterests = formData.targetInterests.includes(interest)
      ? formData.targetInterests.filter((item) => item !== interest)
      : [...formData.targetInterests, interest];

    setFormData({
      ...formData,
      targetInterests: updatedInterests,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Validate form data
      if (!formData.title || !formData.description || !formData.gymId || !formData.startDate || !formData.endDate) {
        throw new Error('Please fill in all required fields');
      }
      
      // Only require image for new ads, not for edits
      const isNewAd = !currentAd;
      if (isNewAd && !formData.image) {
        throw new Error('Please upload an advertisement image');
      }
      
      // Don't allow image updates in edit mode
      if (!isNewAd && formData.image) {
        throw new Error('Image editing is not supported. Please cancel and create a new ad if you need to change the image.');
      }
      
      // Create a FormData object to handle file upload
      const adFormData = new FormData();
      adFormData.append('title', formData.title);
      adFormData.append('description', formData.description);
      adFormData.append('adType', formData.adType);
      adFormData.append('targetLocation', formData.targetLocation || '');
      adFormData.append('targetAgeGroup', formData.targetAgeGroup || 'all');
      adFormData.append('startDate', formData.startDate);
      adFormData.append('endDate', formData.endDate);
      adFormData.append('gymId', formData.gymId);
      
      // Handle target interests array
      if (formData.targetInterests && formData.targetInterests.length > 0) {
        formData.targetInterests.forEach(interest => {
          adFormData.append('targetInterests', interest);
        });
      }
      
      // Append the image file only if a new image was selected
      if (formData.image) {
        adFormData.append('adImage', formData.image);
      }
      
      console.log("Submitting ad data to API...");
      console.log("Form data values:", {
        title: formData.title,
        description: formData.description,
        adType: formData.adType,
        targetLocation: formData.targetLocation,
        targetAgeGroup: formData.targetAgeGroup,
        startDate: formData.startDate,
        endDate: formData.endDate,
        gymId: formData.gymId,
        targetInterests: formData.targetInterests,
        imageFile: formData.image ? formData.image.name : 'Using existing image'
      });
      
      // Determine if this is a create or update operation
      const url = currentAd 
        ? `http://localhost:4000/api/gym-ads/${currentAd._id || currentAd.id}` 
        : 'http://localhost:4000/api/gym-ads';
      
      const method = currentAd ? 'PATCH' : 'POST';
      
      // Make the API call to save or update the ad
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        body: adFormData
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || `Failed to ${currentAd ? 'update' : 'create'} advertisement`);
      }
      
      console.log(`Advertisement ${currentAd ? 'updated' : 'created'} successfully:`, responseData);
      
      if (currentAd) {
        // Update the existing ad in the list
        setAds(ads.map(ad => (ad._id || ad.id) === (currentAd._id || currentAd.id) ? responseData : ad));
      } else {
        // Add the new ad to the list
        setAds([responseData, ...ads]);
      }
      
      resetForm();
      setShowAdForm(false);
    } catch (err) {
      console.error(`Error ${currentAd ? 'updating' : 'creating'} advertisement:`, err);
      setError(err.message || `Failed to ${currentAd ? 'update' : 'create'} advertisement. Please try again.`);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: null,
      imagePreview: null,
      adType: "popup",
      targetLocation: "",
      targetAgeGroup: "all",
      targetInterests: [],
      startDate: "",
      endDate: "",
      gymId: "",
    });
  };

  // Delete ad
  const deleteAd = (adId) => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      // Handle both MongoDB _id and mock data id
      setAds(ads.filter(ad => (ad._id || ad.id) !== adId));
      
      // If connected to backend, also send delete request
      if (user?.token) {
        fetch(`http://localhost:4000/api/gym-ads/${adId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          console.log('Advertisement deleted successfully');
        })
        .catch(err => {
          console.error('Error deleting advertisement:', err);
          setError('Failed to delete advertisement. Please try again.');
        });
      }
    }
  };

  // Edit ad
  const editAd = (ad) => {
    console.log('Editing ad:', ad);
    // Determine the correct gym ID - it could be in ad.gymId or ad.gym._id
    const gymId = ad.gymId || (ad.gym && ad.gym._id) || (ad.gym && typeof ad.gym === 'string' ? ad.gym : '');
    
    setFormData({
      title: ad.title,
      description: ad.description,
      image: null,
      imagePreview: ad.imageUrl && ad.imageUrl.startsWith('http') 
        ? ad.imageUrl 
        : `http://localhost:4000/${ad.imageUrl}`,
      adType: ad.type,
      targetLocation: ad.targetLocation || '',
      targetAgeGroup: ad.targetAgeGroup || 'all',
      targetInterests: ad.targetInterests || [],
      startDate: ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '',
      endDate: ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : '',
      gymId: gymId,
    });
    setCurrentAd(ad);
    setShowAdForm(true);
  };

  // Filter ads by status
  const filteredAds = ads.filter(ad => {
    if (filterStatus === "all") return true;
    return ad.status === filterStatus;
  }).filter(ad => {
    if (!searchTerm) return true;
    return ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           ad.gymName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "ad-status-active";
      case "scheduled":
        return "ad-status-scheduled";
      case "ended":
        return "ad-status-ended";
      default:
        return "";
    }
  };

  return (
    <div className="ad-manager-container">
      <div className="ad-manager-header">
        <h2>Advertisement Manager</h2>
        <p>Create and manage promotional advertisements for your gym</p>
      </div>

      {/* Stats Overview */}
      <div className="ad-stats-grid">
        <div className="ad-stat-card">
          <div className="ad-stat-icon">
            <FaAd />
          </div>
          <div className="ad-stat-content">
            <h3>Total Ads</h3>
            <div className="ad-stat-number">{ads.length}</div>
          </div>
        </div>
        
        <div className="ad-stat-card">
          <div className="ad-stat-icon">
            <FaUsers />
          </div>
          <div className="ad-stat-content">
            <h3>Total Clicks</h3>
            <div className="ad-stat-number">
              {ads.reduce((sum, ad) => sum + ad.clicks, 0).toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="ad-stat-card">
          <div className="ad-stat-icon">
            <FaUsers />
          </div>
          <div className="ad-stat-content">
            <h3>Active Campaigns</h3>
            <div className="ad-stat-number">
              {ads.filter(ad => ad.status === "active").length}
            </div>
          </div>
        </div>
      </div>

      {/* Create Ad Button */}
      <div className="ad-create-section">
        <button 
          className="ad-create-btn"
          onClick={() => {
            resetForm();
            setCurrentAd(null);
            setShowAdForm(true);
          }}
          disabled={userGyms.length === 0}
        >
          <FaPlus /> Create New Advertisement
        </button>
        {userGyms.length === 0 && !loadingGyms && (
          <p className="ad-no-gyms-warning">
            You need to have at least one approved gym to create advertisements.
          </p>
        )}
      </div>

      {/* Ad Filters */}
      <div className="ad-content-section">
        <div className="ad-section-header">
          <h3>Your Advertisements</h3>
          <div className="ad-filter-controls">
            <div className="ad-search-box">
              <FaSearch className="ad-search-icon" />
              <input
                type="text"
                placeholder="Search advertisements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ad-filter-dropdown">
              <FaFilter className="ad-filter-icon" />
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Ads</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="ad-loading">Loading advertisements...</div>
        ) : error ? (
          <div className="ad-error">{error}</div>
        ) : filteredAds.length === 0 ? (
          <div className="ad-empty-state">
            <FaAd className="ad-empty-icon" />
            <h4>No advertisements found</h4>
            <p>
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your filters or search terms"
                : "Click the 'Create New Advertisement' button to get started"}
            </p>
          </div>
        ) : (
          <div className="ad-grid">
            {filteredAds.map((ad) => (
              <div key={ad._id || ad.id} className="ad-card">
                <div className="ad-image-container">
                  <img 
                    src={ad.imageUrl.startsWith('http') ? ad.imageUrl : `http://localhost:4000/${ad.imageUrl}`} 
                    alt={ad.title} 
                    className="ad-image" 
                  />
                  <div className={`ad-type-badge ${ad.type}`}>
                    {ad.type.charAt(0).toUpperCase() + ad.type.slice(1)}
                  </div>
                  <div className={`ad-status-badge ${getStatusBadgeClass(ad.status)}`}>
                    {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                  </div>
                </div>
                <div className="ad-content">
                  <h4>{ad.title}</h4>
                  <p className="ad-description">{ad.description}</p>
                  
                  <div className="ad-gym-info">
                    <FaDumbbell />
                    <span>{ad.gymName}</span>
                  </div>
                  
                  <div className="ad-meta">
                    <div className="ad-meta-item">
                      <FaMapMarkerAlt />
                      <span>{ad.targetLocation || "All Locations"}</span>
                    </div>
                    <div className="ad-meta-item">
                      <FaUsers />
                      <span>{ad.targetAgeGroup}</span>
                    </div>
                    <div className="ad-meta-item">
                      <FaCalendarAlt />
                      <span>
                        {ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : ''} to {ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ad-stats-summary">
                    <div className="ad-stat-item">
                      <span className="ad-stat-label">Clicks</span>
                      <span className="ad-stat-value">{ad.clicks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ad-actions">
                  <button 
                    className="ad-action-btn edit"
                    onClick={() => editAd(ad)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="ad-action-btn delete"
                    onClick={() => deleteAd(ad._id || ad.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Ad Form Modal */}
      {showAdForm && (
        <div className="ad-modal-overlay">
          <div className="ad-form-modal">
            <div className="ad-form-header">
              <h3>{currentAd ? "Edit Advertisement" : "Create New Advertisement"}</h3>
              <button 
                className="ad-modal-close"
                onClick={() => setShowAdForm(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="ad-form">
              {/* Gym Selection */}
              <div className="ad-form-group">
                <label htmlFor="gymId">Select Gym to Promote</label>
                {loadingGyms ? (
                  <div className="ad-loading-small">Loading your gyms...</div>
                ) : userGyms.length === 0 ? (
                  <div className="ad-no-gyms-message">
                    You don't have any approved gyms yet. Please register and get approval for a gym first.
                  </div>
                ) : (
                  <select
                    id="gymId"
                    name="gymId"
                    value={formData.gymId}
                    onChange={handleInputChange}
                    required
                    className="ad-gym-select"
                  >
                    <option value="">-- Select a gym --</option>
                    {userGyms.map(gym => (
                      <option key={gym._id} value={gym._id}>
                        {gym.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div className="ad-form-group">
                <label htmlFor="title">Advertisement Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a catchy title"
                  required
                />
              </div>
              
              <div className="ad-form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your promotion or offer"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="ad-form-row">
                <div className="ad-form-group">
                  <label htmlFor="adType">Advertisement Type</label>
                  <select
                    id="adType"
                    name="adType"
                    value={formData.adType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="popup">Pop-up Ad</option>
                  </select>
                </div>
                
                <div className="ad-form-group">
                  <label htmlFor="targetLocation">Target Location</label>
                  <input
                    type="text"
                    id="targetLocation"
                    name="targetLocation"
                    value={formData.targetLocation}
                    onChange={handleInputChange}
                    placeholder="City, Region, or 'All Locations'"
                  />
                </div>
              </div>
              
              <div className="ad-form-row">
                <div className="ad-form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="ad-form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="ad-form-group">
                <label htmlFor="targetAgeGroup">Target Age Group</label>
                <select
                  id="targetAgeGroup"
                  name="targetAgeGroup"
                  value={formData.targetAgeGroup}
                  onChange={handleInputChange}
                >
                  <option value="all">All Ages</option>
                  <option value="18-24">18-24 years</option>
                  <option value="25-34">25-34 years</option>
                  <option value="35-44">35-44 years</option>
                  <option value="45-54">45-54 years</option>
                  <option value="55+">55+ years</option>
                </select>
              </div>
              
              <div className="ad-form-group">
                <label>Target Interests</label>
                <div className="ad-interest-tags">
                  {["Fitness", "Weight Loss", "Bodybuilding", "Yoga", "Cardio", "Strength Training", "Personal Training", "Nutrition"].map((interest) => (
                    <div 
                      key={interest}
                      className={`ad-interest-tag ${formData.targetInterests.includes(interest) ? 'selected' : ''}`}
                      onClick={() => handleInterestChange(interest)}
                    >
                      {interest}
                      {formData.targetInterests.includes(interest) && <FaCheck className="ad-interest-check" />}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Image Upload - Only show for new ads, display preview for edits */}
              <div className="ad-form-group">
                <label htmlFor="image">Advertisement Image</label>
                <div className="ad-image-upload">
                  {formData.imagePreview ? (
                    <div className="ad-image-preview-container">
                      <img 
                        src={formData.imagePreview} 
                        alt="Ad Preview" 
                        className="ad-image-preview" 
                      />
                      {/* Only show remove button for new ads */}
                      {!currentAd && (
                        <button 
                          type="button" 
                          className="ad-remove-image"
                          onClick={() => setFormData({
                            ...formData,
                            image: null,
                            imagePreview: null
                          })}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="ad-upload-placeholder">
                      <FaImage className="ad-upload-icon" />
                      <span>Click to upload image</span>
                      {/* Only show file input for new ads */}
                      {!currentAd && (
                        <input
                          type="file"
                          id="image"
                          name="image"
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="ad-file-input"
                        />
                      )}
                    </div>
                  )}
                </div>
                {currentAd ? (
                  <p className="ad-form-hint">Image cannot be changed when editing. Create a new ad if you need to use a different image.</p>
                ) : (
                  <p className="ad-form-hint">Recommended size: 1200x628 pixels (16:9 ratio)</p>
                )}
              </div>
              
              <div className="ad-form-actions">
                <button 
                  type="button" 
                  className="ad-form-cancel"
                  onClick={() => setShowAdForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="ad-form-submit"
                  disabled={loadingGyms || userGyms.length === 0}
                >
                  {currentAd ? "Update Advertisement" : "Create Advertisement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdManager;
