import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrderForm } from './hooks/useOrderForm';
import AddressSection from './AddressSection';
import OrderSummary from './OrderSummary';
import PaymentSection from './PaymentSection';
import PriceDetails from './PriceDetails';
import './OrderPage.css';

const OrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
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
        handleAddressEdit,
        handleAddressAdd,
        handleAddressSave,
        handleAddressCancel,
        handlePaymentChange
    } = useOrderForm(navigate, location);

    if (isUserLoading) return <div className="loading">Loading profile...</div>;
    if (userError) return <div className="error">Error loading user profile!</div>;

    return (
        <div className="order-container">
            <main className="order-main">
                <section className="order-section">
                    <h3>1 LOGIN</h3>
                    <p><strong>+91 {localStorage.getItem('userMobileNumber') || 'XXXXXXXXXX'}</strong></p>
                </section>

                <AddressSection
                    address={address}
                    showForm={showAddressForm}
                    formMode={formMode}
                    onEdit={handleAddressEdit}
                    onAdd={handleAddressAdd}
                    onSave={handleAddressSave}
                    onCancel={handleAddressCancel}
                />

                <OrderSummary items={cartItems} />

                <PaymentSection
                    paymentMode={paymentMode}
                    onChange={handlePaymentChange}
                />
            </main>

            <aside className="order-sidebar">
                <PriceDetails
                    items={cartItems}
                    totalAmount={totalAmount}
                    onSubmit={handleOrderSubmit}
                    isLoading={isLoading}
                    paymentMode={paymentMode}
                />
            </aside>
        </div>
    );
};

export default OrderPage;