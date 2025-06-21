import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const columnVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        hover: { x: 5, color: '#d4a017', transition: { duration: 0.2 } },
        tap: { scale: 0.95 }
    };

    const socialIconVariants = {
        hover: {
            scale: 1.15,
            color: '#d4a017',
            y: -3,
            transition: { type: "spring", stiffness: 400, damping: 10 }
        }
    };

    const usefulLinks = [
        { path: '/privacy-policy', text: 'Privacy Policy' },
        { path: '/terms-condition', text: 'Terms and Condition' },
        { path: '/delivery-shipping', text: 'Delivery-Shipping Policy' },
        { path: '/cancel-return', text: 'Cancellation & Return Policy' },
        { path: '/refund', text: 'Refund Policy' },  
    ];

    const navigationLinks = [
        { path: '/', text: 'Home' },
        { path: '/products', text: 'Products' },
        { path: '/why-us', text: 'Why Us' },
        { path: '/videos', text: 'Videos' },
        { path: '/admin', text: 'Admin' }
    ];

    return (
        <footer className="footer">
            <div className="footer-container">
                <motion.div
                    className="footer-column"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={columnVariants}
                >
                    <h4 className="footer-header">Useful Links</h4>
                    <ul className="footer-links">
                        {usefulLinks.map((link, index) => (
                            <motion.li
                                key={index}
                                variants={itemVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="footer-link-item"
                            >
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        isActive ? "active-footer-link" : ""
                                    }
                                >
                                    {link.text}
                                </NavLink>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    className="footer-column"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={columnVariants}
                >
                    <h4 className="footer-header">Navigation</h4>
                    <ul className="footer-links">
                        {navigationLinks.map((link, index) => (
                            <motion.li
                                key={index}
                                variants={itemVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="footer-link-item"
                            >
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        isActive ? "active-footer-link" : ""
                                    }
                                >
                                    {link.text}
                                </NavLink>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

          

                <motion.div
                    className="footer-column"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={columnVariants}
                >
                    <h4 className="footer-header">Contact</h4>
                    <motion.p variants={itemVariants} className="footer-contact-text">
                        <span className="contact-title">Showroom Address:</span> M/s. BMG Jewellers Pvt Ltd, 160, Melamasi St, Madurai-625001
                    </motion.p>
                    <motion.p variants={itemVariants} className="footer-contact-text">
                        <span className="contact-title">Primary Contact:</span> +91-70946 70946, 86085 96085
                    </motion.p>
                    <motion.p variants={itemVariants} className="footer-contact-text">
                        websupport@justdial.com
                    </motion.p>
                    <motion.div
                        className="social-icons"
                        variants={itemVariants}
                    >
                        {[
                            { icon: 'fab fa-facebook-f', url: 'https://www.facebook.com' },
                            { icon: 'fab fa-instagram', url: 'https://www.instagram.com' },
                            { icon: 'fab fa-twitter', url: 'https://www.twitter.com' },
                            { icon: 'fab fa-linkedin-in', url: 'https://www.linkedin.com' },
                            { icon: 'fab fa-youtube', url: 'https://www.youtube.com' }
                        ].map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={socialIconVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <i className={social.icon}></i>
                            </motion.a>
                        ))}
                    </motion.div>
                </motion.div>
                <motion.div
                    className="footer-bottom"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                >
                    <p className="copy-rights">© 2025 BMG Jewellery Pvt Ltd. All rights reserved.</p>
                    <p className="design">Designed by <a href="https://www.brightechsoftware.com" className="designed-by">Brightech Software</a></p>
                    <div className="payment-methods">
                        <i className="fab fa-cc-visa"></i>
                        <i className="fab fa-cc-mastercard"></i>
                        <i className="fab fa-cc-paypal"></i>
                        <i className="fab fa-cc-apple-pay"></i>
                    </div>
                </motion.div>
            </div>

           
        </footer>
    );
};

export default Footer;
