import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreatePaymentLinkMutation } from '../../hook/payment/useCreatePaymentLinkMutation';
import { useOrderHistory } from '../../hook/order/useOrderHistoryQuery';

const PaymentPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { mutate: createPaymentLink } = useCreatePaymentLinkMutation();
    const { data: orders, isLoading, isError } = useOrderHistory({ page: 0, size: 10 });

    useEffect(() => {
        const token = localStorage.getItem('user_token');
        if (!orderId || !token || isLoading || isError) return;

        const currentOrder = orders?.find((order) => order.orderId === orderId);

        if (!currentOrder) {
            alert('Order not found');
            navigate('/orders');
            return;
        }

        const payload = {
            orderId,
            username: currentOrder.customerName,
            contact: currentOrder.contact,
            email: currentOrder.email,
            amount: currentOrder.totalAmount,
        };

        console.log("Creating payment link with payload:", payload);

        createPaymentLink(payload, {
            onSuccess: (res) => {
                if (res.payment_link) {
                    window.location.href = res.payment_link;
                } else {
                    alert(res.error || "Failed to create Razorpay link");
                    navigate("/orders");
                }
            },
            onError: (err) => {
                console.error("❌ Payment Link Error:", err?.response?.data || err.message);
                alert("Payment link creation failed: " + (err?.response?.data?.message || err.message));
                navigate("/orders");
            },
        });
    }, [orderId, orders, isLoading, isError, createPaymentLink, navigate]);
      

    return (
        <div className="payment-loading-page">
            <h2>Generating Payment Link...</h2>
            <p>Please wait, redirecting to Razorpay.</p>
        </div>
    );
};

export default PaymentPage;
