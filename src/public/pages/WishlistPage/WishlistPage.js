import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites, useRemoveFavorite } from "../../hook/favorites/useFavoritesQuery";
import { useSingleProductQuery } from "../../hook/product/useSingleProductQuery";
import Loading from "../../components/loader/SkeletonLoader";
import Error from "../../components/error/Error";
import Button from "../../components/button/Button";
import { useCart } from "../../hook/cart/useCartQuery";
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight } from "react-icons/fi";
import "./WishlistPage.css";
import { useNavigate } from "react-router-dom";
const WishlistPage = () => {
    const { data, isLoading, isError } = useFavorites();

    if (isLoading) return <Loading />;
    if (isError) return <Error message="Failed to fetch wishlist" />;

    const wishlistItems = data?.data || [];

    return (
        <motion.div
            className="wishlist-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="wishlist-header">
                <motion.h1
                    className="wishlist-title"
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    My Wishlist
                </motion.h1>
                <motion.div
                    className="wishlist-count"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                >
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                </motion.div>
            </div>

            {wishlistItems.length === 0 ? (
                <motion.div
                    className="wishlist-empty-state"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.div
                        className="empty-heart-icon"
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            repeatDelay: 3
                        }}
                    >
                        <FiHeart size={48} />
                    </motion.div>
                    <h3>Your Wishlist is Empty</h3>
                    <p>Start saving your favorite items to revisit them later</p>
                    <Button
                        label="Browse Collections"
                        variant="primary"
                        icon={<FiArrowRight />}
                        onClick={() => window.location.href = "/products"}
                    />
                </motion.div>
            ) : (
                <motion.div
                    className="wishlist-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <AnimatePresence>
                        {wishlistItems.map((sno) => (
                            <WishlistItem key={sno} sno={sno} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.div>
    );
};

const WishlistItem = ({ sno }) => {
    const baseUrl = "https://app.bmgjewellers.com";
    const { data: product, isLoading, isError } = useSingleProductQuery(sno);
    const { addToCartHandler } = useCart();
    const { mutate: removeFavorite, isLoading: isRemoving } = useRemoveFavorite();
    const navigate=useNavigate()

    const handleAddToCart = (product) => {
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

    const handleRemove = (e) => {
        e.stopPropagation();
        removeFavorite(sno);
    };
    console.log(product);

    const handleImageClick = (product) =>{
        navigate(`/product/${product.SNO}`)  
    }
    return (
        <motion.div
            className="wishlist-card"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            whileHover={{
                y: -5,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
            }}
        >
            <motion.div
                className="card-image-container"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleImageClick(product)}
            >
                <img
                    src={firstImage}
                    alt={product.ITEMNAME}
                    className="card-image"
                    onError={(e) => {
                        e.target.src = "/fallback.jpg";
                    }}
                />
                <motion.button
                    className="remove-button"
                    onClick={handleRemove}
                    disabled={isRemoving}
                    aria-label="Remove from wishlist"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FiTrash2 size={18} />
                </motion.button>
            </motion.div>

            <div className="card-details">
                <motion.h3
                    className="product-title"
                    whileHover={{ color: '#d4af37' }}
                    transition={{ duration: 0.3 }}
                >
                    {product.ITEMNAME}
                </motion.h3>
                <div className="product-meta">
                    <span className="weight">{product.NETWT}g</span>
                </div>
                <div className="price-container">
                    <motion.span
                        className="price"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        ₹{Number(product.GrandTotal).toFixed(2)}
                    </motion.span>
                </div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        variant="secondary"
                        label="Add to Bag"
                        icon={<FiShoppingBag size={16} />}
                        onClick={() => handleAddToCart(product)}
                        fullWidth
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default WishlistPage;