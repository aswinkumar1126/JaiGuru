import React, { useState } from 'react';

const AddressForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        mobile: '',
        addressType: 'Home',
        street: '',
        locality: '',
        city: '',
        state: '',
        pincode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form className="address-form" onSubmit={handleSubmit}>
            <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
            />
            <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile Number"
                required
            />
            <select
                name="addressType"
                value={formData.addressType}
                onChange={handleChange}
            >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
            </select>
            <input
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street Address"
                required
            />
            <input
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="Locality"
                required
            />
            <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
            />
            <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
            />
            <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                required
            />
            <div className="form-actions">
                <button type="button" onClick={onCancel}>Cancel</button>
                <button type="submit">Save Address</button>
            </div>
        </form>
    );
};

export default AddressForm;