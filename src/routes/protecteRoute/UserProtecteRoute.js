// src/routes/UserPrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../public/context/authContext/AuthContext';

const UserPrivateRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();
    

    if (!user) {
        // Redirect unauthenticated users to login, preserving the current location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default UserPrivateRoute;
