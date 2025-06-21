import React from 'react';
import AddressForm from './AddressForm';
import AddressView from './AddressView';
import './address.css';
const AddressSection = ({
    user,
    address,
    showForm,
    formMode,
    onEdit,
    onAdd,
    onSave,
    onCancel
}) => {
    return (
        <section className="order-section">
            <h3>2 DELIVERY ADDRESS</h3>
            {!showForm ? (
                <AddressView
                    address={address}
                    onEdit={onEdit}
                    onAdd={onAdd}
                />
            ) : (
                <AddressForm
                    customerId={user?.id}
                    addressId={formMode === 'edit' ? address?.id : null}
                    initialData={formMode === 'edit' ? address : {
                        name: user?.username || '',
                        phone: user?.contactNumber || '',
                        email: user?.email || '',
                        isDefault: false
                    }}
                    onSave={onSave}
                    onCancel={onCancel}
                />
            )}
        </section>
    );
};

export default AddressSection;