import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyPaymentResult = ({ status }) => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const orderId = "ORD-105555E1";

    useEffect(() => {
        if (!orderId) {
            alert("Missing order ID");
            return navigate("/orders");
        }
        const userToken=localStorage.getItem('user_token')
        // Call your backend verify API
        fetch(`${process.env.REACT_APP_BASE_URL}/payment/verify-payment?orderId=${orderId}`,{
            headers:{
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            }
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message || "Payment verification complete");
                navigate(`/payment-success`);
            })
            .catch((err) => {
                console.error("Verify error:", err);
                alert("Verification failed");
                navigate(`/payment-failure`);
            });
    }, [orderId, navigate]);

    return (
        <div>
            <h2>Verifying {status === 'success' ? 'Payment Success' : 'Payment Failure'}...</h2>
        </div>
    );
};

export default VerifyPaymentResult;
