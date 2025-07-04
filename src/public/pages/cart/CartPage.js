import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hook/cart/useCartQuery";

import Button from "../../components/button/Button";
import Error from "../../components/error/Error";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import CartItem from "../../pages/cart/CartItem/CartItem";
import CartSummaryModal from "../../pages/cart/CartSummaryModal/CartSummaryModal";
import CartActions from "../../pages/cart/CartActions/CartActions";
import CartEmptyState from "../../pages/cart/CartEmptyState/CartEmptyState";
import PriceDetails from "../../pages/cart/PriceDetails/PriceDetails";
import RecentlyViewedPage from "../recentlyViewed/RecentlyViewed";

import "./CartPage.css";

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, isLoading, deleteCart, error } = useCart();

    console.log('cartitems', cartItems.data);

    const cartList = Array.isArray(cartItems?.data) ? cartItems.data : [];
    const [productMap, setProductMap] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSticky, setIsSticky] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const priceDetailsRef = useRef(null);
    const cartContainerRef = useRef(null);

    const baseUrl = "https://jaigurujewellers.com";

    // 🔁 Handle responsive layout
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 📌 Sticky right price panel (desktop)
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

    // 📱 Show mobile cart actions only if applicable
    useEffect(() => {
        const mobileActions = document.querySelector('.cart-actions-mobile');
        if (isMobile && cartList.length > 0 && mobileActions) {
            mobileActions.style.display = 'flex';
        }
    }, [isMobile, cartList.length]);

    // ✅ Sync selected items from cartList (avoid unnecessary re-renders)
    useEffect(() => {
        const newSelected = cartList.map(item => item.itemTagSno).filter(Boolean);
        setSelectedItems(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(newSelected)) {
                return newSelected;
            }
            return prev;
        });
    }, [cartList]);

    // 💰 Total price based on selected items
    const getTotalPrice = () => {
        return cartList.reduce((total, item) => {
            if (selectedItems.includes(item.itemTagSno)) {
                const product = productMap[item.itemTagSno] || {};
                const price = product.GrandTotal || item.amount || 0;
                return total + price * item.quantity;
            }
            return total;
        }, 0);
    };

    // 🖱️ Toggle selection of item
    const handleItemSelect = (sno) => {
        if (!sno) return;
        setSelectedItems(prev =>
            prev.includes(sno) ? prev.filter(id => id !== sno) : [...prev, sno]
        );
    };

    // 🛒 Place Order
    const handlePlaceOrder = () => {
        const orderItems = cartList
            .filter(item => selectedItems.includes(item.itemTagSno))
            .map(item => {
                const product = productMap[item.itemTagSno] || {};
                let imageUrls = [];

                try {
                    imageUrls = JSON.parse(product.ImagePath || "[]");
                } catch (err) {
                    console.error("Error parsing ImagePath", err);
                }

                const firstImage = imageUrls?.[0] ? baseUrl + imageUrls[0] : null;

                return {
                    productId: item.id || item.itemTagSno,
                    name: product.ITEMNAME || item.name || "Unknown",
                    quantity: item.quantity,
                    price: product.GrandTotal || item.amount || 0,
                    image: firstImage ?? "/fallback.jpg",
                    tagNo: product.TAGNO,
                    itemId: product.ITEMID,
                    sno: item.itemTagSno,
                    image_path: firstImage,
                };
            });

        if (orderItems.length === 0) {
            alert("Please select at least one item to place the order.");
            return;
        }

        const orderData = {
            cartItems: orderItems,
            totalAmount: orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        };

        navigate('/order', { state: orderData });
    };


    // ⏳ Loading & Error states
    if (isLoading) return <SkeletonLoader />;
    if (error && !cartList.length) {
        return <Error message={error.message || "Something went wrong"} />;
    }

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
                        <CartEmptyState />
                    ) : (
                        <>
                            <div className="cart-items-list" role="list">
                                {cartList.map(item => (
                                    <CartItem
                                        key={item.sno}
                                        item={item}
                                        onRemove={deleteCart}
                                        onProductDataReady={(sno, product) =>
                                            setProductMap(prev => ({ ...prev, [sno]: product }))
                                        }
                                        isSelected={selectedItems.includes(item.itemTagSno)}
                                        onSelectToggle={handleItemSelect}
                                    />
                                ))}
                            </div>

                            {isMobile && (
                                <CartActions
                                    totalPrice={getTotalPrice()}
                                    onViewSummary={() => setIsModalOpen(true)}
                                />
                            )}
                        </>
                    )}
                </div>

                {cartList.length > 0 && !isMobile && (
                    <div
                        className={`cart-right ${isSticky ? 'sticky' : ''}`}
                        ref={priceDetailsRef}
                    >
                        <PriceDetails
                            totalPrice={getTotalPrice()}
                            itemCount={selectedItems.length}
                            onPlaceOrder={handlePlaceOrder}
                        />
                    </div>
                )}
            </div>

            <CartSummaryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedItems={selectedItems}
                cartList={cartList}
                productMap={productMap}
                onCheckout={(selectedItems, total) => {
                    alert(`Proceeding to checkout with ₹${total.toFixed(2)}`);
                    handlePlaceOrder();
                }}
            />

            <RecentlyViewedPage />
        </div>
    );
};

export default CartPage;
