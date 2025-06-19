import React from 'react';

const PaymentOptions = ({ paymentMode, onChange }) => (
    <select
        className="payment-select"
        value={paymentMode}
        onChange={onChange}
        required
    >
        <option value="">Select Payment Mode</option>
        <option value="CASH">Cash on Delivery</option>
        <option value="ONLINE">Online Payment</option>
    </select>
);

export default PaymentOptions;