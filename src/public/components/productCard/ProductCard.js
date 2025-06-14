import React, { useEffect, useState } from 'react';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import './ProductCard.css';
import {
    useAddFavorite,
    useRemoveFavorite,
    useFavorites,
} from '../../hook/favorites/useFavoritesQuery';


function ProductCard({ product, onQuickView, onAddToCart }) {
    const itemSno = product?.SNO;
    const { data } = useFavorites(); // fetch current favorites
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [animateHeart, setAnimateHeart] = useState(false);

    // Extract first image from ImagePath JSON
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

    // Update wishlist state based on server data
    useEffect(() => {
        const favoriteList = data?.data || [];
        setIsWishlisted(favoriteList.includes(itemSno));
    }, [data, itemSno]);

    // Toggle wishlist state with animation
    const handleWishlistToggle = (e) => {
        e.preventDefault();
        setAnimateHeart(true);

        if (isWishlisted) {
            removeFavorite.mutate(itemSno);
        } else {
            addFavorite.mutate(itemSno);
        }

        setIsWishlisted(!isWishlisted); // optimistic update

        // Reset animation class
        setTimeout(() => setAnimateHeart(false), 300);
    };

    return (
        <article className="product-card">
            <div className="product-card__badge">
                {product.isNew && <span className="badge badge--new">New</span>}
                {product.discount && (
                    <span className="badge badge--discount">-{product.discount}%</span>
                )}
            </div>

            <div className="product-card__image-container">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.ITEMNAME}
                        className="product-card__image"
                        loading="lazy"
                        width="300"
                        height="300"
                    />
                ) : (
                    <div className="product-card__image-placeholder">
                        <span>No Image Available</span>
                    </div>
                )}

                <button
                    className="product-card__quick-view"
                    onClick={onQuickView}
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
                    {isWishlisted ? <AiFillHeart size={18} /> : <FiHeart size={18} />}
                </button>
            </div>

            <div className="product-card__info">
                <h3 className="product-card__name">{product.ITEMNAME}</h3>
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
                    onClick={onAddToCart}
                    aria-label={`Add ${product.ITEMNAME} to cart`}
                >
                    <FiShoppingCart size={16} />
                    <span>Add to Cart</span>
                </button>
            </div>
        </article>
    );
}

export default ProductCard;
