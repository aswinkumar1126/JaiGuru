import React from 'react';
import { useRatesQuery } from '../../hook/rate/useRatesQuery';
import GoldCoin from '../../assets/coins/goldcoin-removebg-preview.png';
import SilverCoin from '../../assets/coins/silvercoin-removebg-preview.png';
import { motion } from 'framer-motion';
import './RatesPage.css';

const RatesPage = () => {
    const { data: rates, isLoading, isError, error } = useRatesQuery();

    // Desktop animations
    const desktopCoinVariants = {
        animate: {
            rotate: [0, 10, -10, 0],
            y: [0, -5, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    // Mobile animations
    const mobileCoinVariants = {
        animate: {
            y: [0, -3, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    if (isLoading) {
        return (
            <div className="rp-loading">
                <div className="rp-loading-spinner"></div>
                <p>Fetching current rates...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rp-error">
                <p>Error loading rates: {error.message}</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Version (hidden on mobile) */}
            <motion.div
                className="rp-desktop-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1 className="rp-title" variants={itemVariants}>
                    Today's Precious Metal Rates
                </motion.h1>
                <motion.p className="rp-subtitle" variants={itemVariants}>
                    Updated every 5 minutes
                </motion.p>

                <div className="rp-grid">
                    <motion.div className="rp-card rp-gold" variants={itemVariants}>
                        <motion.div className="rp-coin-container" variants={desktopCoinVariants} animate="animate">
                            <img src={GoldCoin} alt="Gold" className="rp-coin rp-gold-coin" />
                        </motion.div>
                        <div className="rp-rate-content">
                            <h2>Gold (24K)</h2>
                            <p className="rp-rate-value">₹{rates?.GOLDRATE?.toLocaleString() || '--'} <span className="rp-rate-per">per gram</span></p>
                        </div>
                    </motion.div>

                    <motion.div className="rp-card rp-silver" variants={itemVariants} transition={{ delay: 0.1 }}>
                        <motion.div className="rp-coin-container" variants={desktopCoinVariants} animate="animate" transition={{ delay: 0.2 }}>
                            <img src={SilverCoin} alt="Silver" className="rp-coin rp-silver-coin" />
                        </motion.div>
                        <div className="rp-rate-content">
                            <h2>Silver (99.9%)</h2>
                            <p className="rp-rate-value">₹{rates?.SILVERRATE?.toLocaleString() || '--'} <span className="rp-rate-per">per gram</span></p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Mobile Version (hidden on desktop) */}
            <div className="rp-mobile-container">
                <motion.h1 className="sm-rp-title" >
                    Today's Precious Metal Rates
                </motion.h1>
                <div className="rp-mobile-row">
                    
                    <motion.div className="rp-mobile-card rp-mobile-gold" whileHover={{ y: -2 }}>
                        <motion.div className="rp-mobile-coin" variants={mobileCoinVariants} animate="animate">
                            <img src={GoldCoin} alt="Gold" className="rp-mobile-coin-img" />
                        </motion.div>
                        <div className="rp-mobile-content">
                            <span className="rp-mobile-label">Gold (24K)</span>
                            <span className="rp-mobile-value">₹{rates?.GOLDRATE?.toLocaleString() || '--'} <span className="rp-rate-per-mobile">/gm</span></span>
                        </div>
                    </motion.div>

                    <motion.div className="rp-mobile-card rp-mobile-silver" whileHover={{ y: -2 }} transition={{ delay: 0.1 }}>
                        <motion.div className="rp-mobile-coin" variants={mobileCoinVariants} animate="animate" transition={{ delay: 0.2 }}>
                            <img src={SilverCoin} alt="Silver" className="rp-mobile-coin-img" />
                        </motion.div>
                        <div className="rp-mobile-content">
                            <span className="rp-mobile-label">Silver (99.9%)</span>
                            <span className="rp-mobile-value">₹{rates?.SILVERRATE?.toLocaleString() || '--'} <span className="rp-rate-per-mobile">/gm</span></span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default RatesPage;