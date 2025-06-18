import React from 'react';

const ProfileTab = ({ user }) => (
    <section className="profile-section">
        <div className="section-header">
            <h2>Personal Information</h2>
            <button className="edit-button">Edit Profile</button>
        </div>

        <div className="info-grid">
            <div className="info-card">
                <h3>Basic Information</h3>
                <div className="info-row">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{user.username || 'Not provided'}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user.email}</span>
                </div>
            </div>

            <div className="info-card">
                <h3>Contact Details</h3>
                <div className="info-row">
                    <span className="info-label">Mobile Number</span>
                    <span className="info-value">{user.contactNumber || 'Not provided'}</span>
                </div>
            </div>

            <div className="info-card">
                <h3>Account Status</h3>
                <div className="info-row">
                    <span className="info-label">Status</span>
                    <span className={`info-value status ${user.status?.toLowerCase()}`}>
                        {user.status}
                    </span>
                </div>
            </div>
        </div>
    </section>
);

export default ProfileTab;
