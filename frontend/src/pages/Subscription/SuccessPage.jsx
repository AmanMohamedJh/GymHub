import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubscription } from '../../context/Subscription/SubscriptionContext';
import './SubscriptionPage.css';

const SuccessPage = () => {
    const navigate = useNavigate();
    const { fetchSubscription, subscription } = useSubscription();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSubscription = async () => {
            const sessionId = searchParams.get('session_id');
            if (sessionId) {
                await fetchSubscription();
                // Wait a bit longer to ensure the subscription data is updated
                setTimeout(() => {
                    setIsLoading(false);
                }, 3000);
            } else {
                setIsLoading(false);
            }
        };

        loadSubscription();
    }, [fetchSubscription, searchParams]);

    useEffect(() => {
        if (!isLoading && subscription) {
            navigate('/my-subscription');
        }
    }, [isLoading, subscription, navigate]);

    return (
        <div className="subscription-result-container success">
            <div className="result-content">
                <div className="success-icon">✓</div>
                <h1>Payment Successful!</h1>
                <p>Thank you for your subscription. Your account has been upgraded.</p>
                <p className="redirect-message">Redirecting to your subscription details...</p>
                <button 
                    className="return-button"
                    onClick={() => navigate('/my-subscription')}
                    disabled={isLoading}
                >
                    View My Subscription
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;
