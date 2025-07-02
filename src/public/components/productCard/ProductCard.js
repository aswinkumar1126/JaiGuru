import React, { useEffect, useState } from 'react';
import { FiHeart, FiEye } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import './ProductCard.css';
import {
    useAddFavorite,
    useRemoveFavorite,
    useFavorites,
} from '../../hook/favorites/useFavoritesQuery';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product, onQuickView, showSubItemName = false}) {
    const user = localStorage.getItem("user");
    const navigate = useNavigate();
    const itemSno = product?.SNO;
    const { data } = useFavorites();
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [animateHeart, setAnimateHeart] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
   
    const displayName = showSubItemName ? product.SUBITEMNAME : product.ITEMNAME;
    const getProductImages = () => {
        try {
            const images = JSON.parse(product.ImagePath || '[]');
            return images.length > 0
                ? images.map(img => `https://app.bmgjewellers.com${img}`)
                : ['/fallback.jpg'];
        } catch {
            return ['/fallback.jpg'];
        }
    };

    const images = getProductImages();
    const hasMultipleImages = images.length > 1;

    useEffect(() => {
        const favoriteList = data?.data || [];
        setIsWishlisted(favoriteList.includes(itemSno));
    }, [data, itemSno]);

    useEffect(() => {
        if (isHovered && hasMultipleImages) {
            const timer = setTimeout(() => {
                setCurrentImageIndex(prev => (prev + 1) % images.length);
            }, 1500); // Changed from 2000ms to 800ms
            return () => clearTimeout(timer);
        } else {
            setCurrentImageIndex(0);
        }
    }, [isHovered, currentImageIndex, hasMultipleImages, images.length]);

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            localStorage.setItem(
                "redirectAfterLogin",
                JSON.stringify({
                    path: window.location.pathname,
                    action: "wishlistToggle",
                    itemSno: itemSno,
                    isWishlisted: isWishlisted,
                })
            );
            navigate("/login");
            return;
        }

        setAnimateHeart(true);
        if (isWishlisted) {
            removeFavorite.mutate(itemSno);
        } else {
            addFavorite.mutate(itemSno);
        }
        setIsWishlisted(!isWishlisted);
        setTimeout(() => setAnimateHeart(false), 800);
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            localStorage.setItem(
                "redirectAfterLogin",
                JSON.stringify({
                    path: window.location.pathname,
                    action: "quickView",
                    itemSno: itemSno,
                })
            );
            navigate("/login");
            return;
        }

        onQuickView();
    };

    return (
        <motion.article
            className="product-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
           

            <div className="product-card__image-container" onClick={handleQuickView}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        className="product-card__image-wrapper"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            src={images[currentImageIndex]}
                            alt={product.ITEMNAME}
                            className="product-card__image"
                            loading="lazy"
                            width="300"
                            height="300"
                        />
                    </motion.div>
                </AnimatePresence>

                <motion.button
                    className={`product-card__quick-view ${isHovered ? 'visible' : ''}`}
                    onClick={handleQuickView}
                    aria-label={`Quick view ${product.SNO}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : 10
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <FiEye size={18} />
                    <span>Quick View</span>
                </motion.button>

                <motion.button
                    className={`product-card__wishlist ${isWishlisted ? 'active' : ''} ${animateHeart ? 'animate' : ''}`}
                    onClick={handleWishlistToggle}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        transition: { delay: 0.2 }
                    }}
                >
                    {isWishlisted ? (
                        <motion.div
                            key="filled"
                            initial={{ scale: 0 }}
                            animate={{
                                scale: animateHeart ? [1, 1.5, 1] : 1,
                                transition: {
                                    duration: animateHeart ? 0.8 : 0.3,
                                    ease: "backOut"
                                }
                            }}
                        >
                            <AiFillHeart size={20} className="filled-heart" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="outline"
                            initial={{ scale: 0 }}
                            animate={{
                                scale: 1,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <FiHeart size={20} className="outline-heart" />
                        </motion.div>
                    )}
                </motion.button>
            </div>

            <motion.div
                className="product-card__info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <motion.h3
                    className="product-card__name"
                    title={product.ITEMNAME}
                    whileHover={{ color: '#d4af37' }}
                    transition={{ duration: 0.3 }}
                >
                    {displayName}
                </motion.h3>

                <motion.div
                    className="product-card__price"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.span
                        className="product-card__current-price"
                        initial={{ y: 10 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        ₹{product.GrandTotal?.toLocaleString() || 'N/A'}
                    </motion.span>
                </motion.div>
            </motion.div>
        </motion.article>
    );
}

export default ProductCard;