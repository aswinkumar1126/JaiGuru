import React from "react";
import Button from "../../../components/button/Button";

const CartActions = ({ totalPrice, onViewSummary }) => {
    return (
        <div className="cart-actions-mobile">
            <div className="price-summary-mobile">
                <span>₹{totalPrice.toFixed(2)}</span>
                <span className="delivery-text">FREE delivery</span>
            </div>
            <Button
                label="VIEW SUMMARY"
                className="place-order-btn-mobile"
                onClick={onViewSummary}
                aria-label="View cart summary"
            />
        </div>
    );
};

export default CartActions;