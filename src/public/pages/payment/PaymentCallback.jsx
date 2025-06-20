import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import './PaymentCallback.css';

const PaymentCallback = () => {
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Verifying payment...');

    useEffect(() => {
        const token = localStorage.getItem('user_token');
        if (!token) {
            setStatus('Please log in to continue');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        if (!orderId) {
            setStatus('Invalid order ID');
            setTimeout(() => navigate('/order'), 2000);
            return;
        }

        // Extract Razorpay response from query params
        const paymentId = searchParams.get('razorpay_payment_id');
        const initialStatus = paymentId ? 'success' : 'failed';

        // Verify payment with backend
        fetch(`${process.env.REACT_APP_BASE_URL}/payment/verify-payment?orderId=${orderId}`, {
            method: 'GET', // Use POST for security
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId, paymentId }) // Send paymentId for additional verification
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'captured') {
                    setStatus('Payment successful! Redirecting...');
                    setTimeout(() => navigate('/payment-success'), 2000);
                } else {
                    setStatus(data.message || 'Payment failed or not completed. Redirecting...');
                    setTimeout(() => navigate('/payment-failure'), 2000);
                }
            })
            .catch((err) => {
                console.error('❌ Verify error:', err);
                setStatus('Verification failed: ' + (err.message || 'Unknown error'));
                setTimeout(() => navigate('/payment-failure'), 2000);
            });
    }, [orderId, searchParams, navigate]);

    return (
        <div className="payment-callback-page">
            <h2>Payment Status</h2>
            <p>{status}</p>
        </div>
    );
};

export default PaymentCallback;