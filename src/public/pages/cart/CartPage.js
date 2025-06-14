import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../../hook/cart/useCartQuery";
import Button from "../../components/button/Button";
import Error from "../../components/error/Error";
import Loading from "../../components/loader/SkeletonLoader";
import { useSingleProductQuery } from "../../hook/product/useSingleProductQuery";
import "./CartPage.css";
import secureImage from '../../assets/images/secure-payment.svg.svg';

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
    const { data: product, isLoading } = useSingleProductQuery(item.itemTagSno);
    const baseUrl = "https://app.bmgjewellers.com";

    if (isLoading) return <Loading />;

    let imageUrls = [];
    try {
        imageUrls = JSON.parse(product?.ImagePath || "[]");
    } catch (err) {
        console.error("Error parsing ImagePath", err);
    }

    const firstImage = imageUrls.length > 0 ? baseUrl + imageUrls[0] : "/images/placeholder.png";

    return (
        <div className="cart-item" role="listitem">
            <div className="cart-item-image-container">
                <img
                    src={firstImage}
                    alt={product?.ITEMNAME || "Jewellery item"}
                    className="cart-item-img"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = "/fallback.jpg";
                        e.target.alt = "Image not available";
                    }}
                />
            </div>
            <div className="cart-item-details">
                <h4 className="cart-item-title">{product?.ITEMNAME || "Jewellery Item"}</h4>
                <p className="cart-item-tag"><strong>Tag No:</strong> {item.tagNo}</p>
                <p className="cart-item-weight">Weight: {product?.NETWT || item.netWt}g</p>
                <p className="cart-item-price">
                    ₹{product?.GrandTotal
                        ? Number(product.GrandTotal).toFixed(2)
                        : item.amount?.toFixed(2)}
                </p>
                <div className="cart-item-actions">
                    <button
                        className="quantity-btn"
                        onClick={() => onDecrease(item)}
                        aria-label={`Decrease quantity of ${product?.ITEMNAME || "item"}`}
                        disabled={item.quantity <= 1}
                    >
                        −
                    </button>
                    <span className="quantity-value" aria-live="polite">{item.quantity}</span>
                    <button
                        className="quantity-btn"
                        onClick={() => onIncrease(item)}
                        aria-label={`Increase quantity of ${product?.ITEMNAME || "item"}`}
                    >
                        +
                    </button>
                </div>
                <div className="cart-item-options">
                    <button
                        className="remove-btn"
                        onClick={() => onRemove(item.sno)}
                        aria-label={`Remove ${product?.ITEMNAME || "item"} from cart`}
                    >
                        REMOVE
                    </button>
                    <button
                        className="save-btn"
                        onClick={() => alert("Feature coming soon")}
                        aria-label={`Save ${product?.ITEMNAME || "item"} for later`}
                    >
                        SAVE FOR LATER
                    </button>
                </div>
            </div>
        </div>
    );
};

const CartSummaryModal = ({ isOpen, onClose, totalPrice, itemCount, onCheckout }) => {
    if (!isOpen) return null;

    return (
        <div className="cart-summary-modal">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose} aria-label="Close summary">
                    ×
                </button>
                <h3>Cart Summary</h3>
                <div className="price-row">
                    <span>Price ({itemCount} items)</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="price-row">
                    <span>Delivery Charges</span>
                    <span className="free-delivery">FREE</span>
                </div>
                <div className="price-row total">
                    <strong>Total Amount</strong>
                    <strong>₹{totalPrice.toFixed(2)}</strong>
                </div>
                <Button
                    label="CHECKOUT"
                    className="place-order-btn"
                    onClick={onCheckout}
                    aria-label="Proceed to checkout"
                />
            </div>
        </div>
    );
};

const CartPage = () => {
    const { cartItems, isLoading, updateCart, deleteCart, error } = useCart();
    const [isSticky, setIsSticky] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const priceDetailsRef = useRef(null);
    const cartContainerRef = useRef(null);
    const cartList = cartItems?.data || [];

    // Handle screen size detection
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Run on mount to set initial state
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle sticky price details
    useEffect(() => {
        const handleScroll = () => {
            if (!priceDetailsRef.current || !cartContainerRef.current) return;
            const priceDetailsTop = priceDetailsRef.current.getBoundingClientRect().top;
            const cartContainerBottom = cartContainerRef.current.getBoundingClientRect().bottom;
            const viewportHeight = window.innerHeight;
            setIsSticky(priceDetailsTop <= 80 && cartContainerBottom > viewportHeight);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Ensure cart-actions-mobile visibility on mount for mobile
    useEffect(() => {
        if (isMobile && cartList.length > 0) {
            const mobileActions = document.querySelector('.cart-actions-mobile');
            if (mobileActions) {
                mobileActions.style.display = 'flex';
            }
        }
    }, [isMobile, cartList.length]);

    if (isLoading) return <Loading />;
    if (error && !cartList.length) {
        return <Error message={error.message || "Something went wrong"} />;
    }

    const handleIncrease = (item) => {
        updateCart({ ...item, quantity: item.quantity + 1 });
    };

    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            updateCart({ ...item, quantity: item.quantity - 1 });
        }
    };

    const getTotalPrice = () => {
        return cartList.reduce((total, item) => total + (item.amount * item.quantity), 0) || 0;
    };

    return (
        <div className="cart-page" role="main">
            <div className="cart-header">
                <h1>My Cart ({cartList.length})</h1>
                {cartList.length > 0 && (
                    <div className="delivery-info">
                        <span className="delivery-badge">Delivery in 2-5 days</span>
                    </div>
                )}
            </div>
            <div className="cart-container" ref={cartContainerRef}>
                <div className="cart-left">
                    {cartList.length === 0 ? (
                        <div className="empty-cart">
                            <img src="/images/empty-cart.svg" alt="Empty cart illustration" loading="lazy" />
                            <h3>Your cart is empty</h3>
                            <p>Looks like you haven't added anything to your cart yet</p>
                            <Button
                                label="Continue Shopping"
                                className="continue-shopping-btn"
                                onClick={() => window.location.href = '/'}
                                aria-label="Continue shopping"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="cart-items-list" role="list">
                                {cartList.map((item) => (
                                    <CartItem
                                        key={item.sno}
                                        item={item}
                                        onIncrease={handleIncrease}
                                        onDecrease={handleDecrease}
                                        onRemove={deleteCart}
                                    />
                                ))}
                            </div>
                            {isMobile && cartList.length > 0 && (
                                <div className="cart-actions-mobile">
                                    <div className="price-summary-mobile">
                                        <span>₹{getTotalPrice().toFixed(2)}</span>
                                        <span className="delivery-text">FREE delivery</span>
                                    </div>
                                    <Button
                                        label="VIEW SUMMARY"
                                        className="place-order-btn-mobile"
                                        onClick={() => setIsModalOpen(true)}
                                        aria-label="View cart summary"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
                {cartList.length > 0 && !isMobile && (
                    <div className={`cart-right ${isSticky ? 'sticky' : ''}`} ref={priceDetailsRef}>
                        <div className="price-details-card">
                            <h3>PRICE DETAILS</h3>
                            <div className="price-row">
                                <span>Price ({cartList.length} items)</span>
                                <span>₹{getTotalPrice().toFixed(2)}</span>
                            </div>
                            <div className="price-row">
                                <span>Delivery Charges</span>
                                <span className="free-delivery">FREE</span>
                            </div>
                            <div className="divider"></div>
                            <div className="price-row total">
                                <strong>Total Amount</strong>
                                <strong>₹{getTotalPrice().toFixed(2)}</strong>
                            </div>
                            <Button
                                label="PLACE ORDER"
                                className="place-order-btn"
                                onClick={() => alert("Proceed to checkout")}
                                aria-label="Proceed to checkout"
                            />
                            <div className="secure-payment">
                                <img src={secureImage} alt="Secure payment icon" loading="lazy" />
                                <span>Safe and Secure Payments</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <CartSummaryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                totalPrice={getTotalPrice()}
                itemCount={cartList.length}
                onCheckout={() => alert("Proceed to checkout")}
            />
        </div>
    );
};

export default CartPage;