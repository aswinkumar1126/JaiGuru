import React, { useState, useEffect } from 'react';
import './address.css';
const AddressForm = ({
    customerId,
    addressId,
    initialData,
    onSave,
    onCancel
}) => {
    const [formData, setFormData] = useState({
        customerId,
        name: '',
        phone: '',
        pincode: '',
        locality: '',
        addressLine: '',
        city: '',
        state: '',
        landmark: '',
        alternatePhone: '',
        isDefault: false,
        gstNumber: '',
        companyName: '',
        ...initialData
    });

    const [showBusinessFields, setShowBusinessFields] = useState(
        initialData?.gstNumber || initialData?.companyName ? true : false
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form className="address-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <label>Full Name *</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter 10-digit number"
                        pattern="[0-9]{10}"
                        title="Please enter exactly 10 digits"
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Address Line *</label>
                <textarea
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    placeholder="House no, building, street"
                    rows="3"
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Locality *</label>
                    <input
                        name="locality"
                        value={formData.locality}
                        onChange={handleChange}
                        placeholder="Area/Locality"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Landmark *</label>
                    <input
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        placeholder="Nearby landmark"
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>City *</label>
                    <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>State *</label>
                    <input
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Pincode *</label>
                    <input
                        name="pincode"
                        type="text"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="6-digit pincode"
                        pattern="[0-9]{6}"
                        title="Please enter exactly 6 digits"
                        required
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
                        onChange={handleChange}
                        placeholder="Optional alternate number"
                        pattern="[0-9]{10}"
                        title="Please enter exactly 10 digits"
                    />
                </div>

                <div className="form-group checkbox-group">
                    <input
                        type="checkbox"
                        name="isDefault"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                    />
                    <label htmlFor="isDefault">Set as default address</label>
                </div>
            </div>

            <div className="form-group checkbox-group">
                <input
                    type="checkbox"
                    id="showBusinessFields"
                    checked={showBusinessFields}
                    onChange={() => setShowBusinessFields(!showBusinessFields)}
                />
                <label htmlFor="showBusinessFields">Add business details (optional)</label>
            </div>

            {showBusinessFields && (
                <div className="form-row">
                    <div className="form-group">
                        <label>Company Name</label>
                        <input
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Your company name"
                        />
                    </div>

                    <div className="form-group">
                        <label>GST Number</label>
                        <input
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            placeholder="22AAAAA0000A1Z5"
                            pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                            title="Enter valid GST number (e.g. 22AAAAA0000A1Z5)"
                        />
                    </div>
                </div>
            )}

            <div className="form-actions">
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit">
                    {addressId ? 'Update Address' : 'Save Address'}
                </button>
            </div>
        </form>
    );
};

export default AddressForm;