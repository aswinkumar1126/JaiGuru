import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBox, FaImage, FaTag, FaVideo, FaAngleDown, FaAngleRight, FaCompress } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [expanded, setExpanded] = useState(() => {
        // Load expanded state from localStorage for desktop
        if (window.innerWidth > 768) {
            try {
                const saved = localStorage.getItem('sidebarExpanded');
                return saved ? JSON.parse(saved) : {};
            } catch {
                return {};
            }
        }
        return {};
    });

    const toggleSection = (section) => {
        setExpanded(prev => {
            const newState = { ...prev, [section]: !prev[section] };
            if (window.innerWidth > 768) {
                localStorage.setItem('sidebarExpanded', JSON.stringify(newState));
            }
            return newState;
        });
    };

    const collapseAll = () => {
        setExpanded({});
        if (window.innerWidth > 768) {
            localStorage.setItem('sidebarExpanded', JSON.stringify({}));
        }
    };

    const handleLinkClick = () => {
        if (window.innerWidth <= 768) {
            toggleSidebar();
        }
    };

    // useEffect(() => {
    //     const handleResize = () => {
    //         if (window.innerWidth <= 768) {
    //             setExpanded({}); // Collapse all on mobile
    //         }
    //     };
    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

    return (
        <>
            <aside
                className={`sidebar ${isOpen ? 'open' : 'closed'}`}
                aria-hidden={window.innerWidth <= 768 && !isOpen}
                role="navigation"
                aria-label="Dashboard navigation"
            >
                <div className="sidebar-header">
                    <NavLink className="sidebar-title" to="/">Dashboard</NavLink>
                    {window.innerWidth <= 768 && (
                        <button
                            className="collapse-all"
                            onClick={collapseAll}
                            aria-label="Collapse all sections"
                            title="Collapse All"
                        >
                            <FaCompress />
                        </button>
                    )}
                </div>

                <nav className="sidebar-nav">
                    <div className="section">
                        <h4
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleSection('product')}
                            onKeyDown={(e) => e.key === 'Enter' && toggleSection('product')}
                            aria-expanded={!!expanded.product}
                            aria-controls="product-submenu"
                            className="section-title"
                        >
                            <FaBox className="section-icon" />
                            Product
                            {expanded.product ? <FaAngleDown className="toggle-icon" /> : <FaAngleRight className="toggle-icon" />}
                        </h4>
                        {expanded.product && (
                            <div className="submenu" id="product-submenu">
                                <NavLink
                                    to="/product/add"
                                    className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                                >
                                    Add Product
                                </NavLink>
                                <NavLink
                                    to="/product/manage"
                                    className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                                >
                                    Manage Products
                                </NavLink>
                            </div>
                        )}
                    </div>

                    <div className="section">
                        <h4
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleSection('banner')}
                            onKeyDown={(e) => e.key === 'Enter' && toggleSection('banner')}
                            aria-expanded={!!expanded.banner}
                            aria-controls="banner-submenu"
                            className="section-title"
                        >
                            <FaImage className="section-icon" />
                            Banner
                            {expanded.banner ? <FaAngleDown className="toggle-icon" /> : <FaAngleRight className="toggle-icon" />}
                        </h4>
                        {expanded.banner && (
                            <div className="submenu" id="banner-submenu">
                                <NavLink
                                    to="/banner/add"
                                    className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                                >
                                    Add Banner
                                </NavLink>
                                <NavLink
                                    to="/banner/manage"
                                    className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                                >
                                    Manage Banners
                                </NavLink>
                            </div>
                        )}
                    </div>

                    <div className="section">
                        <h4
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleSection('category')}
                            onKeyDown={(e) => e.key === 'Enter' && toggleSection('category')}
                            aria-expanded={!!expanded.category}
                            aria-controls="category-submenu"
                            className="section-title"
                        >
                            <FaTag className="section-icon" />
                            Category
                            {expanded.category ? <FaAngleDown className="toggle-icon" /> : <FaAngleRight className="toggle-icon" />}
                        </h4>
                        {expanded.category && (
                            <div className="submenu" id="category-submenu">
                                <NavLink
                                    to="/category/add"
                                    className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                                >
                                    Add Category
                                </NavLink>
                                <NavLink
                                    to="/category/manage"
                                    className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                                >
                                    Manage Categories
                                </NavLink>
                            </div>
                        )}
                    </div>

                    <div className="section">
                        <h6
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleSection('video')}
                            onKeyDown={(e) => e.key === 'Enter' && toggleSection('video')}
                            aria-expanded={!!expanded.video}
                            aria-controls="video-submenu"
                            className="section-title"
                        >
                            <FaVideo className="section-icon" />
                            Video
                            {expanded.video ? <FaAngleDown className="toggle-icon" /> : <FaAngleRight className="toggle-icon" />}
                        </h6>
                        {expanded.video && (
                            <div className="submenu" id="video-submenu">
                                <NavLink
                                    to="/video/add"
                                    className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                                >
                                    Add Video
                                </NavLink>
                                <NavLink
                                    to="/video/manage"
                                    className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                                >
                                    Manage Videos
                                </NavLink>
                            </div>
                            
                        )}
                    </div>
                    <div className="section">
                        <h6
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleSection('rates')}
                            onKeyDown={(e) => e.key === 'Enter' && toggleSection('rates')}
                            aria-expanded={!!expanded.rates}
                            aria-controls="video-submenu"
                            className="section-title"
                        >
                            <FaVideo className="section-icon" />
                            rates
                            {expanded.rates ? <FaAngleDown className="toggle-icon" /> : <FaAngleRight className="toggle-icon" />}
                        </h6>
                        {expanded.rates && (
                            <div className="submenu" id="video-submenu">
                                <NavLink
                                    to="/rates/add"
                                    className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                                >
                                    Add Rates
                                </NavLink>
                                <NavLink
                                    to="/rates/manage"
                                    className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                                >
                                    Manage Rates
                                </NavLink>
                            </div>

                        )}
                    </div>
                </nav>
            </aside>

            {isOpen && window.innerWidth <= 768 && (
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