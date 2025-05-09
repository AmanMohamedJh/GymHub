import React, { useState, useEffect } from "react";
import "./Styles/ManageTrainerSession.css";
import "./Styles/AddTrainerSession.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

const AddTrainerSession = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    type: "",
    location: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [typeLoading, setTypeLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch trainer's type from backend
  useEffect(() => {
    const fetchType = async () => {
      if (!user) return;
      try {
        setTypeLoading(true);
        const res = await fetch("/api/trainer/registration/me", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (!res.ok) throw new Error("You must be a registered trainer to add sessions.");
        const data = await res.json();
        setForm(prev => ({ ...prev, type: data.trainingType || "" }));
      } catch (err) {
        setApiError(err.message || "Failed to fetch trainer type");
      } finally {
        setTypeLoading(false);
      }
    };
    fetchType();
    // eslint-disable-next-line
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let errs = {};
    if (!form.title.trim()) errs.title = "Session name required";
    if (!form.date) errs.date = "Date required";
    if (!form.time) errs.time = "Time required";
    if (!form.type) errs.type = "Type required";
    if (!form.location.trim()) errs.location = "Location required";
    if (!form.description.trim()) errs.description = "Description required";
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setApiError("");
    setSuccess("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/trainer/session/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          title: form.title,
          date: form.date,
          time: form.time,
          location: form.location,
          description: form.description
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add session");
      setSuccess("Training session added!");
      setTimeout(() => navigate("/trainer/manage-sessions"), 1200);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="manage-trainer-session-container add-session-page">
      <h2 style={{marginBottom: 18}}>Add Training Session</h2>
      {typeLoading ? (
        <div>Loading trainer info...</div>
      ) : apiError ? (
        <div className="form-error" style={{marginBottom: 16}}>{apiError}</div>
      ) : (
        <form className="trainer-session-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Session Name</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={errors.title ? "error" : ""}
              placeholder="Enter session name"
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>
          <div className="form-row">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={errors.date ? "error" : ""}
            />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>
          <div className="form-row">
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className={errors.time ? "error" : ""}
            />
            {errors.time && <span className="form-error">{errors.time}</span>}
          </div>
          <div className="form-row">
            <label>Type</label>
            <input
              type="text"
              name="type"
              value={form.type}
              readOnly
              disabled
              className="readonly-input"
              style={{background:'#f2f2f2', color:'#333'}}
            />
          </div>
          <div className="form-row">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className={errors.location ? "error" : ""}
              placeholder="Enter location"
            />
            {errors.location && <span className="form-error">{errors.location}</span>}
          </div>
          <div className="form-row">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={errors.description ? "error" : ""}
              placeholder="Describe the session"
              rows={4}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>
          {success && <div className="form-success">{success}</div>}
          {apiError && <div className="form-error">{apiError}</div>}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate("/trainer/manage-sessions")}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Session"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddTrainerSession;
