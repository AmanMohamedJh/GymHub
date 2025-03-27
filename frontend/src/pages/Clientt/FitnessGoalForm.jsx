import React, { useState } from 'react';
import { FaTimes, FaSave, FaBullseye, FaCalendarAlt } from 'react-icons/fa';
import './Styles/Forms.css';

const FitnessGoalForm = ({ onClose, onSubmit, editGoal }) => {
    const [formData, setFormData] = useState({
        goal: editGoal?.goal || '',
        deadline: editGoal?.deadline || '',
        progress: editGoal?.progress || 0,
        status: editGoal?.status || 'In Progress',
        description: editGoal?.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
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
                                type="text"
                                className="form-control"
                                value={formData.goal}
                                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                placeholder="e.g., Lose 5kg, Run 10km"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="form-control"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                    type="date"
                                    className="form-control"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                className="form-control"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                        <button type="submit" className="btn btn-primary">
                            <FaSave /> {editGoal ? 'Update Goal' : 'Add Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FitnessGoalForm;
