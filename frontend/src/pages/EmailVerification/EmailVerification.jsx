import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import './EmailVerification.css';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleSendCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Verification code sent! Check your email.');
      } else {
        setMessage(data.error || 'Failed to send verification code');
      }
    } catch (error) {
      setMessage('Error sending verification code');
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/user/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ verificationCode })
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Email verified successfully!');
        
        // Update local storage and auth context
        const updatedUser = { ...user, isEmailVerified: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch({ type: 'UPDATE_USER', payload: { isEmailVerified: true } });
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage(data.error || 'Invalid verification code');
      }
    } catch (error) {
      setMessage('Error verifying email');
    }
    setLoading(false);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="email-verification-container">
      <div className="email-verification-card">
        <h2>Email Verification</h2>
        <p>A verification code will be sent to: <strong>{user.email}</strong></p>
        
        <button 
          onClick={handleSendCode}
          disabled={loading}
          className="send-code-btn"
        >
          {loading ? 'Sending...' : 'Send Verification Code'}
        </button>

        <form onSubmit={handleVerify} className="verification-form">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            required
          />
          <button type="submit" disabled={loading} className="verify-btn">
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default EmailVerification;
