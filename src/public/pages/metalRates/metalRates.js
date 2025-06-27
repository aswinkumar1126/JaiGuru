import React, { useEffect, useRef } from 'react';
import { useRatesQuery } from '../../hook/rate/useRatesQuery';
import GoldCoin from '../../assets/coins/goldcoin-removebg-preview.png';
import SilverCoin from '../../assets/coins/silvercoin-removebg-preview.png';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useMediaQuery } from 'react-responsive';
import 'magic.css/dist/magic.min.css';
import './RatesPage.css';

const RatesPage = () => {
    const { data: rates, isLoading, isError, error } = useRatesQuery();
    const isDesktop = useMediaQuery({ minWidth: 768 });
    const coinRefs = useRef([]);
    const titleRef = useRef(null);
    const containerRef = useRef(null);

    // GSAP Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current, {
                y: -30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });

            const [goldCoin, silverCoin] = coinRefs.current;

            if (isDesktop) {
                gsap.to(goldCoin, {
                    rotationY: 360,
                    yoyo: true,
                    repeat: -1,
                    duration: 8,
                    ease: "power1.inOut"
                });

                gsap.to(silverCoin, {
                    rotationY: 360,
                    yoyo: true,
                    repeat: -1,
                    duration: 6,
                    ease: "power1.inOut",
                    delay: 0.5
                });
            } else {
                gsap.to(goldCoin, {
                    y: -5,
                    yoyo: true,
                    repeat: -1,
                    duration: 2,
                    ease: "sine.inOut"
                });

                gsap.to(silverCoin, {
                    y: -5,
                    yoyo: true,
                    repeat: -1,
                    duration: 2.5,
                    ease: "sine.inOut",
                    delay: 0.3
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [isDesktop]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    if (isLoading) return (
        <div className="rp-loading">
            <div className="rp-loading-spinner"></div>
            <p>Fetching current rates...</p>
        </div>
    );

    if (isError) return (
        <div className="rp-error">
            <p>Error loading rates: {error.message}</p>
        </div>
    );

    const RateCard = ({ type, rate, coinImg, delay = 0 }) => {
        const isGold = type === 'Gold';
        return (
            <motion.div
                className={`rp-card ${isGold ? 'rp-gold' : 'rp-silver'}`}
                variants={cardVariants}
                whileHover={{ scale: isDesktop ? 1.03 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay }}
            >
                <div className="rp-coin-container">
                    <img
                        ref={el => coinRefs.current[isGold ? 0 : 1] = el}
                        src={coinImg}
                        alt={type}
                        className="rp-coin"
                    />
                </div>
                <div className="rp-rate-content">
                    <h2>{type} ({isGold ? '24K' : '99.9%'})</h2>
                    <p className="rp-rate-value">
                        ₹{rate?.toLocaleString() || '--'}
                        <span className="rp-rate-per">per gram</span>
                    </p>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="rates-page-container" ref={containerRef}>
            <motion.div
                className="rp-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h1 className="rp-title" ref={titleRef}>
                    {isDesktop ? "Today's Precious Metal Rates" : "Today's Rates"}
                </h1>
                {isDesktop && <p className="rp-subtitle">Updated every 5 minutes</p>}

                <div className={isDesktop ? "rp-grid" : "rp-mobile-row"}>
                    <RateCard
                        type="Gold"
                        rate={rates?.GOLDRATE}
                        coinImg={GoldCoin}
                    />
                    <RateCard
                        type="Silver"
                        rate={rates?.SILVERRATE}
                        coinImg={SilverCoin}
                        delay={isDesktop ? 0.1 : 0}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default RatesPage;