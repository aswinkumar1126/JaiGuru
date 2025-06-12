// src/publicRoute/PublicRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../../public/pages/home/Home'; // Adjust this import if needed
import LayoutWrapper from '../../public/layout/layoutWrapper/LayoutWrapper';
import ProductDetails from '../../public/pages/product/productDetails';

const PublicRoutes = () => {
    return (
        <LayoutWrapper>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:sno" element={<ProductDetails />} />
            </Routes>
        </LayoutWrapper>
    );
};

export default PublicRoutes;
