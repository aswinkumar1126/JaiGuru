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
import { debounce } from 'lodash';

const NewAdminHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const { themeMode, setThemeMode } = useContext(MyContext);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const { data: user, isLoading } = useUserProfile();

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const languageRef = useRef(null);
  const emailRef = useRef(null);

  // Debounced resize handler
  useEffect(() => {
    const handleResize = debounce(() => setIsMobile(window.innerWidth <= 1024), 100);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = debounce(() => setScrolled(window.scrollY > 20), 100);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, []);

  // Date and time update
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

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      navigate(`/admin/search?query=${encodeURIComponent(query)}`);
    }
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
    navigate('/admin/login');
  };

  if (isLoading) {
    return <div className="header-loading">Loading...</div>;
  }

  return (
    <header
      className={`new-header ${scrolled ? 'scrolled' : ''} ${themeMode}`}
      role="banner"
      aria-label="Admin Header"
    >
      <div className="new-header-container">
        {/* Left: Logo & Name */}
        <div className="new-header-left">
          <button
            className="new-menu-toggle"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleSidebar()}
          >
            {isSidebarOpen ? <MdMenuOpen /> : <MdOutlineMenu />}
          </button>
          <div className="new-logo">
            <img src={logo} alt="BMG Jewelers Logo" className="new-logo-image" />
            <h1 className="new-company-name">
              BMG Jewelers <span>pvt ltd</span>
            </h1>
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
                aria-label="Current date and time"
              />
            </div>
          )}
        </div>

        {/* Right: Icons & Profile */}
        <div className="new-header-right">
          <button
            className="new-icon-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleTheme()}
          >
            {themeMode === 'light' ? <MdDarkMode /> : <MdOutlineLightMode />}
          </button>

          <div className="new-dropdown-wrapper" ref={languageRef}>
            <button
              className="new-icon-button"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              aria-label="Change language"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsLanguageOpen(!isLanguageOpen)}
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
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <button onClick={() => changeLanguage('en')} tabIndex={0}>
                    English
                  </button>
                  <button onClick={() => changeLanguage('ta')} tabIndex={0}>
                    Tamil
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="new-dropdown-wrapper" ref={emailRef}>
            <button
              className="new-icon-button"
              onClick={() => setIsEmailOpen(!isEmailOpen)}
              aria-label="Messages"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsEmailOpen(!isEmailOpen)}
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
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <div className="new-dropdown-header">Messages</div>
                  <div className="new-dropdown-item">
                    <div className="new-message-preview">
                      <strong>Coming Soon</strong>
                      <small>Messages feature under development</small>
                    </div>
                  </div>
                  <div className="new-dropdown-footer">
                    <button tabIndex={0}>View all messages</button>
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
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsNotificationsOpen(!isNotificationsOpen)}
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
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <div className="new-dropdown-header">
                    Notifications
                    <button className="new-settings-button" aria-label="Notification settings" tabIndex={0}>
                      <FaCog />
                    </button>
                  </div>
                  <div className="new-dropdown-item">
                    <div className="new-notification-preview">
                      <div className="new-notification-icon">
                        <FaUserCircle />
                      </div>
                      <div className="new-notification-content">
                        <strong>Coming Soon</strong>
                        <small>Notifications feature under development</small>
                      </div>
                    </div>
                  </div>
                  <div className="new-dropdown-footer">
                    <button tabIndex={0}>View all notifications</button>
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
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsProfileOpen(!isProfileOpen)}
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
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <div className="new-dropdown-header">User Profile</div>
                  <button
                    className="new-dropdown-item"
                    onClick={() => {
                      navigate('/admin/profile');
                      setIsProfileOpen(false);
                    }}
                    tabIndex={0}
                  >
                    <FaUserCircle className="new-menu-icon" />
                    My Profile
                  </button>
                  <div className="new-dropdown-divider"></div>
                  <button className="new-dropdown-item" onClick={handleLogout} tabIndex={0}>
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