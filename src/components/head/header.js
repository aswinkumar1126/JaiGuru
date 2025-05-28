import React, { useState, useEffect, useCallback } from 'react';
import { FaBars, FaTimes, FaUserCircle, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import './header.css';
import DropdownMenu from '../profile/DropdownMenu';

const Header = ({ adminName, toggleSidebar, isSidebarOpen }) => {
    const [showModal, setShowModal] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isAvatarHovering, setIsAvatarHovering] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        setSearchQuery('');
        setSearchOpen(false);
    }, [searchQuery]);

    const getPageTitle = useCallback(() => {
        const path = location.pathname.split('/')[1];
        return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard';
    }, [location.pathname]);

    const toggleDropdown = useCallback((e) => {
        e.stopPropagation();
        setShowModal((prev) => !prev);
    }, []);

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`} role="banner" aria-label="Main navigation">
            <div className="header-left">
                <motion.button
                    className="toggle-button"
                    onClick={toggleSidebar}
                    aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <AnimatePresence mode="wait">
                        {isSidebarOpen ? (
                            <motion.span
                                key="close"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FaTimes aria-hidden="true" />
                            </motion.span>
                        ) : (
                            <motion.span
                                key="open"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FaBars aria-hidden="true" />
                            </motion.span>
                        )}
                    </AnimatePresence>
                    {isHovering && (
                        <motion.span
                            className="toggle-tooltip"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
                        </motion.span>
                    )}
                </motion.button>

                <motion.div
                    className="page-title"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {getPageTitle()}
                </motion.div>
            </div>

            <div className="header-center">
                <AnimatePresence>
                    {searchOpen && (
                        <motion.form
                            className="search-form"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '100%', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleSearch}
                            role="search"
                        >
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                aria-label="Search input"
                            />
                            <button type="submit" aria-label="Submit search">
                                <FaSearch aria-hidden="true" />
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>

            <div className="header-right">
                <button
                    className="search-button"
                    onClick={() => setSearchOpen(!searchOpen)}
                    aria-label={searchOpen ? 'Close search' : 'Open search'}
                    aria-expanded={searchOpen}
                >
                    <FaSearch aria-hidden="true" />
                </button>

                <motion.div
                    className="user-profile"
                    role="button"
                    tabIndex={0}
                    onClick={toggleDropdown}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleDropdown(e);
                        }
                    }}
                    aria-label={`Profile for ${adminName}`}
                    aria-expanded={showModal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => setIsAvatarHovering(true)}
                    onMouseLeave={() => setIsAvatarHovering(false)}
                >
                    <AnimatePresence>
                        {window.innerWidth > 768 && (
                            <motion.div
                                className="user-info"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.span
                                    className="welcome-text"
                                    animate={isAvatarHovering ? { x: 2 } : { x: 0 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    Welcome back,
                                </motion.span>
                                <motion.span
                                    className="admin-name"
                                    animate={
                                        isAvatarHovering
                                            ? { x: 2, color: 'var(--accent-color)' }
                                            : { x: 0, color: 'var(--text-color)' }
                                    }
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    {adminName}
                                </motion.span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        className="avatar-container"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <motion.img
                            src="https://i.pravatar.cc/40"
                            alt={`${adminName}'s profile avatar`}
                            className="avatar"
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'block';
                            }}
                            animate={isAvatarHovering ? { rotate: 5 } : { rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        />
                        <FaUserCircle className="avatar-fallback" style={{ display: 'none' }} />
                    </motion.div>
                </motion.div>
            </div>

            {showModal && (
                <DropdownMenu>
                    <button onClick={() => navigate('/profile')}>Profile</button>
                    <button>Logout</button>
                </DropdownMenu>
            )}
        </header>
    );
};

export default Header;