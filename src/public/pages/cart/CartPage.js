import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../../hook/cart/useCartQuery";
import Button from "../../components/button/Button";
import Error from "../../components/error/Error";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import CartItem from "../../pages/cart/CartItem/CartItem";
import CartSummaryModal from "../../pages/cart/CartSummaryModal/CartSummaryModal";
import CartActions from "../../pages/cart/CartActions/CartActions";
import CartEmptyState from "../../pages/cart/CartEmptyState/CartEmptyState";
import PriceDetails from "../../pages/cart/PriceDetails/PriceDetails";
import "./CartPage.css";

import { useNavigate } from "react-router-dom";
import RecentlyViewedPage from "../recentlyViewed/RecentlyViewed";


const CartPage = () => {
    const { cartItems, isLoading, updateCart, deleteCart, error } = useCart();
    const [isSticky, setIsSticky] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const priceDetailsRef = useRef(null);
    const cartContainerRef = useRef(null);
    const cartList = Array.isArray(cartItems?.data) ? cartItems.data : [];
    const [productMap, setProductMap] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    useEffect(() => {
        if (isMobile && cartList.length > 0) {
            const mobileActions = document.querySelector('.cart-actions-mobile');
            if (mobileActions) {
                mobileActions.style.display = 'flex';
            }
        }
    }, [isMobile, cartList.length]);

    useEffect(() => {
        // Initialize selectedItems with all itemTagSno values from cartList
        setSelectedItems(cartList.map(item => item.itemTagSno).filter(sno => sno));
    }, [cartList]);

  

    if (isLoading) return <SkeletonLoader />;
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
        return cartList.reduce((total, item) => {
            if (selectedItems.includes(item.itemTagSno)) {
                const product = productMap[item.itemTagSno] || {};
                const price = product.GrandTotal || item.amount || 0;
                return total + price * item.quantity;
            }
            return total;
        }, 0);
    };

    const handleItemSelect = (sno) => {
        if (!sno) return; // Prevent invalid selections
        setSelectedItems((prevSelected) => {
            const newSelected = prevSelected.includes(sno)
                ? prevSelected.filter(id => id !== sno)
                : [...prevSelected, sno];
            // console.log("Updated Selected Items:", newSelected);
            return newSelected;
        });
    };



    const baseUrl = "https://app.bmgjewellers.com";

    const handlePlaceOrder = () => {
        const orderItems = cartList
            .filter(item => selectedItems.includes(item.itemTagSno))
            .map((item) => {
                const product = productMap[item.itemTagSno] || {};
                let imageUrls = [];

                try {
                    imageUrls = JSON.parse(product.ImagePath || "[]");
                } catch (err) {
                    console.error("Error parsing ImagePath", err);
                }

                const firstImage = imageUrls.length > 0 ? baseUrl + imageUrls[0] : "/fallback.jpg";

                return {
                    productId: item.id || item.itemTagSno,
                    name: product.ITEMNAME || item.name || "Unknown",
                    quantity: item.quantity,
                    price: product.GrandTotal || item.amount || 0,
                    image: firstImage,
                };
            });

        // console.log("orderItems", orderItems);

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
                                {cartList.map((item) => (
                                    <CartItem
                                        key={item.sno}
                                        item={item}
                                        onIncrease={handleIncrease}
                                        onDecrease={handleDecrease}
                                        onRemove={deleteCart}
                                        onProductDataReady={(sno, product) => {
                                            setProductMap((prev) => ({ ...prev, [sno]: product }));
                                        }}
                                        isSelected={selectedItems.includes(item.itemTagSno)}
                                        onSelectToggle={handleItemSelect}
                                    />
                                ))}
                            </div>
                            {isMobile && cartList.length > 0 && (
                                <CartActions
                                    totalPrice={getTotalPrice()}
                                    onViewSummary={() => setIsModalOpen(true)}
                                />
                            )}
                        </>
                    )}
                </div>

                {cartList.length > 0 && !isMobile && (
                    <div className={`cart-right ${isSticky ? 'sticky' : ''}`} ref={priceDetailsRef}>
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
                    // console.log("Selected Order Items:", selectedItems);
                    alert(`Proceeding to checkout with ₹${total.toFixed(2)}`);
                    handlePlaceOrder();
                }}
            />
            <RecentlyViewedPage />
        </div>
    );
};

export default CartPage;