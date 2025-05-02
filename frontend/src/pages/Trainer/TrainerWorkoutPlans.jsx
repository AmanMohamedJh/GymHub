import React, { useState } from "react";
import useWorkoutPlans from "../../hooks/Trainer/useWorkoutPlans";
import "./Styles/trainerWorkoutPlans.css";

const TrainerWorkoutPlans = ({ trainerId }) => {
  const [newPlan, setNewPlan] = useState({
    title: "",
    description: "",
    duration: "",
    difficulty: "beginner",
    exercises: [],
  });
  const [showForm, setShowForm] = useState(false);

  const { workoutPlans, loading, error, createWorkoutPlan, deleteWorkoutPlan } = useWorkoutPlans(trainerId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createWorkoutPlan({ ...newPlan, trainerId });
    setNewPlan({
      title: "",
      description: "",
      duration: "",
      difficulty: "beginner",
      exercises: [],
    });
    setShowForm(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
            <button type="submit">Save Plan</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="plans-grid">
        {workoutPlans.map((plan) => (
          <div key={plan._id} className="plan-card">
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>
            <button
              className="delete-plan-btn"
              onClick={() => deleteWorkoutPlan(plan._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerWorkoutPlans;
