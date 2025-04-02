import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  FaWeight,
  FaDumbbell,
  FaBullseye,
  FaCalendarAlt,
  FaPlus,
  FaCheck,
  FaEdit,
} from "react-icons/fa";
import "./Styles/ProgressTracking.css";
import { Link } from "react-router-dom";
import FitnessGoalForm from "./FitnessGoalForm";
import BMIUpdateForm from "./BMIUpdateForm";
import WorkoutLogForm from "./workoutLogForm";
import { Client } from "../../hooks/Client/useClientDetails";

const ProgressTracking = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("workoutLogs");
  const [editingGoal, setEditingGoal] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBmiFormOpen, setIsBmiFormOpen] = useState(false);
  const [isLogFormOpen, setIsLogFormOpen] = useState(false);
  const [fitnessData, setfitnessData] = useState({});

  const { getFitnessData } = Client();

  useEffect(() => {
    const fetchFitness = async () => {
      if (user) {
        const fitness = await getFitnessData(user._id);
        setfitnessData(fitness);
      }
    };

    fetchFitness();

    console.log(fitnessData);
  }, [user]);

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    console.log("Form successfully submitted!");
    setIsFormOpen(false);
    setIsBmiFormOpen(false);
    setIsLogFormOpen(false);
    window.location.reload(); // Optionally close the form
  };

  // Mock data - replace with actual data from your backend
  const workoutLogs = [
    {
      _id: 1,
      date: "2025-03-25",
      workout: "Upper Body Strength",
      exercises: [
        { name: "Bench Press", sets: 3, reps: 10, weight: "60kg" },
        { name: "Pull-ups", sets: 3, reps: 8, weight: "Body weight" },
      ],
      duration: "45 min",
      calories: 320,
    },
    {
      _id: 2,
      date: "2025-03-24",
      workout: "Cardio",
      exercises: [
        { name: "Treadmill", duration: "30 min", distance: "5km" },
        { name: "Rowing", duration: "15 min", distance: "2km" },
      ],
      duration: "45 min",
      calories: 400,
    },
  ];

  const fitnessGoals = [
    {
      _id: 1,
      goal: "Lose 5kg",
      deadline: "2025-06-01",
      progress: 60,
      status: "In Progress",
    },
    {
      _id: 2,
      goal: "Run 10km",
      deadline: "2025-05-15",
      progress: 80,
      status: "In Progress",
    },
    {
      _id: 3,
      goal: "Bench Press 80kg",
      deadline: "2025-07-01",
      progress: 40,
      status: "In Progress",
    },
  ];

  const calculateBMIStatus = (bmi) => {
    if (bmi < 18.5) return { status: "Underweight", color: "#ffc107" };
    if (bmi < 25) return { status: "Normal", color: "#28a745" };
    if (bmi < 30) return { status: "Overweight", color: "#ffc107" };
    return { status: "Obese", color: "#dc3545" };
  };

  const renderWorkoutLogs = () => (
    <div className="progress-section">
      <div className="section-header">
        <h3>Workout Logs</h3>
        <button
          className="dashboard-btn-primary"
          onClick={() => setIsLogFormOpen(true)}
        >
          <FaPlus />
          Add Workoutlog
        </button>
      </div>
      <div className="workout-logs">
        {fitnessData?.workoutLogs?.length > 0 ? (
          fitnessData.workoutLogs.map((log, index) => (
            <div key={index} className="workout-log-card">
              <div className="workout-log-header">
                <h4>{log.workout}</h4>
                <span className="workout-date">
                  <FaCalendarAlt /> {log.date.split("T")[0]}
                </span>
              </div>
              <div className="workout-exercises">
                {log.exercises?.map((exercise, i) => (
                  <div key={i} className="exercise-item">
                    <span className="exercise-name">{exercise.exercise}</span>
                    {exercise.sets && (
                      <span className="exercise-details">
                        {exercise.sets} sets × {exercise.reps} reps @{" "}
                        {exercise.weight}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No workout logs available.</p> // ✅ Prevents crash if workoutLogs is undefined or empty
        )}
      </div>
    </div>
  );

  const renderBMITracking = () => (
    <div className="progress-section">
      <div className="section-header">
        <h3>BMI Tracking</h3>
        <button
          className="dashboard-btn-primary"
          onClick={() => setIsBmiFormOpen(true)}
        >
          <FaPlus /> Update BMI
        </button>
      </div>
      {fitnessData?.bmi && fitnessData.bmi.length > 0 ? (
        <div className="bmi-container">
          <div className="current-bmi">
            <h4>Current BMI</h4>
            <div className="bmi-value">
              {fitnessData.bmi[fitnessData.bmi.length - 1].bmi.toFixed(1)}
              <span
                className="bmi-status"
                style={{
                  color: calculateBMIStatus(
                    fitnessData.bmi[fitnessData.bmi.length - 1].bmi
                  ).color,
                }}
              >
                {
                  calculateBMIStatus(
                    fitnessData.bmi[fitnessData.bmi.length - 1].bmi
                  ).status
                }
              </span>
            </div>
            <div className="bmi-details">
              <span>Weight: {fitnessData.weight || "N/A"} kg</span>
              <span>Height: {fitnessData.height || "N/A"} cm</span>
            </div>
          </div>
          <div className="bmi-history">
            <h4>BMI History</h4>
            <div className="bmi-chart">
              {fitnessData.bmi.map((record, index) => (
                <div key={index} className="bmi-record">
                  <div className="bmi-date">{record.date.split("T")[0]}</div>
                  <div className="bmi-bar-container">
                    <div
                      className="bmi-bar"
                      style={{
                        height: `${(record.bmi / 30) * 100}%`,
                        backgroundColor: calculateBMIStatus(record.bmi).color,
                      }}
                    ></div>
                  </div>
                  <div className="bmi-value">{record.bmi.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Nothing to show</p>
      )}
    </div>
  );

  const renderFitnessGoals = () => (
    <div className="progress-section">
      <div className="section-header">
        <h3>Fitness Goals</h3>
        <button
          className="dashboard-btn-primary"
          onClick={() => setIsFormOpen(true)}
        >
          <FaPlus />
          Add Fitness Goal
        </button>
      </div>
      <div className="goals-grid">
        {fitnessData?.fitnessGoals?.length > 0 ? (
          fitnessData.fitnessGoals.map((goal, index) => (
            <div key={index} className="goal-card">
              <div className="goal-header">
                <h4>{goal.goal}</h4>
                <button
                  className="icon-button"
                  onClick={() => handleEditGoal(goal)}
                >
                  <FaEdit />
                </button>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{goal.progress}%</span>
              </div>
              <div className="goal-footer">
                <span className="goal-deadline">
                  <FaCalendarAlt /> {goal.deadline.split("T")[0]}
                </span>
                <span className={`goal-status ${goal.status.toLowerCase()}`}>
                  {goal.status === "Completed" ? <FaCheck /> : null}
                  {goal.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No workout logs available.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-main-container">
      <div className="dashboard-header-main">
        <h2>Progress Tracking</h2>
      </div>

      <div className="progress-stats-grid">
        <div className="dashboard-stat-item">
          <FaDumbbell className="dashboard-icon" />
          <h3>Total Workouts</h3>
          <div className="dashboard-number">24</div>
        </div>
        <div className="dashboard-stat-item">
          <FaWeight className="dashboard-icon" />
          <h3>Current Weight</h3>
          <div className="dashboard-number">kg</div>
        </div>
        <div className="dashboard-stat-item">
          <FaBullseye className="dashboard-icon" />
          <h3>Active Goals</h3>
          <div className="dashboard-number">
            {fitnessGoals.filter((g) => g.status === "In Progress").length}
          </div>
        </div>
      </div>

      <div className="progress-navigation">
        <button
          className={`tab-button ${
            activeTab === "workoutLogs" ? "active" : ""
          }`}
          onClick={() => setActiveTab("workoutLogs")}
        >
          <FaDumbbell /> Workout Logs
        </button>
        <button
          className={`tab-button ${
            activeTab === "bmiTracking" ? "active" : ""
          }`}
          onClick={() => setActiveTab("bmiTracking")}
        >
          <FaWeight /> BMI Tracking
        </button>
        <button
          className={`tab-button ${
            activeTab === "fitnessGoals" ? "active" : ""
          }`}
          onClick={() => setActiveTab("fitnessGoals")}
        >
          <FaBullseye /> Fitness Goals
        </button>
      </div>

      <div className="progress-content">
        {activeTab === "workoutLogs" && renderWorkoutLogs()}
        {activeTab === "bmiTracking" && renderBMITracking()}
        {activeTab === "fitnessGoals" && renderFitnessGoals()}
      </div>
      {isFormOpen && (
        <FitnessGoalForm
          editGoal={editingGoal}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
      {isBmiFormOpen && (
        <BMIUpdateForm
          onClose={() => setIsBmiFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
      {isLogFormOpen && (
        <WorkoutLogForm
          onClose={() => setIsLogFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default ProgressTracking;
