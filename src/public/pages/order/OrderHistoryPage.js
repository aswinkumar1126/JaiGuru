import React from 'react';
import { useOrderHistory } from '../../hook/order/useOrderHistoryQuery';

const OrderHistoryPage = () => {
    const { data, isLoading, isError, error } = useOrderHistory({ page: 0, size: 10 });

    if (isLoading) return <p>Loading orders...</p>;
    if (isError) return <p>Error: {error.message}</p>;

    if (typeof data === 'string') return <p>{data}</p>; // "No order history found."

    return (
        <div>
            <h2>My Orders</h2>
            <ul>
                {data.map((order) => (
                    <li key={order.id}>
                        <p>🧾 Order #{order.id}</p>
                        <p>📦 Items: {order.items.length}</p>
                        <p>💰 Amount: ₹{order.totalAmount}</p>
                        <p>📍 Status: {order.paymentStatus}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderHistoryPage;
