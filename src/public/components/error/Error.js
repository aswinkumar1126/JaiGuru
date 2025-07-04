import React from "react";
import "./Error.css";

function Error({ error, onRetry }) {
    return (
        <div className="error-container">
            <div className="error-icon">!</div>
            <p>{error?.message || "Something went wrong."}</p>
            <button
                className="retry-button"
                onClick={onRetry || (() => window.location.reload())}
            >
                Retry
            </button>
        </div>
    );
}

export default Error;
