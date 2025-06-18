import React from 'react';
import ProfileTab from './tabs/ProfileTab';
import OrdersTab from './tabs/OrdersTab';
import SavedItemsTab from './tabs/SavedItemsTab';
import AddressesTab from './tabs/AddressesTab';

const ProfileContent = ({ activeTab, user }) => {
    switch (activeTab) {
        case 'orders': return <OrdersTab />;
        case 'saved': return <SavedItemsTab />;
        case 'address': return <AddressesTab />;
        default: return <ProfileTab user={user} />;
    }
};

export default ProfileContent;
