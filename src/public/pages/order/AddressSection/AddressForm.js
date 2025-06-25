import React, { useState } from 'react';
import './AddressForm.css';

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
            <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                    id="phone"
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

            <div className="form-group">
                <label htmlFor="addressLine">Address Line *</label>
                <textarea
                    id="addressLine"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    placeholder="House no, building, street"
                    rows="3"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="locality">Locality *</label>
                <input
                    id="locality"
                    name="locality"
                    value={formData.locality}
                    onChange={handleChange}
                    placeholder="Area/Locality"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="landmark">Landmark *</label>
                <input
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Nearby landmark"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                    id="pincode"
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

            <div className="form-group">
                <label htmlFor="alternatePhone">Alternate Phone</label>
                <input
                    id="alternatePhone"
                    name="alternatePhone"
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    placeholder="Optional alternate number"
                    pattern="[0-9]{10}"
                    title="Please enter exactly 10 digits"
                />
            </div>

            <div className="form-group">
                <label htmlFor="isDefault" className="checkbox-label">
                    <input
                        type="checkbox"
                        name="isDefault"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                    />
                    Set as default address
                </label>
            </div>

            <div className="form-group">
                <label htmlFor="showBusinessFields" className="checkbox-label">
                    <input
                        type="checkbox"
                        id="showBusinessFields"
                        checked={showBusinessFields}
                        onChange={() => setShowBusinessFields(!showBusinessFields)}
                    />
                    Add business details (optional)
                </label>
            </div>

            {showBusinessFields && (
                <>
                    <div className="form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Your company name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="gstNumber">GST Number</label>
                        <input
                            id="gstNumber"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            placeholder="Enter GST Number"
                            pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                            title="Enter valid GST number (e.g., 22AAAAA0000A1Z5)"
                        />
                    </div>
                </>
            )}

            <div className="form-actions-container">
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