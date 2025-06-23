import React from 'react';
import'./address.css';

const AddressView = ({ address, onEdit, onAdd }) => {
    if (!address) return (
        <div className="address-view">
            <p>No address selected</p>
            <button onClick={onAdd}>+ Add New Address</button>
        </div>
    );

    return (
        <div className="address-view">
            <div className="address-details">
                <p><strong>{address.name}</strong> - {address.phone}</p>
                <p>{address.addressLine}</p>
                <p>{address.locality}, {address.landmark}</p>
                <p>{address.city}, {address.state} - {address.pincode}</p>
                {address.alternatePhone && <p>Alternate: {address.alternatePhone}</p>}
                {address.isDefault && <span className="default-badge">Default</span>}
            </div>
            <div className="address-actions">
                <button onClick={onEdit}>Edit</button>
                <button onClick={onAdd}>+ Add New</button>
            </div>
        </div>
    );
};

export default AddressView;