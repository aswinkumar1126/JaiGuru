import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateOrder } from '../../hook/order/useOrderMutation';
import './OrderPage.css';
import AddressForm from './address/AddressForm';
import { useCurrentProfile } from '../../hook/userProfile/useUserProfileQuery';

const OrderPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { mutate, isLoading, isSuccess, error } = useCreateOrder();
    const { data: user, isLoading: isUserLoading, error: userError }=useCurrentProfile();

    const [address, setAddress] = useState(() => {
        const saved = localStorage.getItem('checkoutAddress');
        return saved ? JSON.parse(saved) : null;
    });

    const [paymentMode, setPaymentMode] = useState(() => localStorage.getItem('paymentMode') || '');
    const [showAddressForm, setShowAddressForm] = useState(!localStorage.getItem('checkoutAddress'));

    const { cartItems = [], totalAmount = 0 } = state || {};
    console.log("orderCart",cartItems)
    const [formMode, setFormMode] = useState('');
   
    useEffect(() => {
        if (!state) navigate('/cart');
    }, [state, navigate]);
    useEffect(() => {
        if (address) setShowAddressForm(false);
    }, [address]);
    if (isUserLoading) return <p>Loading profile...</p>;
    if (userError) return <p>Error loading user profile!</p>;


    const handleOrderSubmit = async () => {
        const fullAddress = `${address.street}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}`;

        const orderPayload = {
            customerName: user?.username || 'Test User',
            contact: user?.contactNumber || '9999999999',
            email: user?.email || 'test@example.com',
            totalAmount,
            address: fullAddress,
            paymentMode,
            paymentStatus: paymentMode === 'CASH' ? 'PENDING' : 'PAID',
            items: cartItems.map((item) => ({
                productName: item.name,
                quantity: item.quantity,
                price: parseFloat(item.price),
            })),
        };

        console.log(orderPayload, 'orderPayload');

        mutate(orderPayload, {
            onSuccess: (data) => {
                if (paymentMode === 'ONLINE') {
                    navigate(`/payment/${data.orderId}`);
                } else {
                    alert('✅ Order placed successfully with Cash on Delivery!');
                    navigate('/orders');
                }
            },
        });
    };
    
    
    return (
        <div className="order-page">
            <div className="order-left">
                {/* 1. Login */}
                <div className="order-section">
                    <h3>1 LOGIN</h3>
                    <p><strong>+91 {localStorage.getItem('userMobileNumber') || 'XXXXXXXXXX'}</strong></p>
                </div>

                {/* 2. Delivery Address */}
                <div className="order-section">
                    <h3>2 DELIVERY ADDRESS</h3>

                    {/* If not editing or adding, show existing address */}
                    {address && !showAddressForm && (
                        <>
                            <div className="address-item selected">
                                <p><strong>{address.name}</strong> ({address.addressType}) - {address.mobile}</p>
                                <p>{address.street}, {address.locality}, {address.city}, {address.state} - {address.pincode}</p>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button onClick={() => {
                                        setShowAddressForm(true);
                                        setFormMode('edit');
                                    }}>Edit Address</button>

                                    <button onClick={() => {
                                        setShowAddressForm(true);
                                        setFormMode('add');
                                    }}>+ Add New Address</button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Show form in add/edit mode */}
                    {(!address || showAddressForm) && (
                        <AddressForm
                            onSave={(formData) => {
                                setAddress(formData);
                                setShowAddressForm(false);
                                localStorage.setItem('checkoutAddress', JSON.stringify(formData));
                            }}
                            onCancel={() => setShowAddressForm(false)}
                            initialData={formMode === 'edit' ? address : {}} // 🔥 Key logic here
                        />
                    )}
                </div>

                {/* 3. Order Summary */}
                <div className="order-section">
                    <h3>3 ORDER SUMMARY</h3>
                    {cartItems.map((item, idx) => (
                        <div key={idx} className="order-item">
                            <img src={item.image} alt={item.name} />
                            <div>
                                <p><strong>{item.name}</strong></p>
                                <p>Qty: {item.quantity}</p>
                                <p>Price: ₹{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payment Mode Selection */}
                <div className="order-section">
                    <h3>4 PAYMENT MODE</h3>
                    <select
                        value={paymentMode}
                        onChange={(e) => {
                            setPaymentMode(e.target.value);
                            localStorage.setItem('paymentMode', e.target.value);
                        }}
                    >
                        <option value="">Select Payment Mode</option>
                        <option value="CASH">Cash on Delivery</option>
                        <option value="ONLINE">Online Payment</option>
                    </select>
                </div>
            </div>

            {/* Right Section */}
            <div className="order-right">
                <div className="price-box">
                    <h3>PRICE DETAILS</h3>
                    <p>Price ({cartItems.length} item{cartItems.length > 1 ? 's' : ''}): ₹{totalAmount}</p>
                    <p>Platform Fee: ₹4</p>
                    <p>Protect Promise Fee: ₹19</p>
                    <hr />
                    <p><strong>Total Payable: ₹{totalAmount + 4 + 19}</strong></p>
                    <p className="savings">Your Total Savings on this order ₹47</p>

                    <button
                        onClick={handleOrderSubmit}
                        disabled={isLoading || isUserLoading || !paymentMode}
                    >
                        {isLoading ? 'Placing Order...' : 'Place Order'}
                    </button>
                    {isSuccess && <p>✅ Order Placed Successfully!</p>}
                    {error && <p>❌ Error: {error.message}</p>}
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
