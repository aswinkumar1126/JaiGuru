import React from 'react';
import { useAuth } from '../../context/auth/authContext'; // ✅ Correct import
import './EmployeeProfile.css';

const EmployeeProfile = () => {
    const { user } = useAuth(); // ✅ logged-in user directly from context

    console.log(user);
    if (!user) {
        return <div className="profile-container">Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                
                <div className="profile-details">
                    <h2>{user.username || 'N/A'}</h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.contactNumber}</p>
                    <p><strong>Role:</strong> {user.roles[0]|| 'Employee'}</p>
                    <p><strong>Status:</strong> {user.status}</p>
                    <p><strong>Joined On:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;
