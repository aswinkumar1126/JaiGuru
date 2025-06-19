import { useEffect, useState } from 'react';
import { useCreateOrder } from '../../../hook/order/useOrderMutation';
import { useCurrentProfile } from '../../../hook/userProfile/useUserProfileQuery';

export const useOrderForm = (navigate, location) => {
    const { state } = location;
    const { mutate, isLoading } = useCreateOrder();
    const { data: user, isLoading: isUserLoading, error: userError } = useCurrentProfile();

    const [address, setAddress] = useState(() => {
        const saved = localStorage.getItem('checkoutAddress');
        return saved ? JSON.parse(saved) : null;
    });

    const [paymentMode, setPaymentMode] = useState(() => localStorage.getItem('paymentMode') || '');
    const [showAddressForm, setShowAddressForm] = useState(!localStorage.getItem('checkoutAddress'));
    const [formMode, setFormMode] = useState('');

    const { cartItems = [], totalAmount = 0 } = state || {};

    useEffect(() => {
        if (!state) {
            navigate('/cart');
        }
        if (address) {
            setShowAddressForm(false);
        }
    }, [state, navigate, address]);

    const handleOrderSubmit = async () => {
        if (!address) {
            alert('Please add a delivery address');
            return;
        }

        const fullAddress = `${address.street}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}`;

        const orderPayload = {
            customerName: user?.username || 'Test User',
            contact: user?.contactNumber || '9999999999',
            email: user?.email || 'test@example.com',
            totalAmount,
            address: fullAddress,
            paymentMode,
            items: cartItems.map(item => ({
                productName: item.name,
                quantity: item.quantity,
                price: parseFloat(item.price),
            })),
        };

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

    return {
        user,
        address,
        paymentMode,
        showAddressForm,
        formMode,
        cartItems,
        totalAmount,
        isLoading,
        isUserLoading,
        userError,
        handleOrderSubmit,
        handleAddressEdit: () => {
            setShowAddressForm(true);
            setFormMode('edit');
        },
        handleAddressAdd: () => {
            setShowAddressForm(true);
            setFormMode('add');
        },
        handleAddressSave: (formData) => {
            setAddress(formData);
            setShowAddressForm(false);
            localStorage.setItem('checkoutAddress', JSON.stringify(formData));
        },
        handleAddressCancel: () => setShowAddressForm(false),
        handlePaymentChange: (e) => {
            setPaymentMode(e.target.value);
            localStorage.setItem('paymentMode', e.target.value);
        }
    };
};