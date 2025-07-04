import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiEye } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import './MobileProductCard.css';
import { useNavigate } from 'react-router-dom';
import { useAddFavorite, useRemoveFavorite, useFavorites } from '../../hook/favorites/useFavoritesQuery';

const MobileProductCard = ({ product, onQuickView, showSubItemName = false }) => {
    const user = localStorage.getItem("user");
    const navigate = useNavigate();
    const itemSno = product?.SNO;
    const { data } = useFavorites();
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [animateHeart, setAnimateHeart] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
    const displayName = showSubItemName ? product.SUBITEMNAME : product.ITEMNAME;

    const getProductImages = () => {
        try {
            const images = JSON.parse(product.ImagePath || '[]');
            return images.length > 0
                ? images.map(img => `https://jaigurujewellers.com${img}`)
                : ['/fallback.jpg'];
        } catch {
            return ['/fallback.jpg'];
        }
    };

    const images = getProductImages();
    const hasMultipleImages = images.length > 1;

    React.useEffect(() => {
        const favoriteList = data?.data || [];
        setIsWishlisted(favoriteList.includes(itemSno));
    }, [data, itemSno]);

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

    const handleImageCycle = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    return (
        <motion.div
            className="mobile-product-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileTap={{ scale: 0.98 }}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
        >
            

            <div
                className="mobile-product-image-container"
                onClick={onQuickView}
                onTouchEnd={handleImageCycle}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        src={images[currentImageIndex]}
                        alt={product.ITEMNAME}
                        className="mobile-product-image"
                        onError={(e) => (e.target.src = '/fallback.jpg')}
                        loading="lazy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    />
                </AnimatePresence>

                <motion.button
                    className={`mobile-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={handleWishlistToggle}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0 }}
                    animate={{
                        scale: 1,
                        transition: { delay: 0.2 }
                    }}
                >
                    {isWishlisted ? (
                        <motion.div
                            animate={{
                                scale: animateHeart ? [1, 1.3, 1] : 1,
                                transition: { duration: 0.5 }
                            }}
                        >
                            <AiFillHeart size={18} />
                        </motion.div>
                    ) : (
                        <FiHeart size={18} />
                    )}
                </motion.button>

                <motion.button
                    className="mobile-quick-view-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onQuickView();
                    }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FiEye size={16} />
                </motion.button>
            </div>

            <div className="mobile-product-info">
                <motion.h3
                    className="mobile-product-name"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {displayName}
                </motion.h3>

                <motion.div
                    className="mobile-product-price-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="mobile-product-price">
                        ₹{product.GrandTotal?.toLocaleString() || 'N/A'}
                    </span>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default MobileProductCard;