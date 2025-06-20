import React from 'react';
import { motion } from 'framer-motion';
import { useRatesQuery } from '../../hook/rate/useRatesQuery';
import './RatesCard.css';
import goldCoin from '../../assets/coins/goldcoin-removebg-preview.png';
import silverCoin from '../../assets/coins/silvercoin-removebg-preview.png';

const RatesCard = ({ isMobile }) => {
    const { data: rates, isLoading, error } = useRatesQuery();

    const coinAnimation = {
        rotateY: [0, 20, 0, -20, 0],
        y: [0, -2, 0, -2, 0],
        transition: {
            repeat: Infinity,
            duration: 5,
            ease: 'easeInOut'
        }
    };

    const cardAnimation = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const hoverAnimation = {
        scale: isMobile ? 1 : 1.03,
        transition: { type: 'spring', stiffness: 400 }
    };

    const tapAnimation = {
        scale: 0.98,
        transition: { type: 'spring', stiffness: 500 }
    };

    const UNIT = '/gram';

    const SkeletonLoader = () => (
        <div className="rates-skeleton-wrapper">
            {[1, 2].map((item) => (
                <div key={item} className="rate-skeleton">
                    <div className="skeleton-coin" />
                    <div className="skeleton-info">
                        <div className="skeleton-title" />
                        <div className="skeleton-price" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="rates-card-container">
            {isLoading && <SkeletonLoader />}

            {error && (
                <motion.div
                    className="rates-error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <i className="error-icon">⚠️</i>
                    <p>Failed to load rates</p>
                </motion.div>
            )}

            {rates && (
                <motion.div
                    className="rates-card-wrapper"
                    initial="initial"
                    animate="animate"
                    variants={{
                        initial: { opacity: 0 },
                        animate: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                >
                    <motion.div
                        className="rate-card gold-card"
                        variants={cardAnimation}
                        whileHover={hoverAnimation}
                        whileTap={tapAnimation}
                    >
                        <motion.img
                            src={goldCoin}
                            alt="Gold Coin"
                            className="coin-image"
                            animate={coinAnimation}
                            style={{ transformPerspective: 1000, transformStyle: 'preserve-3d' }}
                        />
                        <div className="rate-info">
                            <h3 className="rate-title">Gold</h3>
                            <p className="rate-price">
                                ₹{rates.GOLDRATE.toFixed(2)} <span className="rate-unit">{UNIT}</span>
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="rate-card silver-card"
                        variants={cardAnimation}
                        whileHover={hoverAnimation}
                        whileTap={tapAnimation}
                    >
                        <motion.img
                            src={silverCoin}
                            alt="Silver Coin"
                            className="coin-image"
                            animate={coinAnimation}
                            style={{ transformPerspective: 1000, transformStyle: 'preserve-3d' }}
                        />
                        <div className="rate-info">
                            <h3 className="rate-title">Silver</h3>
                            <p className="rate-price">
                                ₹{rates.SILVERRATE.toFixed(2)} <span className="rate-unit">{UNIT}</span>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default RatesCard;