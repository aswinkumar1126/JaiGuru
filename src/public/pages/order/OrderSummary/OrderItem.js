import React from 'react';

const OrderItem = ({ item }) => (
    <div className="order-item">
        <img src={item.image} alt={item.name} loading="lazy" />
        <div className="item-details">
            <p><strong>{item.name}</strong></p>
            <p>Price: ₹{item.price}</p>
        </div>
    </div>
);

export default OrderItem;