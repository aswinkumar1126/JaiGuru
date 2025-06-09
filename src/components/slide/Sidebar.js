import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FaBox, FaImage, FaTag, FaVideo, 
    FaTachometerAlt, FaDollarSign, FaUserCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { MyContext } from '../../context/themeContext/themeContext';
import './Sidebar.css';
import { getPageTitle } from '../../utils/pageTitle/getPageTitle';
import RoleBasedSection from '../common/RoleBasedSection';
import MenuItem from '../common/MenuItem';
import { useUserProfile } from '../../hooks/profile/useUserProfile';


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

const employeeMenu = {
    title: "Employee",
    icon: <FaBox className="section-icon" />,
    submenu: [
        { title: "Add Employee", path: "/employee/add" },
        { title: "Manage Employees", path: "/employee/manage" }
    ]
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const { themeMode } = useContext(MyContext);
    const [expanded, setExpanded] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [currentPageTitle, setCurrentPageTitle] = useState("Admin Dashboard");

    const { data: user } = useUserProfile();
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

    useEffect(() => {
        const title = getPageTitle(location.pathname, menuItems);
        setCurrentPageTitle(title);
    }, [location.pathname]);

    const toggleSection = (section) => {
        setExpanded(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };



    const handleLinkClick = () => {
        if (isMobile) {
            toggleSidebar();
        }
    };

    const sidebarVariants = {
        open: {
            x: 0,
            transition: {
                type: 'spring',
                damping: 25,
                stiffness: 300
            }
        },
        closed: {
            x: '-100%',
            transition: {
                type: 'spring',
                damping: 25,
                stiffness: 300
            }
        }
    };

    const itemVariants = {
        open: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.2 }
        },
        closed: {
            opacity: 0,
            x: -20,
            transition: { duration: 0.1 }
        }
    };

    return (
        <>
            <motion.aside
                className={`sidebar ${isOpen ? 'open' : 'closed'} ${themeMode === 'dark' ? 'dark' : 'light'}`}
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
                        </div>
                    </div>

                    <nav className="sidebar-nav">
                        <div className="menu-scroll-container">
                            {menuItems.map((item) => (
                                <MenuItem
                                    key={item.title}
                                    item={item}
                                    isExpanded={expanded[item.title.toLowerCase()]}
                                    onToggle={toggleSection}
                                    onClick={handleLinkClick}
                                    variants={itemVariants}
                                />
                            ))}

                            <RoleBasedSection allowedRoles={["ROLE_ADMIN"]}>
                                <MenuItem
                                    item={employeeMenu}
                                    isExpanded={expanded['employee']}
                                    onToggle={toggleSection}
                                    onClick={handleLinkClick}
                                    variants={itemVariants}
                                />
                            </RoleBasedSection>
                        </div>
                    </nav>

                    <div className="sidebar-footer">
                        <RoleBasedSection allowedRoles={["ROLE_ADMIN"]}>
                        <div className="user-profile">
                            <div className="user-avatar">
                                <FaUserCircle size={36} />
                            </div>
                            <div className="user-info">
                                <div className="user-name">{user?.username}</div>
                                <div className="user-role">Administrator</div>
                            </div>
                        </div>
                        </RoleBasedSection>
                        
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