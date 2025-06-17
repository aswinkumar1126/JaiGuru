import React, { useState } from 'react';
import './AddressForm.css';

const AddressForm = ({ onSave,onCancel, initialData = {} }) => {
    
    const [form, setForm] = useState({
        name: '',
        mobile: '',
        pincode: '',
        locality: '',
        street: '',
        city: '',
        state: '',
        landmark: '',
        altPhone: '',
        addressType: 'HOME',
        ...initialData,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('checkoutAddress', JSON.stringify(form));
        onSave(form);
    };
 

    return (<>
        <form className="address-form-layout" onSubmit={handleSubmit}>
            <h2>Add a New Address</h2>
            <button type="button" className="location-btn">📍 Use my current location</button>

            <div className="two-column">
                <input
                    name="name"
                    placeholder="Name"
                    required
                    value={form.name}
                    onChange={handleChange}
                />
                <input
                    name="mobile"
                    placeholder="10-digit mobile number"
                    required
                    value={form.mobile}
                    onChange={handleChange}
                />

            </div>

            <div className="two-column">
                <input name="pincode" placeholder="Pincode" required value={form.pincode} onChange={handleChange} />
                <input name="locality" placeholder="Locality" required value= {form.locality} onChange={handleChange} />
            </div>

            <textarea name="street" placeholder="Address (Area and Street)" required value={form.street} onChange={handleChange} />

            <div className="two-column">
                <input name="city" placeholder="City/District/Town" required value={form.city} onChange={handleChange} />
                <select name="state" required value={form.state} onChange={handleChange}>
                    <option value="">--Select State--</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    {/* Add more states as needed */}
                </select>
            </div>

            <div className="two-column">
                <input name="landmark" placeholder="Landmark (Optional)" value={form.landmark} onChange={handleChange} />
                <input name="altPhone" placeholder="Alternate Phone (Optional)" value={form.altPhone} onChange={handleChange} />
            </div>

            <div className="address-type">
                <label>
                    <input
                        type="radio"
                        name="addressType"
                        value="HOME"
                        checked={form.addressType === 'HOME'}
                        onChange={handleChange}
                    /> Home (All day delivery)
                </label>
                <label>
                    <input
                        type="radio"
                        name="addressType"
                        value="WORK"
                        checked={form.addressType === 'WORK'}
                        onChange={handleChange}
                    /> Work (Delivery between 10 AM - 5 PM)
                </label>
            </div>

            <div className="address-buttons">
                <button type="submit" className="save-btn">SAVE AND DELIVER HERE</button>
                <button type="button" className="cancel-btn" onClick={onCancel}>CANCEL</button>
            </div>
        </form>
    </>
    );
};

export default AddressForm;
