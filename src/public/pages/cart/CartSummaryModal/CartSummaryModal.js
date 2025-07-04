import React from "react";
import Button from "../../../components/button/Button";
import "./CartSummaryModal.css";

const CartSummaryModal = ({ isOpen, onClose, selectedItems, cartList, productMap, onCheckout }) => {
    if (!isOpen) return null;

    const baseUrl = 'https://jaigurujewellers.com';

    const selectedCartItems = cartList.filter(item =>
        selectedItems.includes(item.itemTagSno) && item.itemTagSno
    );

    const totalPrice = selectedCartItems.reduce((total, item) => {
        const product = productMap[item.itemTagSno] || {};
        const grandTotal = product.GrandTotal || item.amount || 0;
        return total + grandTotal * item.quantity;
    }, 0);

    const totalItemCount = selectedCartItems.reduce(
        (count, item) => count + item.quantity,
        0
    );


    return (
        <div className="cart-summary-modal-overlay">
            <div className="cart-summary-modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>Order Summary</h3>
                        <button
                            className="modal-close"
                            onClick={onClose}
                            aria-label="Close summary"
                        >
                            ×
                        </button>
                    </div>

                    {selectedCartItems.length === 0 ? (
                        <p className="empty-message">
                            Please select at least one item to view the summary.
                        </p>
                    ) : (
                        <>
                            <div className="items-list-container">
                                <ul className="items-list">
                                    {selectedCartItems.map(item => {
                                        const product = productMap[item.itemTagSno] || {};
                                        const itemPrice = (product.GrandTotal || item.amount || 0) * item.quantity;

                                        // Get image URLs for this specific product
                                        let imageUrls = [];
                                        try {
                                            imageUrls = JSON.parse(product.ImagePath || "[]");
                                        } catch (err) {
                                            console.error("Error parsing ImagePath", err);
                                        }
                                        const firstImage = imageUrls?.[0] ? `${baseUrl}${imageUrls[0]}` : null;

                                        return (
                                            <li key={item.itemTagSno} className="cart-item">
                                                <div className="item-image">
                                                    {firstImage ? (
                                                        <img
                                                            src={firstImage || "/fallback.jpg"}
                                                            onError={(e) => (e.target.src = "/fallback.jpg")}
                                                            alt={product.ITEMNAME || "Jewellery Item"}
                                                        />
                                                    ) : (
                                                        <div className="image-placeholder">
                                                            <span>Jewellery</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="item-details">
                                                    <p className="item-name">
                                                        {product.ITEMNAME || "Jewellery Item"}
                                                    </p>

                                                    <div className="item-meta">
                                                        <span>Tag No: {item.tagNo || "N/A"}</span>
                                                        <span>Qty: {item.quantity}</span>
                                                        <span>{product.NETWT || item.netWt || "N/A"}g</span>
                                                    </div>
                                                </div>
                                                <p className="item-price">
                                                    <span className="item-price-title">Price</span> ₹{itemPrice.toFixed(2)}
                                                </p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className="price-summary">
                                <div className="price-row">
                                    <span>Price ({totalItemCount} items)</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="price-row">
                                    <span>Delivery Charges</span>
                                    <span className="free-delivery">FREE</span>
                                </div>
                                <div className="price-row total">
                                    <span>Total Amount</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <Button
                                    label="PROCEED TO CHECKOUT"
                                    className="checkout-btn"
                                    onClick={() => onCheckout(selectedCartItems, totalPrice)}
                                    aria-label="Proceed to checkout"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

};

export default CartSummaryModal;