import React from 'react';
import './Header.css';

const TopBar = ({ announcement, className }) => {
    return (
        <div className={`public-top-bar ${className}`}>
            <div className="public-top-bar-content">
                <div className="public-top-bar-text">
                    <span className="public-top-bar-announcement">{announcement}</span>
                </div>
            </div>
        </div>
    );
};

export default TopBar;