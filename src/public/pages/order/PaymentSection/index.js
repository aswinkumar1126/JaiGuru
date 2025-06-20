import React from 'react';
import PaymentOptions from './PaymentOptions';

const PaymentSection = ({ paymentMode, onChange }) => (
    <section className="order-section">
        <h3>4 PAYMENT MODE</h3>
        <PaymentOptions paymentMode={paymentMode} onChange={onChange} />
    </section>
);

export default PaymentSection;