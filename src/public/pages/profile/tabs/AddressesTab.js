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
                    <div className="form-header">
                        <h3>{currentAddress ? 'Edit Address' : 'Add New Address'}</h3>
                        <button type="button" onClick={resetForm} className="close-btn">
                            <FiX />
                        </button>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter Your Name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            pattern="[0-9]{10}"
                            required
                            placeholder="Enter Your Mobile Number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="addressLine">Address Line *</label>
                        <textarea
                            id="addressLine"
                            name="addressLine"
                            value={formData.addressLine}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter Your Address"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="locality">Locality *</label>
                        <input
                            id="locality"
                            name="locality"
                            value={formData.locality}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter Your Locality"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="landmark">Landmark *</label>
                        <input
                            id="landmark"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleInputChange}
                            required
                            placeholder="Landmark"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter Your City"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="state">State *</label>
                        <input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter Your State"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pincode">Pincode *</label>
                        <input
                            id="pincode"
                            name="pincode"
                            type="text"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            pattern="[0-9]{6}"
                            required
                            placeholder="Enter Your Pincode"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="alternatePhone">Alternate Phone</label>
                        <input
                            id="alternatePhone"
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

                    <div className="form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Enter Your Company Name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="gstNumber">GST Number</label>
                        <input
                            id="gstNumber"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleInputChange}
                            placeholder="Enter Your GST Number"
                            pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={resetForm}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            {currentAddress ? 'Update' : 'Save'}
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