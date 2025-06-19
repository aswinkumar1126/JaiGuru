import React from 'react';
import ProfileTab from '../tabs/ProfileTab';
import OrdersTab from '../tabs/OrdersTab';
import SavedItemsTab from '../tabs/SavedItemsTab';
import AddressesTab from '../tabs/AddressesTab';
import './ProfileContent.css';

const ProfileContent = ({ activeTab, user }) => {
    switch (activeTab) {
        case 'orders':
            return <OrdersTab orders={user?.orders || []} />;
        case 'saved':
            return <SavedItemsTab />;
        case 'address':
            return <AddressesTab />;
        default:
            return <ProfileTab user={user} />;
    }
};

export default ProfileContent;
