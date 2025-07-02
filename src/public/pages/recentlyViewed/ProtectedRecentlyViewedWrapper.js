import React, { useEffect, useState } from "react";
import RecentlyViewedPage from "./RecentlyViewed";
import "./ProtectedRecentlyViewedWrapper.css";

const ProtectedRecentlyViewedWrapper = () => {
  const [token, setToken] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("user_token");
    setToken(storedToken);
    setIsChecking(false); // Done checking
  }, []);

  if (isChecking) {
    return (
      <div className="recently-viewed-loading">
        <div className="loader"></div>
        <p>Checking access...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="recently-viewed-unauth">
        <h2>Please log in to view your recently viewed products</h2>
        <p>You must be logged in to access your browsing history.</p>
        <button
          className="login-button"
          onClick={() => window.location.href = "/login"}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return <RecentlyViewedPage />;
};

export default ProtectedRecentlyViewedWrapper;