import React, { useState, useEffect } from 'react';
import { Client } from '../../hooks/Client/useClientDetails';
import { useAuthContext } from '../../hooks/useAuthContext';
import { FaTimes, FaSave, FaWeight, FaRuler } from 'react-icons/fa';
import './Styles/Forms.css';

const BMIUpdateForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        weight: '',
        height: '',
        bmi: '',
        date: new Date().toISOString().split('T')[0],
    });
    const { user } = useAuthContext();
    const { updateBMI, isLoading, error } = Client();

    const calculateBMI = (weight, height) => {
        if (!weight || !height || isNaN(weight) || isNaN(height)) return '';
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    };
    const bmi = calculateBMI(formData.weight, formData.height);

    useEffect(() => {
        const newBmi = parseFloat(calculateBMI(formData.weight, formData.height));
        setFormData((prevData) => ({ ...prevData, bmi: newBmi }));
    }, [formData.weight, formData.height]);

    const getBMIStatus = (bmi) => {
        if (!bmi) return { status: '', color: '#666' };
        if (bmi < 18.5) return { status: 'Underweight', color: '#ffc107' };
        if (bmi < 25) return { status: 'Normal', color: '#28a745' };
        if (bmi < 30) return { status: 'Overweight', color: '#ffc107' };
        return { status: 'Obese', color: '#dc3545' };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Form data :", formData);

        const success = await updateBMI(user._id, formData);
        if (success) {
            console.log("BMI update Success");
            if (onSubmit) {
                onSubmit();
            }

        } else {
            console.log("err handle submit after UpdateBMI func");
        }

    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    return (
        <div className="form-overlay">
            <div className="form-container">
                <div className="form-header">
                    <h2>Update BMI</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Date</label>
                        <input
                            name="date"
                            type="date"
                            className="form-control"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Weight (kg)</label>
                            <div className="input-with-icon">
                                <FaWeight />
                                <input
                                    name="weight"
                                    type="number"
                                    step="0.1"
                                    className="form-control"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="Enter weight"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Height (cm)</label>
                            <div className="input-with-icon">
                                <FaRuler />
                                <input
                                    name="height"
                                    type="number"
                                    className="form-control"
                                    value={formData.height}
                                    onChange={handleChange}
                                    placeholder="Enter height"
                                />
                                <input
                                    name="bmi"
                                    type="hidden"
                                    value={formData.bmi}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {bmi && (
                        <div className="bmi-preview">
                            <h3>Calculated BMI</h3>
                            <div className="bmi-result">
                                <span className="bmi-number"

                                >{bmi}</span>
                                <span
                                    className="bmi-status"
                                    style={{ color: getBMIStatus(bmi).color }}
                                >
                                    {getBMIStatus(bmi).status}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <FaSave /> Save BMI
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BMIUpdateForm;
