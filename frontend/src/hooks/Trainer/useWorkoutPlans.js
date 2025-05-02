import { useState, useEffect } from "react";

const API_URL = "http://localhost:4000/api/workout-plans";

const useWorkoutPlans = (trainerId) => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch workout plans for a trainer
  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        const response = await fetch(`${API_URL}/${trainerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch workout plans");
        }
        const data = await response.json();
        setWorkoutPlans(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlans();
  }, [trainerId]);

  // Create a new workout plan
  const createWorkoutPlan = async (newPlan) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlan),
      });
      const addedPlan = await response.json();
      setWorkoutPlans((prev) => [...prev, addedPlan]);
    } catch (err) {
      setError("Error adding workout plan");
    }
  };

  // Delete a workout plan
  const deleteWorkoutPlan = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setWorkoutPlans((prev) => prev.filter((plan) => plan._id !== id));
    } catch (err) {
      setError("Error deleting workout plan");
    }
  };

  return { workoutPlans, loading, error, createWorkoutPlan, deleteWorkoutPlan };
};

export default useWorkoutPlans;
