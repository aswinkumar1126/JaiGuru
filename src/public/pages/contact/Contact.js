import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaStore, FaPhone, FaClock, FaDirections, FaPaperPlane, FaUser, FaEnvelope, FaComment } from 'react-icons/fa';
import './Contact.css';
import PublicUrl from '../../api/publicUrl';

const Contact = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phoneNumber: '',
        comment: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await PublicUrl.post("/feedback/submit", {
                ...formData
            });
            console.log('Server response:', response.data);

            alert('Thank you for your message! We will contact you soon.');
            setFormData({
                customerName: '',
                email: '',
                phoneNumber: '',
                comment: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong. Please try again later.');
        }
    };

    return (
        <motion.div
            className="contact-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <motion.div
                className="contact-header"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
            >
                <motion.h1
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                >
                    Contact BMG Jewellers
                </motion.h1>
            </motion.div>

            <motion.div
                className="contact-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                <div className="contact-grid">
                    <motion.div
                        className="contact-card"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="icon-container">
                            <FaMapMarkerAlt className="contact-icon" />
                        </div>
                        <h3>Registered Office</h3>
                        <p>No. 54, Vaithyanathapuram, Thathaneri, Madurai - 625018</p>
                    </motion.div>

                    <motion.div
                        className="contact-card"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="icon-container">
                            <FaStore className="contact-icon" />
                        </div>
                        <h3>Showroom Address</h3>
                        <p>160, Melamasi Street, Madurai - 625001</p>
                    </motion.div>

                    <motion.div
                        className="contact-card"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="icon-container">
                            <FaPhone className="contact-icon" />
                        </div>
                        <h3>Contact Numbers</h3>
                        <p>70946 70946<br />86085 96085<br />86829 96829</p>
                    </motion.div>

                    <motion.div
                        className="contact-card"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="icon-container">
                            <FaClock className="contact-icon" />
                        </div>
                        <h3>Business Hours</h3>
                        <p>Monday - Saturday: 10AM - 8PM<br />Sunday: 11AM - 6PM</p>
                    </motion.div>
                </div>

                <div className="contact-lower-section">
                    <motion.div
                        className="map-section"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}
                    >
                        <div className="map-header">
                            <h3>Our Location</h3>
                            <motion.a
                                href="https://www.google.com/maps/dir//M/s.+BMG+Jewellers+Private+Limited,+160,+Melamasi+Street,+Madurai-625001"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="direction-btn"
                                whileHover={{ scale: 1.05, backgroundColor: "#C0A040" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaDirections /> Get Directions
                            </motion.a>
                        </div>
                        <iframe
                            title="BMG Location"
                            width="100%"
                            height="400"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.123456789012!2d78.123456!3d9.987654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c582b118963f%3A0x9e4e3b1a3d1e1b1d!2sBMG%20Jewellers!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                        >
                        </iframe>
                    </motion.div>

                    <motion.div
                        className="contact-form-container"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, duration: 0.6 }}
                    >
                        <h3>Send Us a Message</h3>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <motion.div
                                className="form-group"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <FaUser className="form-icon" />
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    required
                                    className='text-input'
                                />
                            </motion.div>

                            <motion.div
                                className="form-group"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <FaEnvelope className="form-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Your Email"
                                    required
                                    className='text-input'
                                />
                            </motion.div>

                            <motion.div
                                className="form-group"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <FaPhone className="form-icon" />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Your Phone Number"
                                    className='text-input'
                                />
                            </motion.div>

                            <motion.div
                                className="form-group"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <FaComment className="form-icon" />
                                <textarea
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleChange}
                                    placeholder="Your Message"
                                    rows="5"
                                    required
                                    className='text-input'
                                ></textarea>
                            </motion.div>

                            <motion.button
                                type="submit"
                                className="submit-btn"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 5px 15px rgba(212, 175, 55, 0.4)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <FaPaperPlane /> Send Message
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Contact;