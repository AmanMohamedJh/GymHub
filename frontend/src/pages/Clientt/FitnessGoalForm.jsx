import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaBullseye, FaCalendarAlt } from 'react-icons/fa';
import './Styles/Forms.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Client } from '../../hooks/useClientDetails';

const FitnessGoalForm = ({ onClose, onSubmit, editGoal }) => {
    const [formData, setFormData] = useState({
        goalId: editGoal?._id || '',
        goal: editGoal?.goal || '',
        deadline: editGoal?.deadline || '',
        progress: editGoal?.progress || 0,
        status: editGoal?.status || 'In Progress',
        description: editGoal?.description || '',
    });
    const { user } = useAuthContext();
    const { addFitnessGoal, isLoading, error } = Client();

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("form dattta", formData);

        const success = await addFitnessGoal(user._id, formData);
        if (success) {
            console.log("fitness goal added");

            if (onSubmit) {
                onSubmit();
            }
        } else {
            console.log("err handle submit in client details");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="form-overlay">
            <div className="form-container">
                <div className="form-header">
                    <h2>{editGoal ? 'Edit Goal' : 'Add New Goal'}</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Goal Title</label>
                        <div className="input-with-icon">
                            <FaBullseye />
                            <input
                                name="goal"
                                type="text"
                                className="form-control"
                                value={formData.goal}
                                onChange={handleChange}
                                placeholder="e.g., Lose 5kg, Run 10km"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your goal and strategy"
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Deadline</label>
                            <div className="input-with-icon">
                                <FaCalendarAlt />
                                <input
                                    name="deadline"
                                    type="date"
                                    className="form-control"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                className="form-control"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                            </select>
                        </div>
                    </div>

                    {editGoal && (
                        <div className="form-group">
                            <label>Progress ({formData.progress}%)</label>
                            <div className="progress-input">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.progress}
                                    onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                                />
                                <span className="progress-value">{formData.progress}%</span>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" >
                            <FaSave /> {editGoal ? 'Update Goal' : 'Add Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FitnessGoalForm;
