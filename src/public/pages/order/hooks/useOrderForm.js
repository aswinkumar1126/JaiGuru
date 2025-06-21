import { useEffect, useState } from 'react';
import { useCreateOrder } from '../../../hook/order/useOrderMutation';
import { useCurrentProfile } from '../../../hook/userProfile/useUserProfileQuery';
import { useCreateAddress, useUpdateAddress, useAddressesByCustomer } from '../../../hook/address/useAddress';

export const useOrderForm = (navigate, location) => {
    const { state } = location;
    const { mutate: createOrder, isLoading: isOrderLoading } = useCreateOrder();
    const { data: user, isLoading: isUserLoading, error: userError } = useCurrentProfile();

    // Address hooks
    const createAddress = useCreateAddress();
    const updateAddress = useUpdateAddress();
    const { data: customerAddresses } = useAddressesByCustomer(user?.id);

    const [selectedAddress, setSelectedAddress] = useState(() => {
        const saved = localStorage.getItem('selectedAddress');
        return saved ? JSON.parse(saved) : null;
    });

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [paymentMode, setPaymentMode] = useState(() => localStorage.getItem('paymentMode') || 'ONLINE');
    const [isAddressLoading, setIsAddressLoading] = useState(false);

    const { cartItems = [], totalAmount = 0 } = state || {};

    // Set default address if available
    useEffect(() => {
        if (customerAddresses?.length > 0 && !selectedAddress) {
            const defaultAddress = customerAddresses.find(addr => addr.isDefault) || customerAddresses[0];
            setSelectedAddress(defaultAddress);
            localStorage.setItem('selectedAddress', JSON.stringify(defaultAddress));
        }
    }, [customerAddresses, selectedAddress]);

    const handleAddressSave = async (formData) => {
        setIsAddressLoading(true);
        try {
            let savedAddress;

            if (formMode === 'edit' && selectedAddress?.id) {
                savedAddress = await updateAddress.mutateAsync({
                    id: selectedAddress.id,
                    address: formData
                });
            } else {
                savedAddress = await createAddress.mutateAsync({
                    ...formData,
                    customerId: user.id
                });
            }

            setSelectedAddress(savedAddress);
            localStorage.setItem('selectedAddress', JSON.stringify(savedAddress));
            setShowAddressForm(false);
        } catch (error) {
            console.error('Error saving address:', error);
        } finally {
            setIsAddressLoading(false);
        }
    };

    const handleOrderSubmit = async () => {
        if (!selectedAddress) {
            alert('Please select a delivery address');
            return;
        }

        const orderPayload = {
            customerName: selectedAddress.name,
            contact: selectedAddress.phone,
            email: user?.email,
            totalAmount,
            address: formatAddress(selectedAddress),
            paymentMode,
            items: cartItems.map(item => ({
                productId: item.id,
                productName: item.name,
                quantity: item.quantity,
                price: parseFloat(item.price),
            })),
            shippingAddressId: selectedAddress.id
        };

        createOrder(orderPayload, {
            onSuccess: (data) => {
                localStorage.removeItem('selectedAddress');
                if (paymentMode === 'ONLINE') {
                    navigate(`/payment/${data.orderId}`);
                } else {
                    navigate('/orders', { state: { orderSuccess: true } });
                }
            }
        });
    };

    const formatAddress = (addr) => {
        return [
            addr.addressLine,
            addr.locality,
            addr.landmark,
            `${addr.city}, ${addr.state} - ${addr.pincode}`
        ].filter(Boolean).join(', ');
    };

    return {
        user,
        address: selectedAddress,
        addresses: customerAddresses || [],
        paymentMode,
        showAddressForm,
        formMode,
        cartItems,
        totalAmount,
        isLoading: isOrderLoading || isAddressLoading,
        isUserLoading,
        userError,
        handleOrderSubmit,
        handleAddressEdit: (address) => {
            setSelectedAddress(address);
            setFormMode('edit');
            setShowAddressForm(true);
        },
        handleAddressAdd: () => {
            setFormMode('add');
            setShowAddressForm(true);
        },
        handleAddressSave,
        handleAddressCancel: () => setShowAddressForm(false),
        handlePaymentChange: (mode) => {
            setPaymentMode(mode);
            localStorage.setItem('paymentMode', mode);
        },
        handleAddressSelect: (address) => {
            setSelectedAddress(address);
            localStorage.setItem('selectedAddress', JSON.stringify(address));
        }
    };
};