import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import './AddressesTab.css';
const AddressesTab = () => (
    <section className="profile-section">
        <div className="section-header">
            <h2>Saved Addresses</h2>
            <button className="outlined-button">
                <FiMapPin /> Add New Address
            </button>
        </div>

        <div className="empty-state">
            <img src="/images/no-address.svg" alt="No addresses" />
            <h3>No Saved Addresses</h3>
            <p>Add addresses for faster checkout.</p>
        </div>
    </section>
);

export default AddressesTab;
