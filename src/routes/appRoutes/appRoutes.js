// src/routes/AppRoutes.js
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MyContext } from '../../context/themeContext/themeContext';
import { useAuth } from '../../context/auth/authContext';

import ProtectedRoute from '../protecedRoute/ProtectedRoute';
import LoginPage from '../../pages/login/loginPage';
import Header from '../../components/head/header';
import Sidebar from '../../components/slide/Sidebar';
import MainContent from '../../components/mainContent/mainContent';
import EmployeeProfile from '../../pages/employeeprofile/EmployeeProfilePage';

import AddProduct from '../../pages/product/add/addProduct';
import ManageProduct from '../../pages/product/manage/manageProducts';
import AddBanner from '../../pages/banner/add/addBanner';
import ManageBanner from '../../pages/banner/manage/manageBanners';
import AddVideos from '../../pages/video/add/addVideo';
import ManageVideos from '../../pages/video/manage/ManageVideos';
import AddRates from '../../pages/rate/add/addRates';
import ManageRates from '../../pages/rate/manage/manageRates';
import Unauthorized from '../../pages/unauthorized/Unauthorized';

import './appRoutes.css';

const AppRoutes = () => {
    const { isSidebarOpen, setIsSidebarOpen, themeMode } = useContext(MyContext);
    const { authToken } = useAuth();

    const allowedRoles = ['ROLE_ADMIN', 'ROLE_EMPLOYEE'];

    useEffect(() => {
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(themeMode);
    }, [themeMode]);

    return (
        <Router>
            {!authToken ? (
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            ) : (
                <div className="app-layout">
                    <Header toggleSidebar={() => setIsSidebarOpen(prev => !prev)} isSidebarOpen={isSidebarOpen} />
                    <div className="layout-body">
                        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
                        <main className="main-content">
                            <Routes>
                                <Route path="/" element={
                                    <ProtectedRoute allowedRoles={allowedRoles}>
                                        <MainContent isSidebarOpen={isSidebarOpen} />
                                    </ProtectedRoute>
                                } />
                                <Route path="/product/add" element={
                                    <ProtectedRoute allowedRoles={allowedRoles}>
                                        <AddProduct />
                                    </ProtectedRoute>
                                } />
                                <Route path="/banner/add" element={
                                    <ProtectedRoute allowedRoles={allowedRoles}>
                                        <AddBanner />
                                    </ProtectedRoute>
                                } />
                                <Route path="/video/add" element={
                                    <ProtectedRoute allowedRoles={allowedRoles}>
                                        <AddVideos />
                                    </ProtectedRoute>
                                } />
                                <Route path="/rates/add" element={
                                    <ProtectedRoute allowedRoles={allowedRoles}>
                                        <AddRates />
                                    </ProtectedRoute>
                                } />
                                <Route path="/product/manage" element={
                                    <ProtectedRoute allowedRoles={allowedRoles}>
                                        <ManageProduct />
                                    </ProtectedRoute>
                                } />
                                <Route path="/banner/manage" element={
                                    <ProtectedRoute allowedRoles={allowedRoles}>
                                        <ManageBanner />
                                    </ProtectedRoute>
                                } />
                                <Route path="/video/manage" element={
                                    <ProtectedRoute allowedRoles={allowedRoles}>
                                        <ManageVideos />
                                    </ProtectedRoute>
                                } />
                                <Route path="/rates/manage" element={
                                    <ProtectedRoute allowedRoles={allowedRoles}>
                                        <ManageRates />
                                    </ProtectedRoute>
                                } />
                                <Route path="/profile" element={
                                    <ProtectedRoute allowedRoles={allowedRoles}>
                                        <EmployeeProfile />
                                    </ProtectedRoute>
                                } />
                                <Route path="/unauthorized" element={<Unauthorized />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </main>
                    </div>
                </div>
            )}
        </Router>
    );
};

export default AppRoutes;
