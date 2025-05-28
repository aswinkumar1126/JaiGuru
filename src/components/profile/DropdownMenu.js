import React, { useState } from 'react';
import { FiUser, FiLogOut } from 'react-icons/fi';
import ProfileModal from './ProfileModal'; // Adjust import path as needed
import './DropdownMenu.css'; // Separate CSS for dropdown styling
import { useNavigate } from 'react-router-dom';
const DropdownMenu = () => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const navigate=useNavigate();
    const openProfileModal = (e) => {
      navigate('/profile');
    };

    const closeProfileModal = () => {
        setIsProfileModalOpen(false);
    };

    const handleLogout = () => {
        alert('Logout logic here');
        // Add actual logout logic (e.g., clear auth token, redirect to login)
    };

    return (
        <div className="dropdown-menu">
            <ul>
                <li onClick={openProfileModal} className="dropdown-item">
                    <FiUser className="dropdown-icon" />
                    <span >Profile</span>
                </li>
                <li onClick={handleLogout} className="dropdown-item">
                    <FiLogOut className="dropdown-icon" />
                    <span>Logout</span>
                </li>
            </ul>
            {isProfileModalOpen && <ProfileModal onClose={closeProfileModal} />}
        </div>
    );
};

export default DropdownMenu;