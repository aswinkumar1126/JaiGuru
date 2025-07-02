import React from 'react';
import './Header.css'; 

const TopBar = ({ announcement }) => {
    return (
        <div className="public-top-bar-container">
            <div className="public-top-bar">
                <div className="public-top-bar-text">
                    {announcement}
                </div>
            </div>
        </div>
    );
};

export default TopBar;