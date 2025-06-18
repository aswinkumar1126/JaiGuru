import React from 'react';
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiLogOut } from 'react-icons/fi';

const ProfileSidebar = ({ user, activeTab, setActiveTab, setMobileMenuOpen, onLogout }) => (
    <aside className={`profile-sidebar`}>
        <div className="user-card">
            <div className="user-avatar">{user.username?.charAt(0).toUpperCase()}</div>
            <div className="user-details">
                <h3>{user.username}</h3>
                <p>{user.email}</p>
            </div>
        </div>

        <nav className="profile-navigation">
            {[
                { id: 'profile', label: 'Profile', icon: <FiUser /> },
                { id: 'orders', label: 'My Orders', icon: <FiShoppingBag /> },
                { id: 'saved', label: 'Saved Items', icon: <FiHeart /> },
                { id: 'address', label: 'Addresses', icon: <FiMapPin /> }
            ].map(({ id, label, icon }) => (
                <button
                    key={id}
                    className={`nav-item ${activeTab === id ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab(id);
                        setMobileMenuOpen(false);
                    }}
                >
                    {icon} {label}
                </button>
            ))}

            <button className="nav-item logout" onClick={onLogout}>
                <FiLogOut className="nav-icon" /> Log Out
            </button>
        </nav>
    </aside>
);

export default ProfileSidebar;
