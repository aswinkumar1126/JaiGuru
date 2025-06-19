// src/routes/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../admin/context/auth/authContext';

const ProtectedRoute = ({ children }) => {
    const { authToken } = useAuth();

    return authToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
