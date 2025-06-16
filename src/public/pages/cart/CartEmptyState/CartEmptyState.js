import React from "react";
import Button from "../../../components/button/Button";
import EmptyCartImage from '../../../assets/images/empty-cart.svg'

const CartEmptyState = () => {
    return (
        <div className="empty-cart">
            <img src={EmptyCartImage} alt="Empty cart illustration" loading="lazy" />
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet</p>
            <Button
                label="Continue Shopping"
                className="continue-shopping-btn"
                onClick={() => window.location.href = '/products'}
                aria-label="Continue shopping"
            />
        </div>
    );
};

export default CartEmptyState;