import React, { useEffect, useState } from "react";
import "./AdStyles.css";
import gymImage1 from "../../Images/gym1.jpg.jpg";

const PopupAd = (props) => {
  const { ad, onClose, adCounter, onAdClick } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [localAd, setLocalAd] = useState(ad);

  useEffect(() => {
    setLocalAd(ad);
  }, [ad]);

  useEffect(() => {
    if (ad) {
      // Track view for real ads
      if (ad._id && !ad._id.startsWith("sample")) {
        fetch(`http://localhost:4000/api/public/ads/${ad._id}/view`, {
          method: "POST",
          credentials: "omit",
          headers: {
            Authorization: null,
          },
        }).catch((err) => console.error("Error tracking view:", err));
      }

      // Show popup with delay
      setTimeout(() => setIsVisible(true), 300);
    }
  }, [ad]);

  // Function to handle click on "I'm Interested" button
  function handleInterestedClick() {
    // Track click for real ads
    if (localAd && localAd._id && !localAd._id.startsWith("sample")) {
      console.log("Tracking click for ad ID:", localAd._id);
      const token = localStorage.getItem("token");
      fetch(`http://localhost:4000/api/public/ads/${localAd._id}/click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to track click");
          }
          return response.json();
        })
        .then((updatedAd) => {
          console.log("Click tracking response:", updatedAd);
          setLocalAd(updatedAd); // update local state for immediate feedback
          if (onAdClick) {
            onAdClick(localAd._id, updatedAd);
          }
        })
        .catch((err) => {
          console.error("Error tracking click:", err);
        });
    } else {
      console.log("Not tracking click - sample ad or missing ID");
    }
    // Just close the popup without redirecting
    handleClose();
  }

  // Function to handle closing the popup
  function handleClose() {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  }

  if (!localAd || !isVisible) return null;

  return (
    <div className="popup-ad-overlay">
      <div className="popup-ad">
        <button className="popup-ad-close" onClick={handleClose}>
          ×
        </button>
        <div className="popup-ad-content">
          <div className="popup-ad-image">
            <img
              src={
                localAd.imageUrl
                  ? localAd.imageUrl.startsWith("http")
                    ? localAd.imageUrl
                    : `http://localhost:4000/${localAd.imageUrl}`
                  : gymImage1
              }
              alt={localAd.title}
            />
          </div>
          <div className="popup-ad-info">
            <h3>{localAd.title}</h3>
            <p>{localAd.description}</p>
            <div className="popup-ad-gym">
              <span>{localAd.gymName}</span>
            </div>
            <button className="popup-ad-cta" onClick={handleInterestedClick}>
              {"I'm Interested"}
            </button>
            {/* Show Clicks count for immediate feedback */}
            {typeof localAd.clicks === "number" && (
              <div className="popup-ad-clicks">
                <span
                  className="popup-ad-people-icon"
                  role="img"
                  aria-label="people"
                >
                  👥
                </span>
                No Of People Interested currently
                <span className="popup-ad-number">{localAd.clicks}</span>
              </div>
            )}
          </div>
        </div>
        <div className="popup-ad-sponsored">Sponsored</div>
        {adCounter && adCounter.total > 1 && (
          <div className="popup-ad-counter">
            {adCounter.current} of {adCounter.total}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupAd;
