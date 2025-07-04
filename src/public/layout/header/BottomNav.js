import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaSearch, FaShoppingCart } from 'react-icons/fa';
import './Header.css';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { icon: <FaHome />, path: '/home', label: 'Home' },
        { icon: <FaUser />, path: '/user/profile', label: 'Profile' },
        { icon: <FaSearch />, path: '/search', label: 'Search' },
        { icon: <FaShoppingCart />, path: '/cart', label: 'Cart' },
    ];

    return (
        <nav className="public-bottom-nav">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `public-bottom-nav-item ${isActive ? 'public-bottom-nav-active' : ''}`
                    }
                >
                    {item.icon}
                    <span className="public-bottom-nav-label">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNav;