import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminRoutes from '../adminRoute/AdminRoutes';
import PublicRoutes from '../publicRoute/PublicRoutes'; // Handles public-facing (e-commerce) pages

import './appRoutes.css';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Public user routes (e.g., home, products, login, etc.) */}
                <Route path="/*" element={<PublicRoutes />} />

                {/* Admin panel routes (e.g., dashboard, manage products) */}
                <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
