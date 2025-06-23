import React,{useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrderForm } from './hooks/useOrderForm';
import AddressSection from './AddressSection';
import OrderSummary from './OrderSummary';
import PaymentSection from './PaymentSection';
import PriceDetails from './PriceDetails';
import AddressListModal from './AddressSection/AddressListModal';
import './OrderPage.css';

const OrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        user,
        address,
        addresses,
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
        handlePaymentChange,
        handleAddressSelect
    } = useOrderForm(navigate, location);

    const [showAddressList, setShowAddressList] = useState(false);

    if (isUserLoading) return <div className="loading">Loading...</div>;
    if (userError) return <div className="error">Error loading user data</div>;

    return (
        <div className="order-container">
            <main className="order-main">
                <section className="order-section">
                    <h3>1 LOGIN</h3>
                    <p><strong>+91 {user?.contactNumber || 'XXXXXXXXXX'}</strong></p>
                </section>

                <AddressSection
                    user={user}
                    address={address}
                    showForm={showAddressForm}
                    formMode={formMode}
                    onEdit={() => handleAddressEdit(address)}
                    onAdd={handleAddressAdd}
                    onSave={handleAddressSave}
                    onCancel={handleAddressCancel}
                />

                {!showAddressForm && addresses?.length > 1 && (
                    <button
                        className="btn-change-address"
                        onClick={() => setShowAddressList(true)}
                    >
                        Change Address
                    </button>
                )}

                <OrderSummary items={cartItems} />
                <PaymentSection paymentMode={paymentMode} onChange={handlePaymentChange} />
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

            {showAddressList && (
                <AddressListModal
                    addresses={addresses}
                    selectedAddress={address}
                    onSelect={(addr) => {
                        handleAddressSelect(addr);
                        setShowAddressList(false);
                    }}
                    onAddNew={() => {
                        setShowAddressList(false);
                        handleAddressAdd();
                    }}
                    onClose={() => setShowAddressList(false)}
                />
            )}
        </div>
    );
};

export default OrderPage;