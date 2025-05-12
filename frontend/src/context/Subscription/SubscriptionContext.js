import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

const SubscriptionContext = createContext();

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};

export const SubscriptionProvider = ({ children }) => {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthContext();

    const fetchSubscription = async () => {
        try {
            if (!user) {
                setSubscription(null);
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:4000/api/subscription/user-subscription', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            
            if (response.ok) {
                setSubscription(data);
                
            } else {
                setSubscription(null);
            }
        } catch (error) {
            console.error('Error fetching subscription:', error);
            setSubscription(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, [user]);

    // Case-insensitive check for active subscription
    const hasActiveSubscription = subscription && 
        (subscription.status.toLowerCase() === 'active' || subscription.status.toLowerCase() === 'Active');

    const value = {
        subscription,
        loading,
        fetchSubscription,
        hasActiveSubscription
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
};

// RequireSubscription component to protect routes that need subscription
export const RequireSubscription = ({ children, redirectTo = '/subscription' }) => {
    const { subscription, loading, hasActiveSubscription } = useSubscription();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    useEffect(() => {
        // Only check subscription if user is logged in
        if (!loading && user && !hasActiveSubscription) {
            console.log('Redirecting: No active subscription'); // Debug log
            navigate(redirectTo);
        }
    }, [loading, hasActiveSubscription, navigate, redirectTo, user]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading subscription status...</p>
            </div>
        );
    }

    // Show children only if there's an active subscription
    return hasActiveSubscription ? children : null;
};

export default SubscriptionContext;
