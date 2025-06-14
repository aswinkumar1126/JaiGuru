// src/pages/WishlistPage.js
import React from "react";
import { useFavorites, useRemoveFavorite } from "../../hook/favorites/useFavoritesQuery";
import { useSingleProductQuery } from "../../hook/product/useSingleProductQuery";
import Loading from "../../components/loader/SkeletonLoader";
import Error from "../../components/error/Error";
import Button from "../../components/button/Button";
import { useCart } from "../../hook/cart/useCartQuery";
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight } from "react-icons/fi";
import "./WishlistPage.css";

const WishlistPage = () => {
    const { data, isLoading, isError } = useFavorites();
    
    if (isLoading) return <Loading />;
    if (isError) return <Error message="Failed to fetch wishlist" />;

    const wishlistItems = data?.data || [];

    return (
        <div className="wishlist-container">
            <div className="wishlist-header">
                <h1 className="wishlist-title">My Wishlist</h1>
                <div className="wishlist-count">{wishlistItems.length} items</div>
            </div>
            
            {wishlistItems.length === 0 ? (
                <div className="wishlist-empty-state">
                    <div className="empty-heart-icon">
                        <FiHeart size={48} />
                    </div>
                    <h3>Your Wishlist is Empty</h3>
                    <p>Start saving your favorite items to revisit them later</p>
                    <Button 
                        label="Browse Collections" 
                        variant="primary" 
                        icon={<FiArrowRight />}
                        onClick={() => window.location.href = "/products"} 
                    />
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlistItems.map((sno) => (
                        <WishlistItem key={sno} sno={sno} />
                    ))}
                </div>
            )}
        </div>
    );
};

const WishlistItem = ({ sno }) => {
    const baseUrl = "https://app.bmgjewellers.com";
    const { data: product, isLoading, isError } = useSingleProductQuery(sno);
    const { addToCartHandler } = useCart();
    const { mutate: removeFavorite, isLoading: isRemoving } = useRemoveFavorite();

    const handleAddToCart = (product) => {
        console.log("🛒 Sending to addToCartHandler:", product);
        addToCartHandler({
            itemTagSno: product.SNO,
            itemId: product.ITEMID,
            subItemId: product.SubItemId,
            tagNo: product.TAGNO,
            grsWt: parseFloat(product.GRSWT),
            netWt: parseFloat(product.NETWT),
            stnWt: 0,
            stnAmount: parseFloat(product.StoneAmount || 0),
            amount: parseFloat(product.GrandTotal || 0),
            purity: parseFloat(product.PURITY),
            quantity: 1,
        });
    };

    if (isLoading) return <Loading />;
    if (isError || !product) return <Error message="Failed to load product" />;

    let imageUrls = [];
    try {
        imageUrls = JSON.parse(product?.ImagePath || "[]");
    } catch (err) {
        console.error("Error parsing ImagePath", err);
    }

    const firstImage = imageUrls.length > 0 ? baseUrl + imageUrls[0] : "/images/placeholder.png";

    const handleRemove = () => {
        removeFavorite(sno);
    };

    return (
        <div className="wishlist-card">
            <div className="card-image-container">
                <img
                    src={firstImage}
                    alt={product.ITEMNAME}
                    className="card-image"
                    onError={(e) => {
                        e.target.src = "/fallback.jpg";
                    }}
                />
                <button 
                    className="remove-button" 
                    onClick={handleRemove}
                    disabled={isRemoving}
                    aria-label="Remove from wishlist"
                >
                    <FiTrash2 size={18} />
                    
                </button>
            </div>
            
            <div className="card-details">
                <h3 className="product-title">{product.ITEMNAME}</h3>
                <div className="product-meta">
                    <span className="tag-no">Tag: {product.SNO}</span>
                    <span className="weight">{product.NETWT}g</span>
                </div>
                <div className="price-container">
                    <span className="price">₹{Number(product.GrandTotal).toFixed(2)}</span>
                </div>
                
                <Button 
                    variant="secondary"
                    label="Add to Bag"
                    icon={<FiShoppingBag size={16} />}
                    onClick={() => handleAddToCart(product)}
                    fullWidth
                />
            </div>
        </div>
    );
};

export default WishlistPage;