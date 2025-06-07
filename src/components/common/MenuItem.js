// components/common/MenuItem.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';

const MenuItem = ({
    item,
    isExpanded,
    onToggle,
    onClick,
    variants
}) => {
    const hasSubmenu = !!item.submenu;
    const isActive = window.location.pathname === item.path;

    return (
        <div className="menu-section">
            {item.path ? (
                <motion.div variants={variants}>
                    <NavLink
                        to={item.path}
                        className={`menu-item ${isActive ? 'active' : ''}`}
                        onClick={onClick}
                    >
                        {item.icon}
                        <span className="menu-text">{item.title}</span>
                        <div className="hover-effect"></div>
                    </NavLink>
                </motion.div>
            ) : (
                <>
                    <motion.div
                        className={`menu-item ${isExpanded ? 'expanded' : ''}`}
                        onClick={() => onToggle(item.title.toLowerCase())}
                        variants={variants}
                    >
                        {item.icon}
                        <span className="menu-text">{item.title}</span>
                        {hasSubmenu && (
                            isExpanded ? (
                                <FaAngleDown className="menu-arrow" />
                            ) : (
                                <FaAngleRight className="menu-arrow" />
                            )
                        )}
                        <div className="hover-effect"></div>
                    </motion.div>

                    {hasSubmenu && isExpanded && (
                        <motion.div
                            className="submenu"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={{
                                open: {
                                    opacity: 1,
                                    height: 'auto',
                                    transition: { staggerChildren: 0.05 }
                                },
                                closed: {
                                    opacity: 0,
                                    height: 0,
                                    transition: { when: "afterChildren" }
                                }
                            }}
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
                                        onClick={onClick}
                                    >
                                        <span className="submenu-text">{subItem.title}</span>
                                        <div className="submenu-hover-effect"></div>
                                    </NavLink>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
};

export default MenuItem;