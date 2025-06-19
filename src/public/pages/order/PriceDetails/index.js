import React from 'react';

const PriceDetails = ({ items, totalAmount, onSubmit, isLoading, paymentMode }) => {
    const platformFee = 4;
    const protectionFee = 19;
    const totalPayable = totalAmount + platformFee + protectionFee;

    return (
        <div className="price-details">
            <h3>PRICE DETAILS</h3>
            <div className="price-breakdown">
                <p>Price ({items.length} item{items.length !== 1 ? 's' : ''}): ₹{totalAmount}</p>
                <p>Platform Fee: ₹{platformFee}</p>
                <p>Protection Fee: ₹{protectionFee}</p>
                <hr />
                <p className="total-payable">
                    <strong>Total Payable: ₹{totalPayable}</strong>
                </p>
                <p className="savings">Your Total Savings on this order ₹47</p>
            </div>
            <button
                className="place-order-btn"
                onClick={onSubmit}
                disabled={isLoading || !paymentMode}
            >
                {isLoading ? 'Placing Order...' : 'Place Order'}
            </button>
        </div>
    );
};

export default PriceDetails;