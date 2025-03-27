import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useSubscription } from "../../context/Subscription/SubscriptionContext";
import "../../styles/common.css";
import "./SubscriptionBanner.css";

const SubscriptionBanner = () => {
  const { user } = useAuthContext();
  const { hasActiveSubscription } = useSubscription();

  if (!user || hasActiveSubscription) {
    return null;
  }

  return (
    <div className="subscription-banner">
      <p>
        You haven't subscribed to any plan yet. Please{" "}
        <Link
          to="/subscription"
          className="subscribe-link"
          style={{ textDecoration: "underline" }}
        >
          choose a subscription plan
        </Link>{" "}
        to access all features.
      </p>
    </div>
  );
};

export default SubscriptionBanner;
