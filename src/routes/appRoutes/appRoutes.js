import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
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

const AppRoutes = () => {
    const adminName = 'Aswinkumar';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);



    return (
        <Router>
            <div className="app-layout">
                <Header adminName={adminName} toggleSidebar={() => setIsSidebarOpen(prev => !prev)} isSidebarOpen={isSidebarOpen} />
                <div className="layout-body">
                    <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
                    <main className={'main-content'}>
                        <Routes>
                            <Route path="/" element={<MainContent isSidebarOpen={isSidebarOpen} />} />

                            <Route path="/product/add" element={<AddProduct />} />
                            <Route path="/banner/add" element={<AddBanner />} />
                            <Route path="/video/add" element={<AddVideos />} />
                            <Route path="/rates/add" element={<AddRates />} />


                            <Route path="/product/manage" element={<ManageProduct />} />
                            <Route path="/banner/manage" element={<ManageBanner />} />
                            <Route path="/video/manage" element={<ManageVideos />} />
                            <Route path="/rates/manage" element={<ManageRates />} />

                            <Route path="/category/add" element={<div>Add Category</div>} /> {/* Placeholder */}
                            <Route path="/category/manage" element={<div>Manage Categories</div>} /> {/* Placeholder */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                            <Route path="/profile" element={<ProfileModal />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
};

export default AppRoutes;