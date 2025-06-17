import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaEnvelope,
  FaGlobe,
} from 'react-icons/fa';
import {
  MdDarkMode,
  MdOutlineLightMode,
  MdOutlineMenu,
  MdMenuOpen,
} from 'react-icons/md';
import { MyContext } from '../../context/themeContext/themeContext';
import logo from '../../assets/logo/logo.jpg';
import './NewAdminHeader.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/authContext';
import { useUserProfile } from '../../hooks/profile/useUserProfile';

const NewAdminHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const { themeMode, setThemeMode } = useContext(MyContext);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024); // Adjusted to 1024px
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const { data: user } = useUserProfile();

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const languageRef = useRef(null);
  const emailRef = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update date and time
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
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
      if (emailRef.current && !emailRef.current.contains(event.target)) {
        setIsEmailOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className={`new-header ${scrolled ? 'scrolled' : ''} ${themeMode}`}
    >
      <div className="new-header-container">
        {/* Left: Logo & Name */}
        <div className="new-header-left">
          <button
            className="new-menu-toggle"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {isSidebarOpen ? <MdMenuOpen /> : <MdOutlineMenu />}
          </button>
          <div className="new-logo">
            <img src={logo} alt="BMG Jewelers Logo" className="new-logo-image" />
            <h1 className="new-company-name">BMG Jewelers <span>pvt ltd</span></h1>
          </div>
        </div>

        {/* Center: Search & Date-Time */}
        <div className="new-header-center">
         
          {!isMobile && (
            <div className="new-date-time-container">
              <input
                type="text"
                value={currentDateTime}
                readOnly
                className="new-date-box"
              />
            </div>
          )}
        </div>

        {/* Right: Icons & Profile */}
        <div className="new-header-right">
          <button
            className="new-icon-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {themeMode === 'light' ? <MdDarkMode /> : <MdOutlineLightMode />}
          </button>

          <div className="new-dropdown-wrapper" ref={languageRef}>
            <button
              className="new-icon-button"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              aria-label="Change language"
            >
              <FaGlobe />
            </button>
            <AnimatePresence>
              {isLanguageOpen && (
                <motion.div
                  className="new-dropdown-menu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <button onClick={() => changeLanguage('en')}>English</button>
                  <button onClick={() => changeLanguage('ta')}>Tamil</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="new-dropdown-wrapper" ref={emailRef}>
            <button
              className="new-icon-button"
              onClick={() => setIsEmailOpen(!isEmailOpen)}
              aria-label="Email"
            >
              <FaEnvelope />
            </button>
            <AnimatePresence>
              {isEmailOpen && (
                <motion.div
                  className="new-dropdown-menu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="new-dropdown-header">Messages</div>
                  <div className="new-dropdown-item">
                    <div className="new-message-preview">
                      <strong>New order received</strong>
                      <small>2 minutes ago</small>
                    </div>
                  </div>
                  <div className="new-dropdown-footer">
                    <button>View all messages</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="new-dropdown-wrapper" ref={notificationsRef}>
            <button
              className="new-icon-button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label="Notifications"
            >
              <FaBell />
              <span className="new-badge">5</span>
            </button>
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  className="new-dropdown-menu new-notification-menu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="new-dropdown-header">
                    Notifications
                    <button className="new-settings-button">
                      <FaCog />
                    </button>
                  </div>
                  <div className="new-dropdown-item">
                    <div className="new-notification-preview">
                      <div className="new-notification-icon">
                        <FaUserCircle />
                      </div>
                      <div className="new-notification-content">
                        <strong>New user registered</strong>
                        <small>5 minutes ago</small>
                      </div>
                    </div>
                  </div>
                  <div className="new-dropdown-footer">
                    <button>View all notifications</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="new-dropdown-wrapper new-profile-dropdown" ref={profileRef}>
            <button
              className="new-profile-button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="User profile"
            >
              <div className="new-profile-avatar">
                <FaUserCircle />
              </div>
              {!isMobile && (
                <span className="new-profile-name">{user?.username || 'User'}</span>
              )}
            </button>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  className="new-dropdown-menu new-profile-menu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="new-dropdown-header">User Profile</div>
                  <button
                    className="new-dropdown-item"
                    onClick={() => {
                      navigate('/admin/profile');
                      setIsProfileOpen(false);
                    }}
                  >
                    <FaUserCircle className="new-menu-icon" />
                    My Profile
                  </button>
                  <div className="new-dropdown-divider"></div>
                  <button className="new-dropdown-item" onClick={handleLogout}>
                    <FaSignOutAlt className="new-menu-icon" />
                    Logout
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

export default NewAdminHeader;