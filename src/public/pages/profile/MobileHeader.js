import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const MobileHeader = ({ isScrolled, mobileMenuOpen, setMobileMenuOpen, username }) => (
    <header className={`mobile-header ${isScrolled ? 'scrolled' : ''}`}>
        <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
        >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <h1>My Account</h1>
        <div className="mobile-user-avatar">
            {username?.charAt(0).toUpperCase()}
        </div>
    </header>
);

export default MobileHeader;
