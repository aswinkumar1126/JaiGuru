import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MyContext } from '../../admin/context/themeContext/themeContext';
import { useAuth } from '../../admin/context/auth/authContext';
import ProtectedRoute from '../protecedRoute/ProtectedRoute';
import LoginPage from '../../admin/pages/login/loginPage';
import Sidebar from '../../admin/components/slide/Sidebar';
import MainContent from '../../admin/components/mainContent/mainContent';
import EmployeeProfile from '../../admin/pages/employeeprofile/EmployeeProfilePage';
import AddProduct from '../../admin/pages/product/add/addProduct';
import ManageProduct from '../../admin/pages/product/manage/manageProducts';
import AddBanner from '../../admin/pages/banner/add/addBanner';
import ManageBanner from '../../admin/pages/banner/manage/manageBanners';
import AddVideos from '../../admin/pages/video/add/addVideo';
import ManageVideos from '../../admin/pages/video/manage/ManageVideos';
import AddRates from '../../admin/pages/rate/add/addRates';
import ManageRates from '../../admin/pages/rate/manage/manageRates';
import AddEmployee from '../../admin/pages/employee/add/AddEmployee';
import ManageEmployees from '../../admin/pages/employee/manage/ManageEmployees';
import Unauthorized from '../../admin/pages/unauthorized/Unauthorized';
import UserDetails from '../../admin/pages/dashboard/userDetails';
import NewAdminHeader from '../../admin/components/head/header';
import './AdminRoutes.css';

const AdminRoutes = () => {
    const { isSidebarOpen, setIsSidebarOpen, themeMode } = useContext(MyContext);
    const { authToken } = useAuth();
    const allowedRoles = ['ROLE_ADMIN', 'ROLE_EMPLOYEE'];

    useEffect(() => {
        const handleResize = () => {
            const isLargeScreen = window.innerWidth > 1024;
            setIsSidebarOpen(isLargeScreen); // Open by default on large screens
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setIsSidebarOpen]);

    useEffect(() => {
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(themeMode);
    }, [themeMode]);

    if (!authToken) {
        return (
            <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/admin/login" replace />} />
            </Routes>
        );
    }

    return (
        <div className="app-layout">
            <NewAdminHeader
                toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                isSidebarOpen={isSidebarOpen}
            />
            <div className="layout-body">
                <Sidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                />
                <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute allowedRoles={allowedRoles}>
                                    <MainContent />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/product/add"
                            element={
                                <ProtectedRoute allowedRoles={allowedRoles}>
                                    <AddProduct />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="product/manage"
                            element={
                                <ProtectedRoute allowedRoles={allowedRoles}>
                                    <ManageProduct />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="banner/add"
                            element={
                                <ProtectedRoute allowedRoles={allowedRoles}>
                                    <AddBanner />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="banner/manage"
                            element={
                                <ProtectedRoute allowedRoles={allowedRoles}>
                                    <ManageBanner />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="video/add"
                            element={
                                <ProtectedRoute allowedRoles={allowedRoles}>
                                    <AddVideos />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="video/manage"
                            element={
                                <ProtectedRoute allowedRoles={allowedRoles}>
                                    <ManageVideos />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="rates/add"
                            element={
                                <ProtectedRoute allowedRoles={allowedRoles}>
                                    <AddRates />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="rates/manage"
                            element={
                                <ProtectedRoute allowedRoles={allowedRoles}>
                                    <ManageRates />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="employee/add"
                            element={
                                <ProtectedRoute allowedRoles={allowedRoles}>
                                    <AddEmployee />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="employee/manage"
                            element={
                                <ProtectedRoute allowedRoles={allowedRoles}>
                                    <ManageEmployees />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="profile"
                            element={
                                <ProtectedRoute allowedRoles={allowedRoles}>
                                    <EmployeeProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="userDetails" element={<UserDetails />} />
                        <Route path="unauthorized" element={<Unauthorized />} />
                        <Route path="*" element={<Navigate to="/admin" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminRoutes;