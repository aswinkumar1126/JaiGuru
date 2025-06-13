// src/context/auth/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../../service/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token'));
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (authToken) {
            fetchUserProfile()
                .then((data) => setUser(data))
                .catch(() => {
                    setUser(null);
                    setAuthToken(null);
                    localStorage.removeItem('auth_token');
                });
        }
    }, [authToken]);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        setAuthToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
