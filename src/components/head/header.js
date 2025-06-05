import React, { useState, useEffect, useCallback, useContext } from 'react';
import { FaBars, FaTimes, FaPalette, FaGlobe, FaEnvelope, FaBell, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { MyContext } from '../../context/themeContext/themeContext';
import SearchBar from '../searchBar/searchBar';
import './header.css';
import logo from '../../assets/logo/logo.jpg';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { themeColor, setThemeColor, themeMode, setThemeMode } = useContext(MyContext);
  const [isHovering, setIsHovering] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const formatDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = String(hours % 12 || 12).padStart(2, '0');
    return `D-${day}/${month}/${year}-T-${formattedHours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    setCurrentDateTime(formatDateTime());
    const interval = setInterval(() => {
      setCurrentDateTime(formatDateTime());
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = useCallback((searchQuery) => {
    console.log('Searching for:', searchQuery);
  }, []);

  const toggleThemeColor = () => {
    const newColor = themeColor === '#f4f4f4' ? '#d1d1d1' : '#f4f4f4';
    setThemeColor(newColor);
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const handleLanguageChange = () => {
    console.log('Language change clicked - Add functionality here');
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`} style={{ '--theme-color': themeColor }}>
      <div className="header-container">
        {/* Left Section - Menu Toggle & App Name */}
        <div className="header-left">
          <motion.button
            className="menu-toggle rounded-circle"
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
          <motion.div className="logo">
            <motion.img
              src={logo}
              alt="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.h1
              className="page-title"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span>BMG Jewelers</span>
            </motion.h1>
          </motion.div>
        </div>

        {/* Center Section - Search */}
        <div className="header-center">
          <SearchBar onSearch={handleSearch} />
        </div>


        {/* Right Section - Date/Time, Icons & User */}
        <div className="header-right part3">
          <span className="date-box">{currentDateTime}</span>
          <motion.button
            className="color-switch rounded-circle"
            onClick={toggleThemeColor}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPalette />
          </motion.button>
          <motion.button
            className="language-btn rounded-circle"
            onClick={handleLanguageChange}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGlobe />
          </motion.button>
          <motion.div className="notification-badge">
            <motion.button
              className="notification-button rounded-circle"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEnvelope />
              <span className="badge">3</span>
            </motion.button>
          </motion.div>
          <motion.div className="notification-badge">
            <motion.button
              className="notification-button rounded-circle"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaBell />
              <span className="badge">5</span>
            </motion.button>
          </motion.div>
          <div className="user-profile myAcc">
            <div className="userImg">
              <div
                className="rounded-circle"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <FaUserCircle />
              </div>
            </div>
            <div className="userInfo">
              <h4>Admin</h4>
            </div>
            {isProfileMenuOpen && (
              <motion.ul
                className="dropdown-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <li className="menu-item">
                  <FaCog /> <span>Profile Settings</span>
                </li>
                <li className="menu-item">
                  <FaSignOutAlt /> <span>Logout</span>
                </li>
              </motion.ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;