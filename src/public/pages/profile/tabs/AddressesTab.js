import React, { useState } from 'react';
import { FiMapPin, FiEdit2, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import {
    useAddressesByCustomer,
    useCreateAddress,
    useUpdateAddress,
    useDeleteAddress
} from '../../../hook/address/useAddress';
import './AddressesTab.css';

const AddressesTab = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const customerId = user?.id;
    const [isEditing, setIsEditing] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        addressLine: '',
        locality: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        alternatePhone: '',
        isDefault: false,
        gstNumber: '',
        companyName: ''
    });

    // Address operations
    const { data: addresses = [], isLoading, refetch } = useAddressesByCustomer(customerId);
    const createMutation = useCreateAddress();
    const updateMutation = useUpdateAddress();
    const deleteMutation = useDeleteAddress();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                customerId,
                isDefault: Boolean(formData.isDefault)
            };

            if (currentAddress) {
                await updateMutation.mutateAsync({
                    id: currentAddress.id,
                    address: payload
                });
            } else {
                await createMutation.mutateAsync(payload);
            }
            resetForm();
            refetch();
        } catch (error) {
            console.error('Error saving address:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await deleteMutation.mutateAsync(id);
                refetch();
            } catch (error) {
                console.error('Error deleting address:', error);
            }
        }
    };

    const handleSetDefault = (id) => {
        // This is now a frontend-only operation
        const updatedAddresses = addresses.map(address => ({
            ...address,
            isDefault: address.id === id
        }));
        // Note: This change won't persist without backend support
        // You would need to call an API to actually save this change
        refetch(); // This will reset to server state
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentAddress(null);
        setFormData({
            name: '',
            phone: '',
            addressLine: '',
            locality: '',
            landmark: '',
            city: '',
            state: '',
            pincode: '',
            alternatePhone: '',
            isDefault: false,
            gstNumber: '',
            companyName: ''
        });
    };

    const startEditing = (address) => {
        setCurrentAddress(address);
        setFormData({
            name: address.name,
            phone: address.phone,
            addressLine: address.addressLine,
            locality: address.locality,
            landmark: address.landmark,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            alternatePhone: address.alternatePhone || '',
            isDefault: address.isDefault || false,
            gstNumber: address.gstNumber || '',
            companyName: address.companyName || ''
        });
        setIsEditing(true);
    };

    return (
        <section className="profile-section">
            <div className="section-header">
                <h2>Saved Addresses</h2>
                {!isEditing && (
                    <button
                        className="outlined-button"
                        onClick={() => setIsEditing(true)}
                    >
                        <FiPlus /> Add New Address
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="empty-state">
                    <div className="loading-spinner"></div>
                    <p>Loading addresses...</p>
                </div>
            ) : isEditing ? (
                <form className="address-form" onSubmit={handleSubmit}>
                    {currentAddress && (
                        <div className="form-header">
                            <h3>{currentAddress ? 'Edit Address' : 'Add New Address'}</h3>
                            <button type="button" onClick={resetForm} className="close-btn">
                                <FiX />
                            </button>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter Your Name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                pattern="[0-9]{10}"
                                required
                                placeholder="Enter Your Mobile Number"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Address Line *</label>
                        <textarea
                            name="addressLine"
                            value={formData.addressLine}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter Your Address"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Locality *</label>
                            <input
                                name="locality"
                                value={formData.locality}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter Your Locality"
                            />
                        </div>

                        <div className="form-group">
                            <label>Landmark *</label>
                            <input
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleInputChange}
                                required
                                placeholder="Landmark"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>City *</label>
                            <input
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter Your City"
                            />
                        </div>

                        <div className="form-group">
                            <label>State *</label>
                            <input
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter Your State"
                            />
                        </div>

                        <div className="form-group">
                            <label>Pincode *</label>
                            <input
                                name="pincode"
                                type="text"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                pattern="[0-9]{6}"
                                required
                                placeholder="Enter Your Pincode"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Alternate Phone</label>
                            <input
                                name="alternatePhone"
                                type="tel"
                                value={formData.alternatePhone}
                                onChange={handleInputChange}
                                pattern="[0-9]{10}"
                                placeholder="Optional alternate number"
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <input
                                type="checkbox"
                                name="isDefault"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="isDefault">Set as default address</label>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Company Name</label>
                            <input
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                placeholder="Enter Your CompanyName"
                            />
                        </div>

                        <div className="form-group">
                            <label>GST Number</label>
                            <input
                                name="gstNumber"
                                value={formData.gstNumber}
                                onChange={handleInputChange}
                                placeholder="Enter Your GST Number"
                                pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={resetForm} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            {currentAddress ? 'Update Address' : 'Save Address'}
                        </button>
                    </div>
                </form>
            ) : addresses.length > 0 ? (
                <div className="address-list">
                    {addresses.map(address => (
                        <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                            <div className="address-content">
                                <div className="address-header">
                                    <h3>{address.name}</h3>
                                    {address.isDefault && (
                                        <span className="default-badge">
                                            <FiCheck /> Default
                                        </span>
                                    )}
                                </div>
                                <p className="address-phone">{address.phone}</p>
                                <p className="address-line">{address.addressLine}</p>
                                <p className="address-locality">{address.locality}, {address.landmark}</p>
                                <p className="address-city">{address.city}, {address.state} - {address.pincode}</p>

                                {address.alternatePhone && (
                                    <p className="address-alt-phone">Alternate: {address.alternatePhone}</p>
                                )}

                                {address.companyName && (
                                    <p className="address-company">Company: {address.companyName}</p>
                                )}

                                {address.gstNumber && (
                                    <p className="address-gst">GST: {address.gstNumber}</p>
                                )}
                            </div>
                            <div className="address-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => startEditing(address)}
                                >
                                    <FiEdit2 /> Edit
                                </button>
                                {!address.isDefault && (
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(address.id)}
                                    >
                                        <FiTrash2 /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <img src="/images/no-address.svg" alt="No addresses" />
                    <h3>No Saved Addresses</h3>
                    <p>Add addresses for faster checkout.</p>
                    <button
                        className="outlined-button"
                        onClick={() => setIsEditing(true)}
                    >
                        <FiPlus /> Add First Address
                    </button>
                </div>
            )}
        </section>
    );
};

export default AddressesTab;