import React from 'react';

const AddressView = ({ address, onEdit, onAdd }) => (
    <div className="address-view">
        <div className="address-details">
            <p><strong>{address.name}</strong> ({address.addressType}) - {address.mobile}</p>
            <p>{address.street}, {address.locality}, {address.city}, {address.state} - {address.pincode}</p>
        </div>
        <div className="address-actions">
            <button onClick={onEdit}>Edit Address</button>
            <button onClick={onAdd}>+ Add New Address</button>
        </div>
    </div>
);

export default AddressView;