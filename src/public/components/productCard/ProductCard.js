import React, { useEffect, useState } from 'react';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import './ProductCard.css';
import {
    useAddFavorite,
    useRemoveFavorite,
    useFavorites,
} from '../../hook/favorites/useFavoritesQuery';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product, onQuickView, onAddToCart }) {
    const user = localStorage.getItem("user");
    const navigate = useNavigate();
    const itemSno = product?.SNO;
    const { data } = useFavorites();
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [animateHeart, setAnimateHeart] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const getFirstProductImage = (imagePath) => {
        try {
            const images = JSON.parse(imagePath || '[]');
            return images.length > 0
                ? `https://app.bmgjewellers.com${images[0]}`
                : '/fallback.jpg';
        } catch {
            return '/fallback.jpg';
        }
    };

    const imageUrl = getFirstProductImage(product.ImagePath);

    useEffect(() => {
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
        setTimeout(() => setAnimateHeart(false), 500);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user) {
            localStorage.setItem(
                "redirectAfterLogin",
                JSON.stringify({
                    path: window.location.pathname,
                    action: "addToCart",
                    itemSno: itemSno,
                })
            );
            navigate("/login");
            return;
        }
        onAddToCart();

        
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
        <article
            className="product-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="product-card__badge">
                {product.isNew && <span className="badge badge--new">New</span>}
                {product.discount && (
                    <span className="badge badge--discount">-{product.discount}%</span>
                )}
            </div>

            <div className="product-card__image-container" onClick={handleQuickView}>
                {imageUrl ? (
                    <>
                        {!imageLoaded && (
                            <div className="product-card__image-skeleton"></div>
                        )}
                        <img
                            src={imageUrl}
                            alt={product.ITEMNAME}
                            className={`product-card__image ${imageLoaded ? 'loaded' : ''}`}
                            loading="lazy"
                            width="300"
                            height="300"
                            onLoad={() => setImageLoaded(true)}
                        />
                    </>
                ) : (
                    <div className="product-card__image-placeholder">
                        <span>No Image Available</span>
                    </div>
                )}

                <button
                    className={`product-card__quick-view ${isHovered ? 'visible' : ''}`}
                    onClick={handleQuickView}
                    aria-label={`Quick view ${product.SNO}`}
                >
                    <FiEye size={18} />
                    <span>Quick View</span>
                </button>

                <button
                    className={`product-card__wishlist ${isWishlisted ? 'active' : ''} ${animateHeart ? 'animate' : ''}`}
                    onClick={handleWishlistToggle}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    {isWishlisted ? (
                        <AiFillHeart size={20} className="filled-heart" />
                    ) : (
                        <FiHeart size={20} className="outline-heart" />
                    )}
                </button>
            </div>

            <div className="product-card__info">
                <h3 className="product-card__name" title={product.ITEMNAME}>
                    {product.ITEMNAME}
                </h3>
                <div className="product-card__price">
                    {product.originalPrice && (
                        <span className="product-card__original-price">
                            ₹{product.originalPrice.toLocaleString()}
                        </span>
                    )}
                    <span className="product-card__current-price">
                        ₹{product.GrandTotal?.toLocaleString() || 'N/A'}
                    </span>
                </div>

                <button
                    className="product-card__add-to-cart"
                    onClick={handleAddToCart}
                    aria-label={`Add ${product.ITEMNAME} to cart`}
                >
                    <FiShoppingCart size={16} />
                    <span>Add to Cart</span>
                    <span className="product-card__cart-effect"></span>
                </button>
            </div>
        </article>
    );
}

export default ProductCard;