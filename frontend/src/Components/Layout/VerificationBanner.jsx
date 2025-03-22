import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../styles/common.css";

const VerificationBanner = () => {
  const { user } = useAuthContext();

  if (!user || user.isEmailVerified) {
    return null;
  }

  return (
    <div className="verification-banner">
      <p>
        Your email is not verified. Please{" "}
        <Link
          to="/email-verification"
          className="verify-link"
          style={{ textDecoration: "underline" }}
        >
          verify your email
        </Link>{" "}
        to access all features.
      </p>
    </div>
  );
};

export default VerificationBanner;
