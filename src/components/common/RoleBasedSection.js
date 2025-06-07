// src/components/common/RoleBasedSection.js
import React from 'react';
import { useAuth } from '../../context/auth/authContext';

const RoleBasedSection = ({ allowedRoles, children }) => {
    const { user } = useAuth();
    const userRoles = user?.roles || [];
    const hasAccess = allowedRoles.some(role => userRoles.includes(role));
    return hasAccess ? children : null;
};

export default RoleBasedSection;
