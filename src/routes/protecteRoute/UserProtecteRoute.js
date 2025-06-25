import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../public/context/authContext/UserAuthContext';

const UserPrivateRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Forces component to re-evaluate on location change
        setIsReady(false);
        const timeout = setTimeout(() => setIsReady(true), 0); // defer
        return () => clearTimeout(timeout);
    }, [location.pathname]);

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return isReady ? children : null;
};

export default UserPrivateRoute;
