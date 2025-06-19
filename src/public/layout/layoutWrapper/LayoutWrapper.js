// src/layouts/LayoutWrapper.js
import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import './LayoutWrapper.css';

// Common layout component used to wrap all public pages with header and footer
const LayoutWrapper = ({ children }) => {
    return (
        <div className="app-wrapper">
            {/* Top navigation/header */}
            <Header />

            {/* Main content of the page */}
            <main className="content-area">{children}</main>

            {/* Bottom footer */}
            <Footer />
        </div>
    );
};

export default LayoutWrapper;
