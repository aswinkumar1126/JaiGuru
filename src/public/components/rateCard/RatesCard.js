import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRatesQuery } from '../../hook/rate/useRatesQuery';
import './RatesCard.css';
import goldCoin from '../../assets/coins/goldcoin-removebg-preview.png';
import silverCoin from '../../assets/coins/silvercoin-removebg-preview.png';

const RatesCard = ({ isMobile }) => {
    const { data: rates, isLoading, error } = useRatesQuery();
    const goldCoinRef = useRef(null);
    const silverCoinRef = useRef(null);
    const goldCardRef = useRef(null);
    const silverCardRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef([]); // Store animation references

    useEffect(() => {
        // Only initialize animations if elements exist
        if (!containerRef.current || !goldCoinRef.current || !silverCoinRef.current) return;

        const ctx = gsap.context(() => {
            // Safe coin animations
            if (goldCoinRef.current) {
                const goldAnim = gsap.to(goldCoinRef.current, {
                    rotationY: 360,
                    yoyo: true,
                    repeat: -1,
                    duration: 6,
                    ease: "power1.inOut",
                    transformOrigin: "center center"
                });
                animationRef.current.push(goldAnim);
            }

            if (silverCoinRef.current) {
                const silverAnim = gsap.to(silverCoinRef.current, {
                    rotationY: 360,
                    yoyo: true,
                    repeat: -1,
                    duration: 4,
                    ease: "power1.inOut",
                    transformOrigin: "center center"
                });
                animationRef.current.push(silverAnim);
            }

            // Safe card hover animations
            if (!isMobile) {
                const cards = [];
                if (goldCardRef.current) cards.push(goldCardRef.current);
                if (silverCardRef.current) cards.push(silverCardRef.current);

                cards.forEach(card => {
                    gsap.set(card, { transformPerspective: 1000 });

                    const handleMouseEnter = () => {
                        const hoverAnim = gsap.to(card, {
                            scale: 1.05,
                            y: -5,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            duration: 0.3,
                            ease: "power2.out"
                        });
                        animationRef.current.push(hoverAnim);
                    };

                    const handleMouseLeave = () => {
                        const leaveAnim = gsap.to(card, {
                            scale: 1,
                            y: 0,
                            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                            duration: 0.3,
                            ease: "power2.out"
                        });
                        animationRef.current.push(leaveAnim);
                    };

                    card.addEventListener('mouseenter', handleMouseEnter);
                    card.addEventListener('mouseleave', handleMouseLeave);

                    // Store references for cleanup
                    animationRef.current.push({
                        cleanup: () => {
                            card.removeEventListener('mouseenter', handleMouseEnter);
                            card.removeEventListener('mouseleave', handleMouseLeave);
                        }
                    });
                });
            }
        }, containerRef);

        return () => {
            // Cleanup all animations and event listeners
            ctx.revert();
            animationRef.current.forEach(anim => {
                if (anim?.cleanup) anim.cleanup();
                else if (anim?.kill) anim.kill();
            });
            animationRef.current = [];
        };
    }, [isMobile]);

    const UNIT = '/gm ';

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
        <div className="rates-card-container" ref={containerRef}>
            {isLoading && <SkeletonLoader />}

            {error && (
                <div className="rates-error">
                    <i className="error-icon">⚠️</i>
                    <p>Failed to load rates</p>
                </div>
            )}

            {rates && (
                <div className="rates-card-wrapper">
                    {/* Gold Card */}
                    <div
                        className="rate-card gold-card"
                        ref={goldCardRef}
                    >
                        <img
                            ref={goldCoinRef}
                            src={goldCoin}
                            alt="Gold Coin"
                            className="coin-image"
                        />
                        <div className="rate-info">
                            <h3 className="rate-title">Gold</h3>
                            <p className="rate-price">
                                ₹{rates.GOLDRATE.toFixed(2)} <span className="rate-unit">{UNIT}</span>
                            </p>
                        </div>
                    </div>

                    {/* Silver Card */}
                    <div
                        className="rate-card silver-card"
                        ref={silverCardRef}
                    >
                        <img
                            ref={silverCoinRef}
                            src={silverCoin}
                            alt="Silver Coin"
                            className="coin-image"
                        />
                        <div className="rate-info">
                            <h3 className="rate-title">Silver</h3>
                            <p className="rate-price">
                                ₹{rates.SILVERRATE.toFixed(2)} <span className="rate-unit">{UNIT}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RatesCard;