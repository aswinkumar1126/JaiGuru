import React from 'react';
import './ProfileModal.css'; // Use the provided CSS

const ProfileModal = ({ onClose }) => {
    const handleLogout = () => {
        alert('Logout logic here');
        // Add actual logout logic (e.g., clear auth token, redirect)
        onClose(); // Close modal after logout
    };

    const handleProfile = () => {
        alert('Profile action (e.g., edit or refresh profile) here');
        // Add logic for profile actions if needed
    };

    return (
        <div className="profile-modal-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={e => e.stopPropagation()}>
                <h3>Admin Profile</h3>
                <div className="profile-details">
                    <p><strong>Name:</strong> Admin Name</p>
                    <p><strong>Email:</strong> admin@bmgjewelers.com</p>
                    <p><strong>Role:</strong> Administrator</p>
                    <p><strong>Joined Date:</strong> January 15, 2020</p>
                    <p><strong>Contact Number:</strong> +91 98765 43210</p>
                    <p><strong>Department:</strong> Management</p>
                    <p><strong>Location:</strong> Mumbai, India</p>
                </div>
                <div className="profile-modal-buttons">
                    <button className="profile-modal-button profile" onClick={handleProfile}>
                        Profile
                    </button>
                    <button className="profile-modal-button logout" onClick={handleLogout}>
                        Logout
                    </button>
                    <button className="profile-modal-button close" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;