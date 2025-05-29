import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FaBox,
    FaImage,
    FaTag,
    FaVideo,
    FaAngleDown,
    FaAngleRight,
    FaCompress,
    FaTachometerAlt,
    FaDollarSign,
    // FaCog
} from 'react-icons/fa';
import './Sidebar.css';

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
    },
    // {
    //     title: "Settings",
    //     icon: <FaCog className="section-icon" />,
    //     path: "/settings"
    // }
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const [expanded, setExpanded] = useState(() => {
        // Initialize expanded state based on localStorage and current path
        if (typeof window !== 'undefined' && window.innerWidth > 768) {
            try {
                const saved = localStorage.getItem('sidebarExpanded');
                const savedState = saved ? JSON.parse(saved) : {};

                // Auto-expand sections if current path matches submenu
                const currentPath = location.pathname;
                const autoExpanded = {};

                menuItems.forEach(item => {
                    if (item.submenu) {
                        const isActive = item.submenu.some(subItem =>
                            subItem.path === currentPath
                        );
                        autoExpanded[item.title.toLowerCase()] = isActive;
                    }
                });

                return { ...savedState, ...autoExpanded };
            } catch {
                return {};
            }
        }
        return {};
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSection = (section) => {
        setExpanded(prev => {
            const newState = { ...prev, [section]: !prev[section] };
            if (!isMobile) {
                localStorage.setItem('sidebarExpanded', JSON.stringify(newState));
            }
            return newState;
        });
    };

    const collapseAll = () => {
        setExpanded({});
        if (!isMobile) {
            localStorage.setItem('sidebarExpanded', JSON.stringify({}));
        }
    };

    const handleLinkClick = () => {
        if (isMobile) {
            toggleSidebar();
        }
    };

    return (
        <>
            <aside
                className={`sidebar ${isOpen ? 'open' : 'closed'}`}
                aria-hidden={isMobile && !isOpen}
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <NavLink className="sidebar-title" to="/">
                            <span className="brand-highlight">Admin</span> Panel
                        </NavLink>
                    </div>
                    <button
                        className="collapse-all"
                        onClick={collapseAll}
                        aria-label="Collapse all sections"
                        title="Collapse All"
                    >
                        <FaCompress />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <div className="section" key={item.title}>
                            {item.path ? (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `section-title ${isActive ? 'active' : ''}`
                                    }
                                    onClick={handleLinkClick}
                                    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                                >
                                    {item.icon}
                                    {item.title}
                                </NavLink>
                            ) : (
                                <>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => toggleSection(item.title.toLowerCase())}
                                        onKeyDown={(e) => e.key === 'Enter' && toggleSection(item.title.toLowerCase())}
                                        aria-expanded={!!expanded[item.title.toLowerCase()]}
                                        aria-controls={`${item.title.toLowerCase()}-submenu`}
                                        className={`section-title ${item.submenu?.some(subItem =>
                                            location.pathname === subItem.path
                                        ) ? 'active-parent' : ''
                                            }`}
                                    >
                                        {item.icon}
                                        {item.title}
                                        {expanded[item.title.toLowerCase()] ? (
                                            <FaAngleDown className="toggle-icon" />
                                        ) : (
                                            <FaAngleRight className="toggle-icon" />
                                        )}
                                    </div>
                                    {expanded[item.title.toLowerCase()] && (
                                        <div
                                            className="submenu"
                                            id={`${item.title.toLowerCase()}-submenu`}
                                        >
                                            {item.submenu.map((subItem) => (
                                                <NavLink
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    className={({ isActive }) =>
                                                        `submenu-link ${isActive ? 'active' : ''}`
                                                    }
                                                    onClick={handleLinkClick}
                                                    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                                                >
                                                    {subItem.title}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">JD</div>
                        <div className="user-info">
                            <div className="username">John Doe</div>
                            <div className="user-role">Administrator</div>
                        </div>
                    </div>
                </div>
            </aside>

            {isOpen && isMobile && (
                <div
                    className="overlay"
                    onClick={toggleSidebar}
                    onKeyDown={(e) => e.key === 'Enter' && toggleSidebar()}
                    role="button"
                    tabIndex={0}
                    aria-label="Close sidebar"
                />
            )}
        </>
    );
};

export default Sidebar;