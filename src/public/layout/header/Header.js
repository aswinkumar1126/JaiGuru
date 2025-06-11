import { NavLink, Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo/weblogo.png';
import Search from '../../components/search/Search';
import React, { useEffect, useState } from 'react';
import './Header.css';
import {
    FaShoppingCart, FaChevronDown, FaBars, FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    const location = useLocation();
    const [showNav, setShowNav] = useState(true);
    const lastScrollY = useRef(window.scrollY);
    const navRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 50);

            if (currentScrollY > lastScrollY.current) {
                setShowNav(false);
            } else {
                setShowNav(true);
            }

            lastScrollY.current = currentScrollY;
        };

        const handleResize = () => {
            const isNowMobile = window.innerWidth < 992;
            setIsMobile(isNowMobile);

            if (!isNowMobile) {
                setIsMobileMenuOpen(false);
                setActiveDropdown(null);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [location.pathname]);

    const toggleDropdown = (menu) => {
        if (isMobile) {
            setActiveDropdown(activeDropdown === menu ? null : menu);
        } else {
            setActiveDropdown(menu);
        }
    };

    const closeDropdown = () => {
        if (!isMobile) {
            setActiveDropdown(null);
        }
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    };

    const navItems = [
        { name: 'HOME', path: '/' },
        {
            name: 'CATEGORY',
            path: '/category',
            submenu: ['Rings', 'Necklaces', 'Bracelets', 'Earrings']
        },
        { name: 'PRODUCTS', path: '/products' },
        { name: 'ABOUT US', path: '/about' },
        { name: 'WHY US', path: '/why-us' },
        { name: 'GALLERY', path: '/gallery' },
        { name: 'VIDEOS', path: '/videos' },
        { name: 'CONTACT US', path: '/contact' }
    ];

    const isActive = (path, submenu = []) => {
        const currentPath = location.pathname;
        if (!submenu.length) {
            return currentPath === path;
        }
        return currentPath.startsWith(path);
    };

    return (
        <header className={`header-container ${isScrolled ? 'scrolled' : ''}`}>
            {/* Main Header */}
            <div className="main-header">
                <div className="main-header-content">
                    <div className="header-left">
                        <motion.div
                            className="logo-container"
                            whileHover={{ x: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Link to="/" onClick={closeMobileMenu}>
                                <motion.img
                                    src={Logo}
                                    alt="BMJ Jewellers Logo"
                                    loading="lazy"
                                    className="logo-img"
                                    whileHover={{ rotate: -5 }}
                                    transition={{ type: 'spring', damping: 20 }}
                                />
                            </Link>
                            <span className='logo-text'>
                                <pre>BMG Jewellers {'\n'}<span className='sub-logotext'>Private Limited</span></pre>
                            </span>
                        </motion.div>

                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle Menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>

                    <div className="header-middle">
                        <div className="search-bar-wrapper">
                            <Search />
                        </div>
                    </div>

                    <div className="header-right">
                        <motion.div
                            className="cart-container"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/cart"
                                className="cart-button"
                                aria-label="Shopping Cart"
                                onClick={closeMobileMenu}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, repeatDelay: 5, duration: 2 }}
                                >
                                    <FaShoppingCart className="cart-icon" />
                                </motion.div>
                                <span className="cart-text">Cart</span>
                                <motion.span
                                    className="cart-badge"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    0
                                </motion.span>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav
                className={`nav-links ${isMobileMenuOpen ? 'active' : ''} ${isScrolled ? 'scrolled' : ''} ${showNav ? 'show' : 'hide'}`}
                ref={navRef}
                aria-label="Main navigation"
            >
                <ul className="nav-list">
                    {navItems.map((item) => (
                        <li
                            key={item.name}
                            onMouseEnter={() => !isMobile && toggleDropdown(item.name)}
                            onMouseLeave={() => !isMobile && closeDropdown()}
                            className={`nav-item ${isActive(item.path, item.submenu) ? 'active-nav-item' : ''} ${activeDropdown === item.name ? 'active-dropdown' : ''}`}
                        >
                            <NavLink
                                to={item.path}
                                end
                                onClick={() => {
                                    if (isMobile && !item.submenu) {
                                        closeMobileMenu();
                                    }
                                    if (isMobile && item.submenu) {
                                        toggleDropdown(item.name);
                                    }
                                }}
                                className={({ isActive }) =>
                                    isActive ? 'active-nav-link' : ''
                                }
                                aria-haspopup={item.submenu ? "true" : undefined}
                                aria-expanded={activeDropdown === item.name ? "true" : "false"}
                            >
                                {item.name}
                                {item.submenu && <FaChevronDown className="dropdown-arrow" />}
                                <span className="nav-hover-indicator"></span>
                            </NavLink>

                            {item.submenu && (
                                <AnimatePresence>
                                    {(activeDropdown === item.name || (isMobileMenuOpen && isMobile)) && (
                                        <motion.ul
                                            className="dropdown-menu"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            aria-label={`${item.name} submenu`}
                                        >
                                            {item.submenu.map((subItem) => (
                                                <motion.li
                                                    key={subItem}
                                                    whileHover={{ x: 5 }}
                                                    onClick={closeMobileMenu}
                                                >
                                                    <NavLink
                                                        to={`${item.path}/${subItem.toLowerCase()}`}
                                                        className={({ isActive }) =>
                                                            isActive ? 'active-subnav-link' : ''
                                                        }
                                                    >
                                                        {subItem}
                                                    </NavLink>
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}

export default Header;