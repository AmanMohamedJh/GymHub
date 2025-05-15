import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SubscriptionPage.css';

const FailurePage = () => {
    const navigate = useNavigate();

    return (
        <div className="subscription-result-container failure">
            <div className="result-content">
                <div className="failure-icon">✕</div>
                <h1>Payment Failed</h1>
                <p>Something went wrong with your payment. Please try again.</p>
                <button 
                    className="return-button"
                    onClick={() => navigate('/subscription')}
                >
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default FailurePage;
