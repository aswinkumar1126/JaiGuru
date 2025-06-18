import React from 'react';

const SavedItemsTab = () => (
    <section className="profile-section">
        <div className="section-header">
            <h2>Saved Items</h2>
        </div>

        <div className="empty-state">
            <img src="/images/wishlist-empty.svg" alt="No saved items" />
            <h3>Your Wishlist is Empty</h3>
            <p>Save items you like to see them here.</p>
            <button className="primary-button">Start Shopping</button>
        </div>
    </section>
);

export default SavedItemsTab;
