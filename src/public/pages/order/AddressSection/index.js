import React from 'react';
import AddressForm from './AddressForm';
import AddressView from './AddressView';

const AddressSection = ({ address, showForm, formMode, onEdit, onAdd, onSave, onCancel }) => {
    return (
        <section className="order-section">
            <h3>2 DELIVERY ADDRESS</h3>
            {address && !showForm ? (
                <AddressView address={address} onEdit={onEdit} onAdd={onAdd} />
            ) : (
                <AddressForm
                    onSave={onSave}
                    onCancel={onCancel}
                    initialData={formMode === 'edit' ? address : {}}
                />
            )}
        </section>
    );
};

export default AddressSection;