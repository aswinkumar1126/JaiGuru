import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaTimes } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getItemAndSubItemNames } from '../../service/CategoryItemsService';
import Search from '../../components/search/Search';
import RatesCard from '../../components/rateCard/RatesCard';
import './Header.css';
import image1 from '../../assets/images/nav1.jpg';
import image2 from '../../assets/images/nav2.jpg';

const NavBar = ({
    isMobile,
    isMobileMenuOpen,
    activeDropdown,
    toggleDropdown,
    closeMobileMenu,
    setActiveDropdown,
    navRef,
    dropdownRef,
}) => {
    const location = useLocation();

    const navItems = [
        { name: 'HOME', path: '/home', metal: null },
        { name: 'GOLD', path: '/products?metalId=G', submenu: true, metal: 'G' },
        { name: 'SILVER', path: '/products?metalId=S', submenu: true, metal: 'S' },
        { name: 'DIAMOND', path: '/products?metalId=D', submenu: true, metal: 'D' },
        { name: 'ALL PRODUCTS', path: '/products', metal: null },
        { name: 'VIDEOS', path: '/videos', metal: null },
    ];

    const goldItems = useQuery({
        queryKey: ['itemNames', 'G'],
        queryFn: () => getItemAndSubItemNames('G'),
        enabled: true,
        staleTime: 5 * 60 * 1000,
    });

    const silverItems = useQuery({
        queryKey: ['itemNames', 'S'],
        queryFn: () => getItemAndSubItemNames('S'),
        enabled: true,
        staleTime: 5 * 60 * 1000,
    });

    const diamondItems = useQuery({
        queryKey: ['itemNames', 'D'],
        queryFn: () => getItemAndSubItemNames('D'),
        enabled: true,
        staleTime: 5 * 60 * 1000,
    });

    const itemQueries = {
        G: goldItems,
        S: silverItems,
        D: diamondItems,
    };

    const groupItemsByCategory = (items) => {
        if (!items) return [];

        const categories = {};
        items.forEach((item) => {
            const category = item.CATEGORY || 'Other';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(item);
        });

        return Object.entries(categories).map(([title, items]) => ({
            title,
            items,
        }));
    };

    const handleItemClick = (e, item) => {
        if (item.submenu) {
            if (isMobile) {
                if (e.target.closest('.public-dropdown-arrow') || activeDropdown === item.name) {
                    e.preventDefault();
                    toggleDropdown(item.name);
                } else {
                    closeMobileMenu();
                }
            } else {
                e.preventDefault();
                toggleDropdown(item.name);
            }
        } else {
            closeMobileMenu();
        }
    };

    // Helper function to determine active state
    const isNavItemActive = (navItem) => {
        const searchParams = new URLSearchParams(location.search);
        const currentMetalId = searchParams.get('metalId');

        if (navItem.metal) {
            // For GOLD, SILVER, DIAMOND
            return location.pathname === '/products' && currentMetalId === navItem.metal;
        } else if (navItem.name === 'ALL PRODUCTS') {
            // For ALL PRODUCTS
            return location.pathname === '/products' && !currentMetalId;
        } else {
            // For HOME, VIDEOS
            return location.pathname === navItem.path;
        }
    };

    return (
        <nav
            id="public-main-navigation"
            className={`public-nav-links ${isMobileMenuOpen ? 'public-active' : ''}`}
            aria-label="Main navigation"
            ref={navRef}
        >
            {isMobile && (
                <>
                    <div className="public-mobile-search-container">
                        <Search onSearchComplete={closeMobileMenu} />
                    </div>
                    <div className="public-mobile-rates-container">
                        <RatesCard isMobile={isMobile} />
                    </div>
                </>
            )}
            <ul className="public-nav-list">
                {navItems.map((navItem) => {
                    const { data: items, isLoading, error } = navItem.submenu
                        ? itemQueries[navItem.metal]
                        : { data: null, isLoading: false, error: null };

                    const groupedCategories = navItem.submenu ? groupItemsByCategory(items) : [];

                    return (
                        <li
                            key={navItem.name}
                            className={`public-nav-item ${activeDropdown === navItem.name ? 'public-active-dropdown' : ''}`}
                            onMouseEnter={() => !isMobile && navItem.submenu && setActiveDropdown(navItem.name)}
                            onMouseLeave={() => !isMobile && setActiveDropdown(null)}
                        >
                            <NavLink
                                to={navItem.path}
                                end={navItem.metal === null} // Exact match for HOME, ALL PRODUCTS, VIDEOS
                                onClick={(e) => handleItemClick(e, navItem)}
                                className={isNavItemActive(navItem) ? 'public-active-nav-link' : ''}
                                aria-haspopup={navItem.submenu ? 'true' : 'false'}
                                aria-expanded={activeDropdown === navItem.name}
                            >
                                {navItem.name}
                                {navItem.submenu && <FaChevronDown className="public-dropdown-arrow" />}
                                <span className="public-nav-hover-indicator"></span>
                            </NavLink>

                            {navItem.submenu && (
                                <div
                                    className="public-dropdown-container"
                                    ref={dropdownRef}
                                    onMouseEnter={() => !isMobile && setActiveDropdown(navItem.name)}
                                    onMouseLeave={() => !isMobile && setActiveDropdown(null)}
                                >
                                    <AnimatePresence>
                                        {activeDropdown === navItem.name && (
                                            <motion.div
                                                className="public-dropdown-modal"
                                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                                transition={{
                                                    duration: 0.4,
                                                    ease: [0.4, 0.0, 0.2, 1],
                                                    type: 'spring',
                                                    damping: 25,
                                                    stiffness: 200,
                                                }}
                                                role="dialog"
                                                aria-label={`${navItem.name} category menu`}
                                            >
                                                <div className="public-dropdown-header">
                                                    <h3>{`${navItem.name} Jewellery`}</h3>
                                                    <button
                                                        className="public-dropdown-close"
                                                        onClick={() => setActiveDropdown(null)}
                                                        aria-label="Close category menu"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                                <div className="public-dropdown-content">
                                                    <motion.div
                                                        className="public-dropdown-categories"
                                                        initial={{ opacity: 0, x: -30 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.15, duration: 0.4 }}
                                                    >
                                                        {isLoading ? (
                                                            <motion.div
                                                                className="public-dropdown-loading"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <div className="public-loading-spinner"></div>
                                                                <span>Loading categories...</span>
                                                            </motion.div>
                                                        ) : error ? (
                                                            <motion.div
                                                                className="public-dropdown-error"
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                Failed to load categories
                                                            </motion.div>
                                                        ) : groupedCategories.length === 0 ? (
                                                            <motion.div
                                                                className="public-dropdown-empty"
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                No categories available
                                                            </motion.div>
                                                        ) : (
                                                            groupedCategories.map((category, catIndex) => (
                                                                <motion.div
                                                                    key={catIndex}
                                                                    className="public-dropdown-category-group"
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{
                                                                        delay: 0.2 + catIndex * 0.08,
                                                                        duration: 0.4,
                                                                        ease: 'easeOut',
                                                                    }}
                                                                >
                                                                    <h4 className="public-dropdown-category-title">{category.title}</h4>
                                                                    <ul className="public-dropdown-category-items">
                                                                        {category.items.map((item, itemIndex) => (
                                                                            <motion.li
                                                                                key={`${catIndex}-${itemIndex}`}
                                                                                className="public-dropdown-item"
                                                                                whileHover={{
                                                                                    x: 5,
                                                                                    transition: { duration: 0.2 },
                                                                                }}
                                                                                initial={{ opacity: 0, x: -10 }}
                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                transition={{
                                                                                    delay: 0.3 + (catIndex + itemIndex) * 0.03,
                                                                                    duration: 0.3,
                                                                                }}
                                                                                role="none"
                                                                            >
                                                                                <NavLink
                                                                                    to={`/${navItem.name.toLowerCase()}/${item.ITEMNAME.toLowerCase().replace(
                                                                                        /\s+/g,
                                                                                        '-'
                                                                                    )}`}
                                                                                    state={{
                                                                                        itemId: item.ITEMID,
                                                                                        itemName: item.ITEMNAME,
                                                                                        metal: navItem.metal,
                                                                                    }}
                                                                                    className={({ isActive }) =>
                                                                                        isActive ? 'public-active-subnav-link' : ''
                                                                                    }
                                                                                    role="menuitem"
                                                                                    tabIndex={0}
                                                                                    onClick={closeMobileMenu}
                                                                                >
                                                                                    {item.ITEMNAME}
                                                                                </NavLink>
                                                                            </motion.li>
                                                                        ))}
                                                                    </ul>
                                                                </motion.div>
                                                            ))
                                                        )}
                                                    </motion.div>
                                                    {!isMobile && (
                                                        <motion.div
                                                            className="public-dropdown-images"
                                                            initial={{ opacity: 0, x: 30 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.2, duration: 0.4 }}
                                                        >
                                                            <motion.div
                                                                className="public-dropdown-image-container"
                                                                whileHover={{ scale: 1.03 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <img
                                                                    src={image1}
                                                                    alt="Jewelry collection"
                                                                    className="public-dropdown-image"
                                                                />
                                                                <div className="public-image-overlay">
                                                                    <span>Premium Collection</span>
                                                                </div>
                                                            </motion.div>
                                                            <motion.div
                                                                className="public-dropdown-image-container"
                                                                whileHover={{ scale: 1.03 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <img
                                                                    src={image2}
                                                                    alt="Jewelry collection"
                                                                    className="public-dropdown-image"
                                                                />
                                                                <div className="public-image-overlay">
                                                                    <span>Latest Designs</span>
                                                                </div>
                                                            </motion.div>
                                                            <motion.div
                                                                className="public-dropdown-featured-text"
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: 0.4, duration: 0.3 }}
                                                                whileHover={{ scale: 1.05 }}
                                                            >
                                                                <div className="public-featured-number">3500+</div>
                                                                <div className="public-featured-label">Unique Designs</div>
                                                            </motion.div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default NavBar;