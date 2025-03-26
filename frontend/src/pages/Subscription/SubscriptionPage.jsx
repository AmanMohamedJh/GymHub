import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { FaCheck } from 'react-icons/fa';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Monthly',
            price: 'Rs 3500',
            period: '/month',
            features: [
                'Full gym management',
                'Unlimited trainers',
                'Priority support',
                'Advanced analytics',
                'Email notifications',
                'Member tracking'
            ]
        },
        {
            name: 'Yearly',
            price: 'Rs 8000',
            period: '/year',
            popular: true,
            features: [
                'Everything in Monthly plan',
                '2 months free',
                'VIP support',
                'Custom branding',
                'API access',
                'Advanced reporting',
                'Priority features'
            ]
        }
    ];

    const handleSubscribe = async (planType) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('http://localhost:4000/api/subscription/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ planType })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            window.location.href = data.url;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    if (loading) {
        return (
            <div className="subscription-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading subscription plans...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="subscription-page">
            <div className="subscription-page-header">
                <h1>Choose Your Plan</h1>
                <p>Select the perfect plan for your gym management needs</p>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>Try Again</button>
                </div>
            )}

            <div className="subscription-plans-container">
                {plans.map((plan) => (
                    <div 
                        key={plan.name} 
                        className={`subscription-plan-card ${plan.popular ? 'subscription-plan-popular' : ''}`}
                    >
                        <div className="subscription-plan-header">
                            <h3 className="subscription-plan-name">{plan.name}</h3>
                            <div className="subscription-plan-price">
                                {plan.price}
                                <span>{plan.period}</span>
                            </div>
                            {plan.name === 'Yearly' && (
                                <div className="subscription-plan-savings">
                                    Save Rs 34,000 per year
                                </div>
                            )}
                        </div>

                        <ul className="subscription-plan-features">
                            {plan.features.map((feature, index) => (
                                <li key={index}>
                                    <FaCheck />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            className={`subscription-plan-button ${plan.name.toLowerCase()}`}
                            onClick={() => handleSubscribe(plan.name)}
                            disabled={loading}
                        >
                            Subscribe Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPage;
