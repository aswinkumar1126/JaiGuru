import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
    return (
        <motion.div
            className="about-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <motion.div
                className="about-header"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
            >
                <motion.h1
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                >
                    About BMG Jewellers
                </motion.h1>
            </motion.div>

            <motion.div
                className="about-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                <motion.p whileHover={{ scale: 1.02, x: 5 }}>
                    At <strong>BMG Jewellers</strong>, we pride ourselves on offering premium-quality gold and silver ornaments, rooted in trust and tradition. Since our inception, we have consistently delivered excellence in craftsmanship and transparent pricing.
                </motion.p>

                <motion.div
                    className="vision-card"
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <h3>Our Vision</h3>
                    <p>To redefine elegance in jewellery while maintaining authenticity and customer satisfaction.</p>
                </motion.div>

                <motion.div
                    className="founder-card"
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <h3>Founder's Note</h3>
                    <p>Our journey began with a small vision to provide honest and pure gold to every customer. Through dedication and integrity, we've built a brand trusted by thousands.</p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default About;