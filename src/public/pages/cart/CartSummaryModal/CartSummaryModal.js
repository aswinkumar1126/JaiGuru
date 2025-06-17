import React from "react";
import Button from "../../../components/button/Button";


const CartSummaryModal = ({ isOpen, onClose, selectedItems, cartList, productMap, onCheckout }) => {
    if (!isOpen) return null;

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
        <div className="cart-summary-modal">
            <div className="modal-content">
                <button
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Close summary"
                >
                    ×
                </button>
                <h3>Cart Summary</h3>

                {selectedCartItems.length === 0 ? (
                    <p className="empty-message">
                        Please select at least one item to view the summary.
                    </p>
                ) : (
                    <>
                        <ul className="items-list">
                            {selectedCartItems.map(item => {
                                const product = productMap[item.itemTagSno] || {};
                                const itemPrice = (product.GrandTotal || item.amount || 0) * item.quantity;
                                return (
                                    <li key={item.itemTagSno}>
                                        <div className="item-details">
                                            <p className="item-name">
                                                {product.ITEMNAME || "Jewellery Item"}
                                            </p>
                                            <p>Tag No: {item.tagNo || "N/A"}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Weight: {product.NETWT || item.netWt || "N/A"}g</p>
                                        </div>
                                        <p className="item-price">
                                            ₹{itemPrice.toFixed(2)}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
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
                        <Button
                            label="CHECKOUT"
                            className="place-order-btn"
                            onClick={() => onCheckout(selectedCartItems, totalPrice)}
                            aria-label="Proceed to checkout"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default CartSummaryModal;