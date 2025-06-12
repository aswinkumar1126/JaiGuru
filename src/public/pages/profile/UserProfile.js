import React, { useEffect } from 'react';
import { useCurrentProfile } from '../../hook/userProfile/useUserProfileQuery';
import './UserProfile.css';

const UserProfile = () => {
    const { data: user, isLoading, error } = useCurrentProfile();

    useEffect(() => {
        if (user?.contactNumber) {
            localStorage.setItem('userMobileNumber', user.contactNumber);
        }
    }, [user]);

    if (isLoading) return (
        <div className="profile-container">
            <div className="profile-card loading">
                <div className="profile-skeleton"></div>
            </div>
        </div>
    );

    if (error || !user) return (
        <div className="profile-container">
            <div className="profile-card error">
                <h2>Failed to load profile</h2>
                <p>{error?.message || 'Please try again later'}</p>
            </div>
        </div>
    );

    return (
        <div className="profile-container">            
            <div className="profile-card">
                
                <div className="profile-avatar">
                    <div className="avatar-circle">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                </div>
                <div className="profile-details">
                    <h2>
                        Profile Page
                    </h2><br />
                    <h3>{user.username || 'N/A'}</h3>
                    <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{user.email}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{user.contactNumber || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Role:</span>
                        <span className="detail-value">{user.roles?.[0] || 'Employee'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className={`status-badge ${user.status?.toLowerCase()}`}>
                            {user.status}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Joined On:</span>
                        <span className="detail-value">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;