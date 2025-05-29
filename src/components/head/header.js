import React, { useState, useEffect, useCallback } from 'react';
import { FaBars, FaTimes,  FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import SearchBar from '../searchBar/searchBar';
import './header.css';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [scrolled, setScrolled] = useState(false);
   
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    const handleSearch = useCallback((searchQuery) => {
        console.log('Searching for:', searchQuery);
        // Add your search logic here
    }, []);

    const getPageTitle = useCallback(() => {
        const path = location.pathname.split('/')[1];
        if (!path) return 'Dashboard';

        const titleMap = {
            'product': 'Product Management',
            'settings': 'System Settings',
            'analytics': 'Performance Analytics'
        };

        return titleMap[path] ||
            path.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
    }, [location.pathname]);

   

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
                {/* Left Section - Menu Toggle & Page Title */}
                <div className="header-left">
                    <motion.button
                        className="menu-toggle"
                        onClick={toggleSidebar}
                        aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
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
                                    <FaTimes />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="open"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaBars />
                                </motion.span>
                            )}
                        </AnimatePresence>
                        {isHovering && (
                            <motion.span
                                className="tooltip"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                            >
                                {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
                            </motion.span>
                        )}
                    </motion.button>

                    <motion.h1
                        className="page-title"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {getPageTitle()}
                    </motion.h1>
                </div>

                {/* Center Section - Search */}
                <div className="header-center">
                    <SearchBar onSearch={handleSearch} />
                </div>

                {/* Right Section - Actions & User */}
                <div className="header-right">
                   

                    <div className="user-profile">
                        <div className="avatar">
                            <FaUserCircle />
                        </div>
                        <div className="user-info">
                            <span className="user-name">Admin User</span>
                            <span className="user-role">Administrator</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;