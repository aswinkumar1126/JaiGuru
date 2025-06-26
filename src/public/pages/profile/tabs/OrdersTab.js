import React, { useState } from 'react';
import { useOrderHistory } from '../../../hook/order/useOrderHistoryQuery';
import { FaChevronDown, FaChevronUp, FaBoxOpen, FaShoppingBag, FaTruck, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import './OrdersTab.css';

const OrdersTab = () => {
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [status, setStatus] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    const { data, isLoading, isError, refetch } = useOrderHistory({ page, size, status });

    const handleStatusFilterChange = (e) => {
        setStatus(e.target.value);
        setPage(0); // Reset to first page when filter changes
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PLACED':
                return <FaShoppingBag className="status-icon" />;
            case 'SHIPPED':
                return <FaTruck className="status-icon" />;
            case 'DELIVERED':
                return <FaCheckCircle className="status-icon" />;
            case 'CANCELLED':
                return <FaTimesCircle className="status-icon" />;
            default:
                return <FaClock className="status-icon" />;
        }
    };

    const orders = Array.isArray(data) ? data : [];

    return (
        <section className="orders-container">
            <div className="orders-header">
                <h2 className="orders-title">Order History</h2>
                <div className="orders-filter">
                    <div className="filter-control">
                        <label htmlFor="status-filter" className="filter-label">Filter by Status:</label>
                        <select
                            id="status-filter"
                            className="filter-select"
                            value={status}
                            onChange={handleStatusFilterChange}
                        >
                            <option value="">All Orders</option>
                            <option value="PENDING">Pending</option>
                            <option value="PLACED">Placed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            ) : isError ? (
                <div className="error-state">
                    <div className="error-icon">!</div>
                    <h3>Failed to load orders</h3>
                    <p>We couldn't retrieve your order history at this time.</p>
                    <button
                        className="retry-button"
                        onClick={() => refetch()}
                    >
                        Try Again
                    </button>
                </div>
            ) : orders.length > 0 ? (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div
                            className={`order-card ${expandedOrder === order.orderId ? 'expanded' : ''}`}
                            key={order.orderId}
                        >
                            <div
                                className="order-summary"
                                onClick={() => toggleOrderDetails(order.orderId)}
                            >
                                <div className="order-meta">
                                    <div className="order-id">
                                        <span className="meta-label">Order #</span>
                                        <span className="meta-value">{order.orderId}</span>
                                    </div>
                                    <div className="order-date">
                                        <span className="meta-label">Date</span>
                                        <span className="meta-value">
                                            {new Date(order.orderTime).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="order-total">
                                        <span className="meta-label">Total</span>
                                        <span className="meta-value">
                                            ₹{Number(order.totalAmount).toLocaleString('en-IN', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className={`order-status ${order.status?.toLowerCase()}`}>
                                    {getStatusIcon(order.status)}
                                    <span>{order.status}</span>
                                </div>
                                <div className="order-toggle">
                                    {expandedOrder === order.orderId ? (
                                        <FaChevronUp />
                                    ) : (
                                        <FaChevronDown />
                                    )}
                                </div>
                            </div>

                            {expandedOrder === order.orderId && (
                                <div className="order-details">
                                    <div className="customer-info">
                                        <h4>Customer Information</h4>
                                        <div className="info-grid">
                                            <div>
                                                <span className="info-label">Name</span>
                                                <span className="info-value">{order.customerName}</span>
                                            </div>
                                            <div>
                                                <span className="info-label">Contact</span>
                                                <span className="info-value">{order.contact}</span>
                                            </div>
                                            <div>
                                                <span className="info-label">Email</span>
                                                <span className="info-value">{order.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="products-section">
                                        <h4>Products ({order.orderItems?.length || 0})</h4>
                                        <div className="products-list">
                                            {order.orderItems?.map((item, index) => (
                                                <div className="product-item" key={index}>
                                                    <div className="product-image">
                                                        {item.image_path ? (
                                                            <img
                                                                src={item.image_path}
                                                                alt={item.productName}
                                                                onError={(e) => {
                                                                    e.target.src = '/images/product-placeholder.jpg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="image-placeholder">
                                                                <FaBoxOpen />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="product-details">
                                                        <h5 className="product-name">{item.productName}</h5>
                                                        <div className="product-meta">
                                                            <div>
                                                                <span className="meta-label">Tag No.</span>
                                                                <span className="meta-value">{item.tagno || 'N/A'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="meta-label">Sno.</span>
                                                                <span className="meta-value">{item.sno || 'N/A'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="meta-label">Price</span>
                                                                <span className="meta-value">
                                                                    ₹{Number(item.price).toLocaleString('en-IN', {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">
                        <FaBoxOpen />
                    </div>
                    <h3>No Orders Found</h3>
                    <p>{status ? `You don't have any ${status.toLowerCase()} orders.` : "You haven't placed any orders yet."}</p>
                    <button className="browse-button">
                        Browse Products
                    </button>
                </div>
            )}
        </section>
    );
};

export default OrdersTab;