// src/layouts/LayoutWrapper.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import './LayoutWrapper.css'; // optional for layout-specific styles

const LayoutWrapper = ({ children }) => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <div className="app-wrapper">
            {!isLoginPage && <Header />}
            <main className="content-area" >{children}</main>
            {!isLoginPage && <Footer />}
        </div>
    );
};

export default LayoutWrapper;
