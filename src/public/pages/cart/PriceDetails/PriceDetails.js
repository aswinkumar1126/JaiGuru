import React from "react";
import Button from "../../../components/button/Button";
import secureImage from '../../../assets/images/secure-payment.svg.svg'

const PriceDetails = ({ totalPrice, itemCount, onPlaceOrder }) => {
    return (
        <div className="price-details-card">
            <h3>PRICE DETAILS</h3>
            <div className="price-row">
                <span>Price ({itemCount} items)</span>
                <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="price-row">
                <span>Delivery Charges</span>
                <span className="free-delivery">FREE</span>
            </div>
            <div className="divider"></div>
            <div className="price-row total">
                <strong>Total Amount</strong>
                <strong>₹{totalPrice.toFixed(2)}</strong>
            </div>
            <Button
                label="PLACE ORDER"
                className="place-order-btn"
                onClick={onPlaceOrder}
                aria-label="Proceed to checkout"
            />
            <div className="secure-payment">
                <img src={secureImage} alt="Secure payment icon" loading="lazy" />
                <span>Safe and Secure Payments</span>
            </div>
        </div>
    );
};

export default PriceDetails;