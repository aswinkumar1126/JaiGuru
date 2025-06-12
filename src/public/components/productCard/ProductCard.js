import React from 'react';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import './ProductCard.css';

function ProductCard({ product, onQuickView, onAddToCart, onAddToWishlist }) {
    const [isWishlisted, setIsWishlisted] = React.useState(false);

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        setIsWishlisted(!isWishlisted);
        if (onAddToWishlist) onAddToWishlist(product);
    };
    const imageUrl = product.ImagePath
        ? `https://app.bmgjewellers.com:1922/${product.ImagePath}`
        : '/fallback.jpg';

    return (
        <article className="product-card">
            <div className="product-card__badge">
                {product.isNew && <span className="badge badge--new">New</span>}
                {product.discount && <span className="badge badge--discount">-{product.discount}%</span>}
            </div>

            <div className="product-card__image-container">
                {product.image_url ? (
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
                    className={`product-card__wishlist ${isWishlisted ? 'active' : ''}`}
                    onClick={handleAddToWishlist}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <FiHeart size={18} />
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