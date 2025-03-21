import React, { useState } from "react";
import "./Styles/trainerWorkoutPlans.css";

const TrainerWorkoutPlans = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    title: "",
    description: "",
    duration: "",
    difficulty: "beginner",
    exercises: [],
  });
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setWorkoutPlans((prev) => [...prev, { ...newPlan, id: Date.now() }]);
    setNewPlan({
      title: "",
      description: "",
      duration: "",
      difficulty: "beginner",
      exercises: [],
    });
    setShowForm(false);
  };

  return (
    <div className="workout-plans-container">
      <div className="header">
        <h1>Workout Plans</h1>
        <button className="add-plan-btn" onClick={() => setShowForm(true)}>
          Create New Plan
        </button>
      </div>

      {showForm && (
        <div className="plan-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={newPlan.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={newPlan.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Duration (weeks):</label>
              <input
                type="number"
                name="duration"
                value={newPlan.duration}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Difficulty:</label>
              <select
                name="difficulty"
                value={newPlan.difficulty}
                onChange={handleInputChange}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="form-buttons">
              <button type="submit">Save Plan</button>
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="plans-grid">
        {workoutPlans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>
            <div className="plan-details">
              <span>Duration: {plan.duration} weeks</span>
              <span>Difficulty: {plan.difficulty}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerWorkoutPlans;
