import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import useTrainerRegistrationStatus from "../../hooks/Trainer/useTrainerRegistrationStatus";
import "../Trainer/Styles/trainerdash.css";
import {
  FaEdit,
  FaCalendarPlus,
  FaDumbbell,
  FaChartLine,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const TrainerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [trainerData, setTrainerData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Registration status
  const isRegistered = useTrainerRegistrationStatus(user);

  // Fetch real trainer registration data
  useEffect(() => {
    if (!user) {
      setTrainerData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/trainer/registration/me", {
      headers: {
        Authorization: user.token ? `Bearer ${user.token}` : ""
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          setTrainerData(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setTrainerData(data);
        setEditedData(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch trainer data.");
        setTrainerData(null);
        setLoading(false);
      });
  }, [user]);

  const handleRegisterClick = () => {
    if (isRegistered) {
      setShowModal(true);
    } else {
      navigate("/trainer/registration");
    }
  };

  const closeModal = () => setShowModal(false);

  const handleUpdateClick = async () => {
    if (isEditing) {
      try {
        let formData;
        let isMultipart = false;

        if (editedData.certificateFile) {
          formData = new FormData();
          Object.keys(editedData).forEach(key => {
            if (key !== 'certificateUrl' && key !== 'certificateFile') {
              formData.append(key, editedData[key]);
            }
          });
          formData.append('certificate', editedData.certificateFile);
          isMultipart = true;
        } else {
          formData = { ...editedData };
          delete formData.certificateFile;
        }

        const res = await fetch('/api/trainer/registration/me', {
          method: 'PUT',
          headers: isMultipart
            ? { Authorization: user.token ? `Bearer ${user.token}` : '' }
            : {
                'Content-Type': 'application/json',
                Authorization: user.token ? `Bearer ${user.token}` : '',
              },
          body: isMultipart ? formData : JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update failed');
        setTrainerData(data);
        setIsEditing(false);
      } catch (err) {
        alert(err.message);
      }
    } else {
      setEditedData({ ...trainerData });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditedData({ ...trainerData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const navigateToSession = () => {
    navigate("/trainer/manage-sessions");
  };

  const navigateToClientProgress = () => {
    navigate("/trainer/client-progress");
  };

  const navigateToWorkoutPlans = () => {
    navigate("/trainer/workout-plans");
  };

  const trainingTypes = [
  'Yoga',
  'Body Fitness',
  'Nutritionist',
  'Dietist',
  'Personal Training',
  'Crossfit',
  'Cardio',
  'Other',
];

const renderDetailItem = (label, field) => {
  // Gender dropdown
  if (field === 'gender' && isEditing) {
    return (
      <div className={`detail-item editing`}>
        <label>{label}:</label>
        <select
          value={editedData.gender || ''}
          onChange={e => handleInputChange('gender', e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
    );
  }
  // Training Type dropdown
  if (field === 'trainingType' && isEditing) {
    return (
      <div className={`detail-item editing`}>
        <label>{label}:</label>
        <select
          value={editedData.trainingType || ''}
          onChange={e => handleInputChange('trainingType', e.target.value)}
        >
          <option value="">Select Training Type</option>
          {trainingTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    );
  }
  // Default: text input
  return (
    <div className={`detail-item ${isEditing ? "editing" : ""}`}>
      <label>{label}:</label>
      {isEditing ? (
        <input
          type="text"
          value={editedData[field] !== undefined ? editedData[field] : (trainerData[field] || '')}
          onChange={e => handleInputChange(field, e.target.value)}
        />
      ) : (
        <span>{trainerData[field]}</span>
      )}
    </div>
  );
};

  if (loading) {
    return <div className="trainer-dashboard"><p>Loading trainer profile...</p></div>;
  }
  if (error) {
    return <div className="trainer-dashboard"><p style={{color: 'red'}}>Error: {error}</p></div>;
  }
  if (!trainerData) {
    return (
      <div className="trainer-dashboard">
        <p>You are not registered as a trainer yet.</p>
        <button className="register-btn" onClick={handleRegisterClick}>
          Register as Trainer
        </button>
      </div>
    );
  }

  const handleDeleteRegistration = async () => {
    setDeleting(true);
    try {
      const res = await fetch('/api/trainer/registration/me', {
        method: 'DELETE',
        headers: { Authorization: user.token ? `Bearer ${user.token}` : '' },
      });
      if (!res.ok) throw new Error('Failed to delete registration');
      setTrainerData(null);
      setShowDeleteModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="trainer-dashboard">
      <div className="dashboard-header">
        <h1>Trainer Dashboard</h1>
        <button className="register-btn" onClick={handleRegisterClick}>
          Register Trainer
        </button>
      </div>

      {/* Modal for already registered trainers */}
      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="modal-content" style={{
            background: '#fff', borderRadius: 12, padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            maxWidth: 400, textAlign: 'center', position: 'relative'
          }}>
            <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Already Registered</h2>
            <p style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.1rem' }}>
              You have already registered as a trainer, can't register twice.
            </p>
            <button onClick={closeModal} style={{
              background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6,
              padding: '0.6rem 1.8rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
              transition: 'background 0.2s'
            }}>OK</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="modal-content" style={{
            background: '#fff', borderRadius: 12, padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            maxWidth: 400, textAlign: 'center', position: 'relative'
          }}>
            <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Cancel Registration</h2>
            <p style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.1rem' }}>
              Are you sure you want to cancel your trainer registration? This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteRegistration}
              disabled={deleting}
              style={{
                background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6,
                padding: '0.6rem 1.8rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
                marginRight: 10, opacity: deleting ? 0.7 : 1
              }}
            >{deleting ? 'Deleting...' : 'Confirm'}</button>
            <button
              onClick={() => setShowDeleteModal(false)}
              style={{
                background: '#bbb', color: '#fff', border: 'none', borderRadius: 6,
                padding: '0.6rem 1.8rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer'
              }}
            >Cancel</button>
          </div>
        </div>
      )}

      <div className="trainer-profile-card">
        <div className="profile-header">
          <h2>Trainer Profile</h2>
          <div className="profile-actions">
            <button className="update-btn" onClick={handleUpdateClick}>
              {isEditing ? (
                <>
                  <FaSave /> Save Changes
                </>
              ) : (
                <>
                  <FaEdit /> Update Profile
                </>
              )}
            </button>
            {isEditing && (
              <button className="cancel-btn" onClick={handleCancelEdit}>
                <FaTimes /> Cancel
              </button>
            )}
            {/* Cancel Registration Button */}
            {!isEditing && (
              <button className="cancel-registration-btn" style={{background: '#e74c3c', color: '#fff', marginLeft: 12, border: 'none', borderRadius: 6, padding: '0.5rem 1.3rem', fontWeight: 600, cursor: 'pointer'}} onClick={() => setShowDeleteModal(true)}>
                Cancel Registration
              </button>
            )}
          </div>
        </div>
        <div className="profile-details">
          {/* Name and Email are always read-only */}
          <div className="detail-item">
            <label>Name:</label>
            <span>{trainerData.name}</span>
          </div>
          <div className="detail-item">
            <label>Email:</label>
            <span>{trainerData.email}</span>
          </div>

          {/* Editable fields when editing, otherwise show as text */}
          {renderDetailItem('Phone', 'phone')}
          {renderDetailItem('Gender', 'gender')}
          {renderDetailItem('Training Type', 'trainingType')}
          {renderDetailItem('Address', 'address')}
          {renderDetailItem('Age', 'age')}
          {renderDetailItem('Years of Experience', 'yearsOfExperience')}

          <div className="detail-item">
            <label>Certificate Image:</label>
            {isEditing ? (
  <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
    {editedData.certificateUrl && (
      <>
        <img
          src={editedData.certificateUrl.startsWith('http') ? editedData.certificateUrl : editedData.certificateUrl}
          alt="Certificate"
          className="certificate-img"
          style={{ maxWidth: 220, borderRadius: 10, marginTop: 8, boxShadow: "0 2px 8px rgba(231,76,60,0.09)" }}
        />
        <button
          style={{marginTop: 4, maxWidth: 120, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 5, padding: '0.3rem 0.7rem', cursor: 'pointer'}}
          onClick={() => {
            handleInputChange('certificateUrl', '');
            handleInputChange('certificateFile', null);
          }}
          type="button"
        >Remove Image</button>
      </>
    )}
    <label htmlFor="certificate-upload" style={{fontWeight: 600, color: '#e74c3c', marginTop: 12, marginBottom: 4, cursor: 'pointer'}}>
      {editedData.certificateUrl ? 'Replace Certificate Image' : 'Add Certificate Image'}
    </label>
    <input
      id="certificate-upload"
      type="file"
      accept="image/*"
      style={{marginTop: 2, marginBottom: 4}}
      onChange={e => {
        const file = e.target.files[0];
        if (file) {
          handleInputChange('certificateUrl', URL.createObjectURL(file));
          handleInputChange('certificateFile', file);
        }
      }}
    />
    {editedData.certificateFile && (
      <span style={{color:'#888', fontSize:'0.95em'}}>New image selected: {editedData.certificateFile.name}</span>
    )}
  </div>
) : (
  editedData.certificateUrl ? (
    <img
      src={editedData.certificateUrl.startsWith('http') ? editedData.certificateUrl : editedData.certificateUrl}
      alt="Certificate"
      className="certificate-img"
      style={{ maxWidth: 220, borderRadius: 10, marginTop: 8, boxShadow: "0 2px 8px rgba(231,76,60,0.09)" }}
    />
  ) : (
    <span>No image</span>
  )
)}
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="trainer-dashboard-card" onClick={navigateToSession}>
          <FaCalendarPlus className="icon" />
          <h3>Manage Sessions</h3>
          <p>Schedule and manage your training sessions</p>
        </div>
        <div
          className="trainer-dashboard-card"
          onClick={navigateToWorkoutPlans}
        >
          <FaDumbbell className="icon" />
          <h3>Add Workout Plan</h3>
          <p>Create and manage workout plans for clients</p>
        </div>
        <div
          className="trainer-dashboard-card"
          onClick={navigateToClientProgress}
        >
          <FaChartLine className="icon" />
          <h3>View Client Progress</h3>
          <p>Track and monitor client achievements</p>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
