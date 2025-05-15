import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfileContext = createContext();

export const useClientProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    const fetchProfile = async () => {
        try {
            if (!user || user.role !== 'client') {
                setProfile(null);
                setLoading(false);
                return;
            }

            // Skip check on login or registration page
            const skipRoutes = ['/login', '/register'];
            if (skipRoutes.includes(location.pathname)) {
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:4000/api/client/check-profile', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok && data.hasProfile) {
                setProfile(data);
            } else {
                console.log('[Profile Check] Incomplete profile. Redirecting to registration...');
                navigate('/client-register');
            }
        } catch (error) {
            console.error('[Profile Check] Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user, location.pathname]);

    const hasCompletedProfile = !!profile;

    const value = {
        profile,
        loading,
        fetchProfile,
        hasCompletedProfile,
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};
