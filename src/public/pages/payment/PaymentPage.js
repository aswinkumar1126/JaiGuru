import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreatePaymentLinkMutation } from '../../hook/payment/useCreatePaymentLinkMutation';
import { useOrderHistory } from '../../hook/order/useOrderHistoryQuery';

const PaymentPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { mutate: createPaymentLink } = useCreatePaymentLinkMutation();
    const { data: orders, isLoading, isError, refetch } = useOrderHistory({ page: 0, size: 10 });
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    useEffect(() => {
        const token = localStorage.getItem('user_token');
        if (!token) {
            alert('Please log in to proceed with payment');
            navigate('/login');
            return;
        }

        if (!orderId || isLoading || isError) return;

        const currentOrder = orders?.find((order) => order.orderId === orderId);

        if (!currentOrder && retryCount < maxRetries) {
            const timeout = setTimeout(() => {
                refetch();
                setRetryCount((prev) => prev + 1);
            }, 1000);
            return () => clearTimeout(timeout);
        }

        if (!currentOrder && retryCount >= maxRetries) {
            alert('Order not found after retries');
            localStorage.removeItem('pendingOrderId');
            navigate('/orders');
            return;
        }

        if (currentOrder) {
            const payload = {
                orderId,
                username: currentOrder.customerName,
                contact: currentOrder.contact,
                email: currentOrder.email,
                amount: currentOrder.totalAmount,
                callback_url: `${window.location.origin}/payment/callback/${orderId}`,
                cancel_url: `${window.location.origin}/payment/callback/${orderId}`
            };

            console.log('Creating payment link with payload:', payload);

            createPaymentLink(payload, {
                onSuccess: (res) => {
                    if (res.payment_link) {
                        window.location.href = res.payment_link;
                    } else {
                        alert(res.error || 'Failed to create Razorpay link');
                        localStorage.removeItem('pendingOrderId');
                        navigate('/order');
                    }
                },
                onError: (err) => {
                    console.error('❌ Payment Link Error:', err?.response?.data || err.message);
                    alert('Payment link creation failed: ' + (err?.response?.data?.message || err.message));
                    localStorage.removeItem('pendingOrderId');
                    navigate('/order');
                }
            });
        }
    }, [orderId, orders, isLoading, isError, refetch, retryCount, createPaymentLink, navigate, maxRetries]);

    return (
        <div className="payment-loading-page">
            <h2>Generating Payment Link...</h2>
            <p>Please wait, redirecting to Razorpay.</p>
        </div>
    );
};

export default PaymentPage;