import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaEnvelope,
  FaGlobe
} from 'react-icons/fa';
import {
  MdDarkMode,
  MdOutlineLightMode,
  MdOutlineMenu,
  MdMenuOpen,
  MdColorLens
} from 'react-icons/md';
import { MyContext } from '../../context/themeContext/themeContext';
import logo from '../../assets/logo/logo.jpg';
import './header.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/authContext';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { themeMode, setThemeMode, themeColor, setThemeColor } = useContext(MyContext);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isEmailMenuOpen, setIsEmailMenuOpen] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const profileMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const emailMenuRef = useRef(null);
  const colorMenuRef = useRef(null);

  const { logout } = useAuth();

  const changeThemeColor = (color) => {
    setThemeColor(color);
    setIsColorMenuOpen(false);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();
      const formattedDate = date.toLocaleDateString('en-GB');
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentDateTime(`D:${formattedDate}-T:${formattedTime}`);
    };

    const interval = setInterval(updateDateTime, 1000);
    updateDateTime();
    return () => clearInterval(interval);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setIsNotificationMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
      if (emailMenuRef.current && !emailMenuRef.current.contains(event.target)) {
        setIsEmailMenuOpen(false);
      }
      if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) {
        setIsColorMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
  };

  const toggleThemeMode = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className={`header ${scrolled ? 'scrolled' : ''} ${themeMode === 'dark' ? 'dark' : 'light'}`}
      style={{
        backgroundColor: themeMode === 'dark' ? 'var(--sidebar-dark-bg)' : 'var(--sidebar-light-bg)'
      }}
    >
      <div className="header-container">
        {/* Left Section - Logo & Menu Toggle */}
        <div className="header-left">
          <button
            className="menu-toggle"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {isSidebarOpen ? <MdMenuOpen /> : <MdOutlineMenu />}
          </button>

          <div className="logo">
            <img src={logo} alt="BMG Jewelers Logo" className="logo-image" />
            <h1 className="company-name">BMG Jewelers</h1>
          </div>
        </div>

        {/* Center Section - Search & Date */}
        <div className="header-center">
          <div className="search-container">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>

          {!isMobile && (
            <div className="date-time-container">
              <input
                type="text"
                value={currentDateTime}
                readOnly
                className="date-box"
              />
            </div>
          )}
        </div>

        {/* Right Section - Icons & User */}
        <div className="header-right">
          {/* Theme Color Picker */}
          <div className="dropdown-wrapper" ref={colorMenuRef}>
            <button
              className="icon-button"
              onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
              aria-label="Change theme color"
              style={{ backgroundColor: themeColor }}
            >
              <MdColorLens />
            </button>

            <AnimatePresence>
              {isColorMenuOpen && (
                <motion.div
                  className="dropdown-menu color-menu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="dropdown-header">Theme Color</div>
                  <div className="color-options">
                    {['#f4f4f4', '#3f51b5', '#4caf50', '#ff9800', '#e91e63', '#9c27b0'].map((color) => (
                      <button
                        key={color}
                        className="color-option"
                        style={{ backgroundColor: color }}
                        onClick={() => changeThemeColor(color)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            className="icon-button"
            onClick={toggleThemeMode}
            aria-label="Toggle theme"
          >
            {themeMode === 'light' ? <MdDarkMode /> : <MdOutlineLightMode />}
          </button>

          {/* Language Selector */}
          <div className="dropdown-wrapper" ref={languageMenuRef}>
            <button
              className="icon-button"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              aria-label="Change language"
            >
              <FaGlobe />
            </button>

            <AnimatePresence>
              {isLanguageMenuOpen && (
                <motion.div
                  className="dropdown-menu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <button onClick={() => changeLanguage('en')}>
                    English
                  </button>
                  <button onClick={() => changeLanguage('ta')}>
                    Tamil
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Email */}
          <div className="dropdown-wrapper" ref={emailMenuRef}>
            <button
              className="icon-button"
              onClick={() => setIsEmailMenuOpen(!isEmailMenuOpen)}
              aria-label="Email"
            >
              <FaEnvelope />
            </button>

            <AnimatePresence>
              {isEmailMenuOpen && (
                <motion.div
                  className="dropdown-menu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="dropdown-header">Messages</div>
                  <div className="dropdown-item">
                    <div className="message-preview">
                      <strong>New order received</strong>
                      <small>2 minutes ago</small>
                    </div>
                  </div>
                  <div className="dropdown-footer">
                    <button>View all messages</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="dropdown-wrapper" ref={notificationMenuRef}>
            <button
              className="icon-button"
              onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
              aria-label="Notifications"
            >
              <FaBell />
              <span className="badge">5</span>
            </button>

            <AnimatePresence>
              {isNotificationMenuOpen && (
                <motion.div
                  className="dropdown-menu notification-menu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="dropdown-header">
                    Notifications
                    <button className="settings-button">
                      <FaCog />
                    </button>
                  </div>
                  <div className="dropdown-item">
                    <div className="notification-preview">
                      <div className="notification-icon">
                        <FaUserCircle />
                      </div>
                      <div className="notification-content">
                        <strong>New user registered</strong>
                        <small>5 minutes ago</small>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-footer">
                    <button>View all notifications</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="dropdown-wrapper profile-dropdown" ref={profileMenuRef}>
            <button
              className="profile-button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-label="User profile"
            >
              <div className="profile-avatar">
                <FaUserCircle />
              </div>
              {!isMobile && (
                <div className="profile-info">
                  <span className="profile-name">Admin</span>
                  <span className="profile-role">Super Admin</span>
                </div>
              )}
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  className="dropdown-menu profile-menu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="dropdown-header">User Profile</div>
                  <button className="dropdown-item" onClick={() => navigate('/profile')}>
                    <FaUserCircle className="menu-icon" />
                    <span>My Profile</span>
                  </button>

                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <FaSignOutAlt className="menu-icon" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;