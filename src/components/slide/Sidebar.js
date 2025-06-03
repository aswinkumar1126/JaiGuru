import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    FaBox, FaImage, FaTag, FaVideo, FaAngleDown, FaAngleRight,
    FaTachometerAlt, FaDollarSign, FaSignOutAlt, 
    //FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { MyContext } from '../../context/themeContext/themeContext';
import './Sidebar.css';
import { getPageTitle } from '../../utils/pageTitle/getPageTitle';
const menuItems = [
    {
        title: "Dashboard",
        icon: <FaTachometerAlt className="section-icon" />,
        path: "/dashboard"
    },
    {
        title: "Product",
        icon: <FaBox className="section-icon" />,
        submenu: [
            { title: "Add Product", path: "/product/add" },
            { title: "Manage Products", path: "/product/manage" }
        ]
    },
    {
        title: "Banner",
        icon: <FaImage className="section-icon" />,
        submenu: [
            { title: "Add Banner", path: "/banner/add" },
            { title: "Manage Banners", path: "/banner/manage" }
        ]
    },
    {
        title: "Category",
        icon: <FaTag className="section-icon" />,
        submenu: [
            { title: "Add Category", path: "/category/add" },
            { title: "Manage Categories", path: "/category/manage" }
        ]
    },
    {
        title: "Video",
        icon: <FaVideo className="section-icon" />,
        submenu: [
            { title: "Add Video", path: "/video/add" },
            { title: "Manage Videos", path: "/video/manage" }
        ]
    },
    {
        title: "Rates",
        icon: <FaDollarSign className="section-icon" />,
        submenu: [
            { title: "Add Rates", path: "/rates/add" },
            { title: "Manage Rates", path: "/rates/manage" }
        ]
    }
];

const Sidebar = ({ isOpen, toggleSidebar}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { themeMode } = useContext(MyContext);
    const [expanded, setExpanded] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [currentPageTitle, setCurrentPageTitle] = useState("Admin Dashboard");;

    // Initialize expanded state and mobile detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        const initialExpanded = {};
        menuItems.forEach(item => {
            if (item.submenu) {
                initialExpanded[item.title.toLowerCase()] = item.submenu.some(
                    subItem => subItem.path === location.pathname
                );
            }
        });

        setExpanded(initialExpanded);
        return () => window.removeEventListener('resize', handleResize);
    }, [location.pathname]);

    const toggleSection = (section) => {
        setExpanded(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        if (themeMode.setAuthToken) {
            themeMode.setAuthToken(null);
        }
        navigate('/login');
    };

    const handleLinkClick = () => {
        if (isMobile) {
            toggleSidebar();
        }
    };

    const sidebarVariants = {
        open: { x: 0, transition: { type: 'spring', damping: 25 } },
        closed: { x: '-100%', transition: { type: 'spring', damping: 25 } }
    };

    const itemVariants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: -20 }
    };

    const submenuVariants = {
        open: {
            opacity: 1,
            height: 'auto',
            transition: { staggerChildren: 0.05, delayChildren: 0.1 }
        },
        closed: {
            opacity: 0,
            height: 0,
            transition: { when: "afterChildren" }
        }
    };
    useEffect(() => {
        const title = getPageTitle(location.pathname, menuItems);
        setCurrentPageTitle(title);
    }, [location.pathname]);

    return (
        <>
            <motion.aside
                className={`sidebar ${isOpen ? 'open' : 'closed'}  ${themeMode === 'dark' ? 'dark' : 'light'}`}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
            >
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <div className="sidebar-brand">
                            <NavLink to="/" className="sidebar-title">
                                {currentPageTitle && (
                                    <div className="current-page-indicator">
                                        {currentPageTitle}
                                    </div>
                                )}
                            </NavLink>
                            {/* {!isMobile && (
                                <button
                                    className="toggle-collapse"
                                    onClick={toggleSidebar}
                                    aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                                >
                                    * {isOpen ? <FaChevronLeft /> : <FaChevronRight />} 
                                </button>
                            )} */}
                        </div>
                       
                    </div>

                    <nav className="sidebar-nav">
                        {menuItems.map((item) => (
                            <div className="menu-section" key={item.title}>
                                {item.path ? (
                                    <motion.div variants={itemVariants}>
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `menu-item ${isActive ? 'active' : ''}`
                                            }
                                            onClick={handleLinkClick}
                                        >
                                            {item.icon}
                                            <span className="menu-text">{item.title}</span>
                                            <div className="hover-effect"></div>
                                        </NavLink>
                                    </motion.div>
                                ) : (
                                    <>
                                        <motion.div
                                            className={`menu-item ${expanded[item.title.toLowerCase()] ? 'expanded' : ''}`}
                                            onClick={() => toggleSection(item.title.toLowerCase())}
                                            variants={itemVariants}
                                        >
                                            {item.icon}
                                            <span className="menu-text">{item.title}</span>
                                            {expanded[item.title.toLowerCase()] ? (
                                                <FaAngleDown className="menu-arrow" />
                                            ) : (
                                                <FaAngleRight className="menu-arrow" />
                                            )}
                                            <div className="hover-effect"></div>
                                        </motion.div>

                                        <AnimatePresence>
                                            {expanded[item.title.toLowerCase()] && (
                                                <motion.div
                                                    className="submenu"
                                                    initial="closed"
                                                    animate="open"
                                                    exit="closed"
                                                    variants={submenuVariants}
                                                >
                                                    {item.submenu.map((subItem) => (
                                                        <motion.div
                                                            key={subItem.path}
                                                            variants={{
                                                                open: { opacity: 1, x: 0 },
                                                                closed: { opacity: 0, x: -10 }
                                                            }}
                                                        >
                                                            <NavLink
                                                                to={subItem.path}
                                                                className={({ isActive }) =>
                                                                    `submenu-item ${isActive ? 'active' : ''}`
                                                                }
                                                                onClick={handleLinkClick}
                                                            >
                                                                <span className="submenu-text">{subItem.title}</span>
                                                                <div className="submenu-hover-effect"></div>
                                                            </NavLink>
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <div className="user-profile">
                            <div className="user-avatar">JD</div>
                            <div className="user-info">
                                <div className="user-name">John Doe</div>
                                <div className="user-role">Administrator</div>
                            </div>
                        </div>
                        <motion.button
                            className="logout-button"
                            onClick={handleLogout}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </motion.button>
                    </div>
                </div>
            </motion.aside>

            <AnimatePresence>
                {isOpen && isMobile && (
                    <motion.div
                        className="sidebar-overlay"
                        onClick={toggleSidebar}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;