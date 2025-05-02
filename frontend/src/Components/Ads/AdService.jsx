import { useState, useEffect } from 'react';
import PopupAd from './PopupAd';

// Fetch active ads from the backend based on filters
export const fetchActiveAds = async (filters = {}) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('type', 'popup'); // Always fetch popup ads only
    
    // Use the correct endpoint based on the backend configuration
    const url = `http://localhost:4000/api/public/ads/active?${params}`;
    console.log('Fetching ads from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ads: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched ads (raw):', data);
    
    // Log the structure of each ad
    if (data && data.length > 0) {
      data.forEach((ad, index) => {
        console.log(`Ad ${index + 1} structure:`, {
          id: ad._id,
          title: ad.title,
          gym: ad.gym,
          gymName: ad.gymName,
          status: ad.status
        });
      });
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
};

// Sample ad for testing when no real ads are available
const sampleAd = {
  _id: 'sample-1',
  title: 'Sample Gym Ad',
  description: 'This is a sample ad for testing purposes.',
  imageUrl: null,
  gymName: 'Sample Gym',
  targetLocation: 'All',
  targetAgeGroup: 'All',
  targetInterests: ['Fitness'],
};

// Hook to manage popup ad state
export const usePopupAd = (location, ageGroup, interests) => {
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAds = async () => {
      setLoading(true);
      
      // Fetch real ads from backend
      const filters = {
        location,
        ageGroup,
        interests
      };
      
      const fetchedAds = await fetchActiveAds(filters);
      
      if (fetchedAds && fetchedAds.length > 0) {
        console.log('Using real ads:', fetchedAds.length);
        setAds(fetchedAds);
      } else {
        // If no real ads, use sample ad
        console.log('No real ads found, using sample ad');
        setAds([sampleAd]);
      }
      
      setLoading(false);
      
      // Show first popup after a delay
      setTimeout(() => {
        setShowPopup(true);
      }, 2000);
    };

    loadAds();
  }, [location, ageGroup, interests]);
  
  const closePopup = () => {
    setShowPopup(false);
    
    // If there are more ads, show the next one after a delay
    if (currentAdIndex < ads.length - 1) {
      setCurrentAdIndex(prevIndex => prevIndex + 1);
      setTimeout(() => {
        setShowPopup(true);
      }, 500);
    }
  };
  
  return {
    ad: ads[currentAdIndex],
    showPopup,
    closePopup,
    loading,
    totalAds: ads.length,
    currentAdIndex
  };
};

// Popup Ad Component for easy use
export const PopupAdDisplay = ({ location, ageGroup, interests, onAdClick }) => {
  const { ad, showPopup, closePopup, totalAds, currentAdIndex } = usePopupAd(location, ageGroup, interests);
  
  if (!ad || !showPopup) return null;
  
  return (
    <PopupAd 
      ad={ad} 
      onClose={closePopup} 
      adCounter={{ current: currentAdIndex + 1, total: totalAds }}
      onAdClick={onAdClick}
    />
  );
};

// Default export for convenience
export default {
  PopupAdDisplay,
  usePopupAd,
  fetchActiveAds
};
