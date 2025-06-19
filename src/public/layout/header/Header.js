import { NavLink, Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo/weblogo.png';
import Search from '../../components/search/Search';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Header.css';
import {
    FaShoppingCart,
    FaHeart,
    FaUserCircle,
    FaChevronDown,
    FaBars,
    FaTimes,
    FaSignOutAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hook/cart/useCartQuery';
import { useFavorites } from '../../hook/favorites/useFavoritesQuery';
import { useAuth } from '../../context/authContext/UserAuthContext';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const location = useLocation();
    const [showNav, setShowNav] = useState(true);
    const lastScrollY = useRef(0);
    const navRef = useRef(null);
    const profileMenuRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isAuthenticated = !!user;
    const username = user?.username || null;

    const { cartItems, error: cartError } = useCart({ enabled: isAuthenticated });
    const { data: favoritesData, error: favoritesError, refetch: refetchFavorites } = useFavorites({ enabled: isAuthenticated });

    useEffect(() => {
        if (isAuthenticated) {
            refetchFavorites();
        }
    }, [isAuthenticated, refetchFavorites]);

    useEffect(() => {
        if (cartError?.response?.status === 401 || favoritesError?.response?.status === 401) {
            logout();
            navigate("/login");
        }
    }, [cartError, favoritesError, navigate, logout]);

    const cartList = isAuthenticated && Array.isArray(cartItems?.data) ? cartItems.data : [];
    const cartCount = cartList.length;
    const wishlistCount = isAuthenticated && Array.isArray(favoritesData?.data) ? favoritesData.data.length : 0;

    const handleProfileClick = useCallback(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            setIsProfileMenuOpen((prev) => !prev);
        }
    }, [navigate, isAuthenticated]);

    const handleLogout = useCallback(() => {
        logout();
        setIsProfileMenuOpen(false);
        navigate("/login");
    }, [logout, navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
            if (navRef.current && !navRef.current.contains(event.target) &&
                (!dropdownRef.current || !dropdownRef.current.contains(event.target))) {
                setIsMobileMenuOpen(false);
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const debounce = useCallback((func, wait) => {
        let timeout;
        return (...args) => {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setShowNav(currentScrollY <= lastScrollY.current || currentScrollY <= 100);
            setIsScrolled(currentScrollY > 50);
            lastScrollY.current = currentScrollY;
        };

        const handleResize = debounce(() => {
            const isNowMobile = window.innerWidth <= 992;
            setIsMobile(isNowMobile);
            if (!isNowMobile) {
                setIsMobileMenuOpen(false);
                setActiveDropdown(null);
                setIsProfileMenuOpen(false);
            }
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [debounce]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    }, [location.pathname]);

    const toggleDropdown = useCallback((menu) => {
        setActiveDropdown((prev) => (prev === menu ? null : menu));
    }, []);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    }, []);

    const navItems = [
        { name: 'HOME', path: '/home' },
        { name: 'PRODUCTS', path: '/products' },
        { name: 'ABOUT US', path: '/about' },
        { name: 'WHY US', path: '/why-us' },
        { name: 'GALLERY', path: '/gallery' },
        { name: 'VIDEOS', path: '/videos' },
        { name: 'CONTACT US', path: '/contact' }
    ];

    const isActive = useCallback((path, submenu = []) => {
        const currentPath = location.pathname;
        return submenu.length ? currentPath.startsWith(path) : currentPath === path;
    }, [location.pathname]);

    return (
        <header className={`header-container ${isScrolled ? 'scrolled' : ''}`}>
            <div className="main-header">
                <div className="main-header-content">
                    <div className="header-left">
                        <motion.div
                            className="logo-container"
                            whileHover={{ scale: isMobile ? 1 : 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Link to="/home" onClick={closeMobileMenu} aria-label="Home">
                                <motion.img
                                    src={Logo}
                                    alt="BMG Jewellers Logo"
                                    loading="lazy"
                                    className="logo-img"
                                    whileHover={{ rotate: isMobile ? 0 : 5 }}
                                    transition={{ type: 'spring', damping: 15 }}
                                />
                            </Link>
                            <span className="logo-text">
                                <pre>BMG Jewellers{'\n'}<span className="sub-logotext">Private Limited</span></pre>
                            </span>
                        </motion.div>
                    </div>

                    {!isMobile && (
                        <div className="header-middle">
                            <div className="search-bar-wrapper">
                                <Search />
                            </div>
                        </div>
                    )}

                    <div className="header-right">
                        {isAuthenticated && (
                            <>
                                <motion.div
                                    className="wishlist-container"
                                    whileHover={{ scale: isMobile ? 1 : 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/wishlist"
                                        className="wishlist-button"
                                        aria-label="Wishlist"
                                        onClick={closeMobileMenu}
                                    >
                                        <motion.div
                                            animate={isMobile ? {} : { scale: [1, 1.1, 1] }}
                                            transition={{ repeat: isMobile ? 0 : Infinity, duration: 2 }}
                                        >
                                            <FaHeart className="wishlist-icon" />
                                        </motion.div>
                                        <span className="wishlist-text">Wishlist</span>
                                        {wishlistCount > 0 && (
                                            <motion.span
                                                className="wishlist-badge"
                                                animate={isMobile ? {} : { scale: [1, 1.2, 1] }}
                                                transition={{ repeat: isMobile ? 0 : Infinity, duration: 2 }}
                                            >
                                                {wishlistCount}
                                            </motion.span>
                                        )}
                                    </Link>
                                </motion.div>

                                <motion.div
                                    className="cart-container"
                                    whileHover={{ scale: isMobile ? 1 : 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <NavLink
                                        to="/cart"
                                        className="cart-button"
                                        aria-label="Shopping Cart"
                                        onClick={closeMobileMenu}
                                    >
                                        <motion.div
                                            animate={isMobile ? {} : { rotate: [0, 10, -10, 0] }}
                                            transition={{ repeat: isMobile ? 0 : Infinity, repeatDelay: 5, duration: 2 }}
                                        >
                                            <FaShoppingCart className="cart-icon" />
                                        </motion.div>
                                        <span className="cart-text">Cart</span>
                                        {cartCount > 0 && (
                                            <motion.span
                                                className="cart-badge"
                                                animate={isMobile ? {} : { scale: [1, 1.2, 1] }}
                                                transition={{ repeat: isMobile ? 0 : Infinity, duration: 2 }}
                                            >
                                                {cartCount}
                                            </motion.span>
                                        )}
                                    </NavLink>
                                </motion.div>
                            </>
                        )}

                        <motion.div
                            className="profile-icon-wrapper"
                            whileHover={{ scale: isMobile ? 1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            ref={profileMenuRef}
                        >
                            <button
                                className="profile-icon-button"
                                onClick={handleProfileClick}
                                aria-label="User profile menu"
                                aria-expanded={isProfileMenuOpen}
                                aria-haspopup="true"
                            >
                                <FaUserCircle className="profile-icon" />
                                <span>{username || 'Guest'}</span>
                            </button>
                            {isAuthenticated && (
                                <AnimatePresence>
                                    {isProfileMenuOpen && (
                                        <motion.ul
                                            className="profile-menu"
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                            aria-label="Profile options"
                                            role="menu"
                                        >
                                            <motion.li
                                                whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                                                role="none"
                                            >
                                                <NavLink
                                                    to="/user/profile"
                                                    className="dropdown-link"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                    role="menuitem"
                                                >
                                                    Profile
                                                </NavLink>
                                            </motion.li>
                                            <motion.li
                                                whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                                                role="none"
                                            >
                                                <button
                                                    className="dropdown-link"
                                                    onClick={handleLogout}
                                                    role="menuitem"
                                                >
                                                    <FaSignOutAlt className="inline-icon" /> Logout
                                                </button>
                                            </motion.li>
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            )}
                        </motion.div>
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="main-navigation"
                        >
                            {isMobileMenuOpen ? <FaTimes className="menu-icon" /> : <FaBars className="menu-icon" />}
                        </button>
                    </div>
                </div>
            </div>

            <nav
                id="main-navigation"
                className={`nav-links ${isMobileMenuOpen ? 'active' : ''} ${isScrolled ? 'scrolled' : ''} ${showNav ? 'show' : 'hide'}`}
                ref={navRef}
                aria-label="Main navigation"
            >
                {isMobile && (
                    <div className="mobile-search-container">
                        <Search />
                    </div>
                )}
                <ul className="nav-list">
                    {navItems.map((item) => (
                        <li
                            key={item.name}
                            className={`nav-item ${isActive(item.path, item.submenu) ? 'active-nav-item' : ''} ${activeDropdown === item.name ? 'active-dropdown' : ''}`}
                            onMouseEnter={() => !isMobile && item.submenu && toggleDropdown(item.name)}
                            onMouseLeave={() => !isMobile && setActiveDropdown(null)}
                        >
                            <NavLink
                                to={item.path}
                                end
                                onClick={(e) => {
                                    if (isMobile && item.submenu) {
                                        e.preventDefault();
                                        toggleDropdown(item.name);
                                    } else {
                                        closeMobileMenu();
                                    }
                                }}
                                className={({ isActive }) => (isActive ? 'active-nav-link' : '')}
                                aria-haspopup={item.submenu ? 'true' : 'false'}
                                aria-expanded={activeDropdown === item.name}
                            >
                                {item.name}
                                {item.submenu && <FaChevronDown className="dropdown-arrow" />}
                                <span className="nav-hover-indicator"></span>
                            </NavLink>

                            {item.submenu && (
                                <div
                                    className="dropdown-container"
                                    onMouseEnter={() => !isMobile && setActiveDropdown(item.name)}
                                    onMouseLeave={() => !isMobile && setActiveDropdown(null)}
                                    ref={dropdownRef}
                                >
                                    <AnimatePresence>
                                        {activeDropdown === item.name && (
                                            <motion.ul
                                                className="dropdown-menu"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                aria-label={`${item.name} submenu`}
                                                role="menu"
                                            >
                                                {item.submenu.map((subItem) => (
                                                    <motion.li
                                                        key={subItem}
                                                        whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                                                        onClick={closeMobileMenu}
                                                        role="none"
                                                    >
                                                        <NavLink
                                                            to={`${item.path}/${subItem.toLowerCase()}`}
                                                            className={({ isActive }) =>
                                                                `dropdown-link ${isActive ? 'active-subnav-link' : ''}`
                                                            }
                                                            role="menuitem"
                                                        >
                                                            {subItem}
                                                        </NavLink>
                                                    </motion.li>
                                                ))}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Header;