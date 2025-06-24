import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { Outlet } from 'react-router-dom'; // ✅ import this
import './LayoutWrapper.css';

const LayoutWrapper = () => {
    return (
        <div className="app-wrapper">
            <Header />
            <main className="content-area">
                <Outlet /> {/* ✅ This renders the routed page */}
            </main>
            <Footer />
        </div>
    );
};

export default LayoutWrapper;
