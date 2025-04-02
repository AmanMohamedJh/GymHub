import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaPlus, FaSave } from 'react-icons/fa';
import { Client } from '../../hooks/Client/useClientDetails';
import { useAuthContext } from '../../hooks/useAuthContext';
import './Styles/Forms.css';



const WorkoutLogForm = ({ onClose, onSubmit }) => {
    const [workoutData, setWorkoutData] = useState({
        date: new Date().toISOString().split('T')[0],
        workout: '',
        exercises: [],
    });
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { addWorkoutLog, isLoading, error } = Client();

    const [newExercise, setNewExercise] = useState({
        exercise: '',
        sets: '',
        reps: '',
        weight: '',
    });

    const handleAddExercise = () => {
        if (newExercise.exercise) {
            setWorkoutData({
                ...workoutData,
                exercises: [...workoutData.exercises, { ...newExercise }],
            });
            setNewExercise({
                exercise: '',
                sets: '',
                reps: '',
                weight: '',
            });
        }
    };


    const handleRemoveExercise = (index) => {
        const updatedExercises = workoutData.exercises.filter((_, i) => i !== index);
        setWorkoutData({ ...workoutData, exercises: updatedExercises });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("dataaaaa :", workoutData);
        //rest of the code for crud
        const success = await addWorkoutLog(user._id, user.name, workoutData);
        if (success) {
            console.log("sent successfully");
            if (onSubmit) {
                onSubmit();
            }


        } else {
            console.log("error");
        }

    };

    const handleChange = (e, dataType = 'workoutData') => {
        const { name, value } = e.target;
        if (dataType === 'workoutData') {
            setWorkoutData({
                ...workoutData,
                [name]: value,
            });
        } else {
            setNewExercise({
                ...newExercise,
                [name]: value,
            });
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-container">
                <div className="form-header">
                    <h2>Log Workout</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">

                        <div className="form-group">
                            <label>Workout Name</label>
                            <input
                                type="text"
                                name="workout"
                                className="form-control"
                                placeholder="e.g., Upper Body Strength"
                                value={workoutData.workout}
                                onChange={(e) => handleChange(e, 'workoutData')}
                            />
                        </div>
                    </div>

                    <div className="exercise-list">
                        {workoutData.exercises.map((exercise, index) => (
                            <div key={index} className="exercise-item">
                                <div>
                                    <strong>{exercise.exercise}</strong>
                                    <div>
                                        {exercise.sets && exercise.reps
                                            ? `${exercise.sets} sets × ${exercise.reps} reps @ ${exercise.weight}`
                                            : `${exercise.duration} • ${exercise.distance}`}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="remove-exercise"
                                    onClick={() => handleRemoveExercise(index)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}

                        <div className="form-group">
                            <input
                                type="text"
                                name="exercise"
                                className="form-control"
                                placeholder="Exercise name"
                                value={newExercise.exercise}
                                onChange={(e) => handleChange(e, 'newExercise')}
                            />
                            <div className="form-row" style={{ marginTop: '0.5rem' }}>
                                <input
                                    type="number"
                                    name="sets"
                                    className="form-control"
                                    placeholder="Sets"
                                    value={newExercise.sets}
                                    onChange={(e) => handleChange(e, 'newExercise')}
                                />
                                <input
                                    type="number"
                                    name="reps"
                                    className="form-control"
                                    placeholder="Reps"
                                    value={newExercise.reps}
                                    onChange={(e) => handleChange(e, 'newExercise')}
                                />
                                <input
                                    type="number"
                                    name="weight"
                                    className="form-control"
                                    placeholder="Weight"
                                    value={newExercise.weight}
                                    onChange={(e) => handleChange(e, 'newExercise')}
                                />
                            </div>
                            <button
                                type="button"
                                className="add-exercise"
                                onClick={handleAddExercise}
                            >
                                <FaPlus /> Add Exercise
                            </button>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" >
                            <FaSave /> Save Workout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkoutLogForm;
