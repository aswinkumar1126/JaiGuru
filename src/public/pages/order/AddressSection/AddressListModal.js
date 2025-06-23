import React from 'react';
import './address.css';
const AddressListModal = ({ addresses, selectedAddress, onSelect, onAddNew, onClose }) => {
    return (
        <div className="address-modal-overlay">
            <div className="address-modal">
                <div className="modal-header">
                    <h3>Select Delivery Address</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="address-list">
                    {addresses.map(address => (
                        <div
                            key={address.id}
                            className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                            onClick={() => onSelect(address)}
                        >
                            <div className="address-content">
                                <p><strong>{address.name}</strong> - {address.phone}</p>
                                <p>{address.addressLine}</p>
                                <p>{address.locality}, {address.landmark}</p>
                                <p>{address.city}, {address.state} - {address.pincode}</p>
                                {address.isDefault && <span className="default-badge">Default</span>}
                            </div>
                            <button
                                className="btn-edit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect(address);
                                    onClose();
                                }}
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>

                <div className="modal-actions">
                    <button className="btn-add-new" onClick={onAddNew}>
                        + Add New Address
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressListModal;