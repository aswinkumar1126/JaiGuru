// src/pages/login/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../service/authService';
import { useAuth } from '../../context/auth/authContext';
import './LoginPage.css';

const LoginPage = () => {
    const [form, setForm] = useState({ contactOrEmailOrUsername: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState({
        username: false,
        password: false
    });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await loginUser(form);

            const token = result.token;
            const userData = {
                id: result.user.id,
                email: result.user.email,
                username: result.user.username,
                roles: result.user.roles,
            };
            const roles = userData.roles || [];

            if (roles.includes("ROLE_EMPLOYEE") || roles.includes("ROLE_ADMIN")) {
                login(token, userData);   // Save full user info in context
                navigate('/');            // Navigate to dashboard
            } else {
                setError("Access Denied: You are not authorized to access the dashboard.");
            }
            

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="company-logo">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="#6366f1">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h2>Employee Portal</h2>
                    <p>Secure access to company resources</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className={`form-group ${isFocused.username ? 'focused' : ''}`}>
                        <label htmlFor="username">Employee ID / Email</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your ID or email"
                            value={form.contactOrEmailOrUsername}
                            onChange={(e) => setForm({ ...form, contactOrEmailOrUsername: e.target.value })}
                            onFocus={() => setIsFocused({ ...isFocused, username: true })}
                            onBlur={() => setIsFocused({ ...isFocused, username: false })}
                            required
                            className={error ? 'input-error' : ''}
                        />
                        <div className="input-highlight"></div>
                    </div>

                    <div className={`form-group ${isFocused.password ? 'focused' : ''}`}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            onFocus={() => setIsFocused({ ...isFocused, password: true })}
                            onBlur={() => setIsFocused({ ...isFocused, password: false })}
                            required
                            className={error ? 'input-error' : ''}
                        />
                        <div className="input-highlight"></div>
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? (
                            <span className="button-loader"></span>
                        ) : (
                            <>
                                <span className="button-text">Sign In</span>
                                <span className="button-icon">
                                    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="error-message">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;