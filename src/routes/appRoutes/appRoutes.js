import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MyContext } from '../../context/themeContext/themeContext';
import Header from '../../components/head/header';
import Sidebar from '../../components/slide/Sidebar';
import MainContent from '../../components/mainContent/mainContent';
import './appRoutes.css';
import AddProduct from '../../pages/product/add/addProduct';
import ManageProduct from '../../pages/product/manage/manageProducts';
import ProfileModal from '../../components/profile/ProfileModal';
import AddBanner from '../../pages/banner/add/addBanner';
import ManageBanner from '../../pages/banner/manage/manageBanners';
import AddVideos from '../../pages/video/add/addVideo';
import ManageVideos from '../../pages/video/manage/ManageVideos';
import AddRates from '../../pages/rate/add/addRates';
import ManageRates from '../../pages/rate/manage/manageRates';
//import GoogleLoginButton from '../../components/googleLogin/GoogleLoginButton';
//import CustomerLists from '../../pages/customer/CustomerLists'; // Add this component for the customer list table

const AppRoutes = () => {
    const {isSidebarOpen, setIsSidebarOpen, themeMode } = useContext(MyContext);

    // Apply theme mode to the document
    useEffect(() => {
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(themeMode);
    }, [themeMode]);

    return (
        <Router>
            <div className="app-layout">
                <Header
                    toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
                    isSidebarOpen={isSidebarOpen}
                    
                />
                <div className="layout-body">
                    <Sidebar
                        isOpen={isSidebarOpen}
                        toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
                    />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<MainContent isSidebarOpen={isSidebarOpen}/>} /> {/* Redirect to customer list */}
                           {/* Add customer list route */}
                        
                            <Route path="/product/add" element={<AddProduct />} />
                            <Route path="/banner/add" element={<AddBanner />} />
                            <Route path="/video/add" element={<AddVideos />} />
                            <Route path="/rates/add" element={<AddRates />} />
                            <Route path="/product/manage" element={<ManageProduct />} />
                            <Route path="/banner/manage" element={<ManageBanner />} />
                            <Route path="/video/manage" element={<ManageVideos />} />
                            <Route path="/rates/manage" element={<ManageRates />} />
                            <Route path="/category/add" element={<div>Add Category</div>} />
                            <Route path="/category/manage" element={<div>Manage Categories</div>} />
                            <Route path="/profile" element={<ProfileModal />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
};

export default AppRoutes;