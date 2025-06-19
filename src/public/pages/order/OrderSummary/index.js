import React from 'react';
import OrderItem from './OrderItem';

const OrderSummary = ({ items }) => (
    <section className="order-section">
        <h3>3 ORDER SUMMARY</h3>
        <div className="order-items">
            {items.map((item, idx) => (
                <OrderItem key={idx} item={item} />
            ))}
        </div>
    </section>
);

export default OrderSummary;