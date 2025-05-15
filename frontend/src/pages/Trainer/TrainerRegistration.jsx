import React, { useState, useEffect } from 'react';
// import './Styles/TrainerRegistration.css';
import { useProfile } from '../../hooks/useProfile';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

const initialState = {
  name: '',
  email: '',
  phone: '',
  gender: '',
  trainingType: '',
  address: '',
  age: '',
  yearsOfExperience: '',
  certificate: null,
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

const TrainerRegistration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Prefill name, email, phone from user profile (consistent with SeeGymDetails)
  const { user } = useAuthContext();
  const { getProfile } = useProfile();

  useEffect(() => {
    async function fetchUser() {
      if (!user) return;
      const data = await getProfile();
      if (data) {
        setForm((prev) => ({
          ...prev,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
        }));
      }
    }
    fetchUser();
    // eslint-disable-next-line
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
      setCertificatePreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validate = () => {
    let errs = {};
    if (!form.name) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    if (!form.phone) errs.phone = 'Phone number is required';
    if (!form.gender) errs.gender = 'Gender is required';
    if (!form.trainingType) errs.trainingType = 'Training type is required';
    if (!form.address) errs.address = 'Address is required';
    if (!form.age) errs.age = 'Age is required';
    if (!form.yearsOfExperience && form.yearsOfExperience !== 0) errs.yearsOfExperience = 'Years of experience is required';
    if (!form.certificate) errs.certificate = 'Certificate upload is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('gender', form.gender);
    formData.append('trainingType', form.trainingType);
    formData.append('address', form.address);
    formData.append('age', form.age);
    formData.append('yearsOfExperience', form.yearsOfExperience);
    if (form.certificate) {
      formData.append('certificate', form.certificate);
    }

    try {
      const res = await fetch('/api/trainer/registration/register', {
        method: 'POST',
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : '',
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert('Trainer registered successfully!');
        setForm(initialState);
        setCertificatePreview(null);
        navigate('/trainer-dashboard');
      } else {
        alert(data.error || 'Registration failed!');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="trainer-registration-container seegymdetails-modal-overlay">
      <form className="trainer-registration-form seegymdetails-modal" onSubmit={handleSubmit}>
        <div className="form-header seegymdetails-modal-title">
          <h2>Trainer Registration Form</h2>
          <p>Register yourself as a certified trainer and join our GymHub community!</p>
        </div>
        <div className="form-section">
          <div className="form-group seegymdetails-modal-section">
            <label htmlFor="name" className="seegymdetails-modal-label">Name<span className="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              className="seegymdetails-modal-input"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              disabled
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          <div className="form-group seegymdetails-modal-section">
            <label htmlFor="email" className="seegymdetails-modal-label">Email<span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="form-group seegymdetails-modal-section">
            <label htmlFor="phone" className="seegymdetails-modal-label">Phone Number<span className="required">*</span></label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="seegymdetails-modal-input"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          <div className="form-group seegymdetails-modal-section">
            <label className="seegymdetails-modal-label">Gender<span className="required">*</span></label>
            <div className="trainer-registration-gender-options trainer-gender-row" style={{ gap: '1.5rem', marginTop: '0.5rem' }}>
              <label className="trainer-gender-label" style={{display: 'inline-flex', alignItems: 'center', gap: '0.35em', marginRight: '1.2rem'}}>
  <input
    type="radio"
    name="gender"
    value="Male"
    checked={form.gender === 'Male'}
    onChange={handleChange}
    className="seegymdetails-modal-input"
  />
  Male
</label>
              <label className="trainer-gender-label" style={{display: 'inline-flex', alignItems: 'center', gap: '0.35em', marginRight: '1.2rem'}}>
  <input
    type="radio"
    name="gender"
    value="Female"
    checked={form.gender === 'Female'}
    onChange={handleChange}
    className="seegymdetails-modal-input"
  />
  Female
</label>
              <label className="trainer-gender-label" style={{display: 'inline-flex', alignItems: 'center', gap: '0.35em'}}>
  <input
    type="radio"
    name="gender"
    value="Other"
    checked={form.gender === 'Other'}
    onChange={handleChange}
    className="seegymdetails-modal-input"
  />
  Other
</label>
            </div>
            {errors.gender && <span className="error-text">{errors.gender}</span>}
          </div>

          <div className="form-group seegymdetails-modal-section">
            <label htmlFor="trainingType" className="seegymdetails-modal-label">Training Type<span className="required">*</span></label>
            <select
              id="trainingType"
              name="trainingType"
              className="seegymdetails-modal-select"
              value={form.trainingType}
              onChange={handleChange}
            >
              <option value="">Select training type</option>
              {trainingTypes.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
            {errors.trainingType && <span className="error-text">{errors.trainingType}</span>}
          </div>
          <div className="form-group seegymdetails-modal-section">
            <label htmlFor="address" className="seegymdetails-modal-label">Address<span className="required">*</span></label>
            <textarea
              id="address"
              name="address"
              className="seegymdetails-modal-input"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>
          <div className="form-group seegymdetails-modal-section">
            <label className="seegymdetails-modal-label">Age<span className="required">*</span></label>
            <input
              type="number"
              name="age"
              className="seegymdetails-modal-input"
              value={form.age}
              onChange={handleChange}
              min="18"
              required
            />
            {errors.age && <span className="error-text">{errors.age}</span>}
          </div>
          <div className="form-group seegymdetails-modal-section">
            <label className="seegymdetails-modal-label">Years of Experience<span className="required">*</span></label>
            <input
              type="number"
              name="yearsOfExperience"
              className="seegymdetails-modal-input"
              value={form.yearsOfExperience}
              onChange={handleChange}
              min="0"
              required
            />
            {errors.yearsOfExperience && <span className="error-text">{errors.yearsOfExperience}</span>}
          </div>
          <div className="form-group seegymdetails-modal-section">
            <label htmlFor="certificate" className="seegymdetails-modal-label">Certificate of Trainer<span className="required">*</span></label>
            <input
              type="file"
              id="certificate"
              name="certificate"
              className="seegymdetails-modal-input"
              accept="image/*,application/pdf"
              onChange={handleChange}
            />
            {certificatePreview && (
              <div className="certificate-preview">
                <img
                  src={certificatePreview}
                  alt="Certificate Preview"
                  style={{ maxWidth: '200px', marginTop: '1rem', borderRadius: '8px' }}
                />
              </div>
            )}
            {errors.certificate && <span className="error-text">{errors.certificate}</span>}
          </div>
        </div>
        <div className="form-buttons">
          <button className="submit-button" type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default TrainerRegistration;
