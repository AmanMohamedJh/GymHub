import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useSubscription } from '../../context/Subscription/SubscriptionContext';
import './MySubscription.css';

const MySubscription = () => {
    const [error, setError] = useState(null);
    const { user } = useAuthContext();
    const { subscription, loading, fetchSubscription } = useSubscription();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Fetch subscription data when component mounts
        fetchSubscription();
    }, [user, navigate, fetchSubscription]);

    useEffect(() => {
        // Check subscription status in useEffect
        if (!loading && !subscription) {
            navigate('/subscription');
        }
    }, [loading, subscription, navigate]);

    if (loading) {
        return (
            <div className="my-subscription-page">
                <div className="my-loading-container">
                    <div className="my-loader"></div>
                    <p>Loading subscription details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-subscription-page">
                <div className="my-error-container">
                    <div className="my-error-message">{error}</div>
                    <button className="my-retry-button" onClick={fetchSubscription}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Return null if no subscription (navigation will happen in useEffect)
    if (!subscription) {
        return null;
    }

    const handleCancelSubscription = async () => {
        if (!window.confirm('Are you sure you want to cancel your subscription?')) {
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/subscription/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                await fetchSubscription(); // Refresh subscription data
            } else {
                setError('Failed to cancel subscription');
            }
        } catch (err) {
            setError('Failed to cancel subscription');
        }
    };

    // Show subscription details for any subscription status (active, cancelled, etc.)
    return (
        <div className="my-subscription-page">
            <div className="my-subscription-details">
                <h1>Your Subscription</h1>
                <div className="my-details-card">
                    <div className="my-plan-header">
                        <h2>
                            <span className="my-plan-name">{subscription.planType} Plan</span>
                        </h2>
                        <span className={`my-status ${subscription.status ? subscription.status.toLowerCase() : ''}`}>
                            {subscription.status || 'N/A'}
                        </span>
                    </div>

                    <div className="my-subscription-info">
                        <div className="my-info-row">
                            <span>Start Date</span>
                            <span>{subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        {subscription.endDate && (
                            <div className="my-info-row">
                                <span>End Date</span>
                                <span>{new Date(subscription.endDate).toLocaleDateString()}</span>
                            </div>
                        )}
                        <div className="my-info-row">
                            <span>Next Billing</span>
                            <span>
                                {subscription.status === 'Canceled' 
                                    ? 'Not applicable'
                                    : subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'
                                }
                            </span>
                        </div>
                    </div>

                    <div className="my-plan-features">
                        <h3>Included Features</h3>
                        <ul>
                            <li>Full gym management capabilities</li>
                            <li>Unlimited trainers and members</li>
                            <li>Advanced analytics and reporting</li>
                            <li>Priority customer support</li>
                            {subscription.planType === 'Yearly' && (
                                <>
                                    <li>Custom branding options</li>
                                    <li>API access for integrations</li>
                                    <li>Advanced reporting tools</li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div className="my-subscription-actions">
                        {subscription.status === 'Active' && (
                            <>
                                <button 
                                    className="my-change-plan-button"
                                    onClick={() => navigate('/subscription')}
                                >
                                    Change Plan
                                </button>
                                <button 
                                    className="my-cancel-button"
                                    onClick={handleCancelSubscription}
                                >
                                    Cancel Subscription
                                </button>
                            </>
                        )}
                        {subscription.status !== 'Active' && (
                            <button 
                                className="my-resubscribe-button"
                                onClick={() => navigate('/subscription')}
                            >
                                View Subscription Plans
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MySubscription;
