// src/publicRoute/PublicRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../../public/pages/home/Home'; // Adjust this import if needed
import LayoutWrapper from '../../public/layout/layoutWrapper/LayoutWrapper';
import ProductDetails from '../../public/pages/product/productDetails';
import AllProducts from '../../public/pages/allProducts/AllProducts';
import About from '../../public/pages/about/About';
import WhyUs from '../../public/pages/whyUs/WhyUs';
import Gallery from '../../public/pages/gallery/Gallery';
import AllVideos from '../../public/pages/allVideos/AllVideos';
import Contact from '../../public/pages/contact/Contact';
import Login from '../../public/pages/login/Login';
import UserPrivateRoute from '../protecteRoute/UserProtecteRoute';
import CartPage from '../../public/pages/cart/CartPage';
import UserProfile from '../../public/pages/profile/UserProfile'
import WishlistItem from '../../public/pages/WishlistPage/WishlistPage';
import ForgotPasswordPage from '../../public/pages/forget-reset/ForgotPasswordPage';
import ResetPasswordPage from '../../public/pages/forget-reset/ResetPasswordPage';
import OrderPage from '../../public/pages/order/OrderPage';
import PaymentPage from '../../public/pages/payment/PaymentPage';

const PublicRoutes = () => {
    return (
        <LayoutWrapper>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/login' element={<Login />} />

                <Route path="/product/:sno" element={<UserPrivateRoute> <ProductDetails /> </UserPrivateRoute> } />

                <Route path='/products' element={<AllProducts />  } />
                <Route path='/about' element={<About />} />
                <Route path='/why-us' element={<WhyUs />} />
                <Route path='/gallery' element={<Gallery />} />
                <Route path='/videos' element={<AllVideos />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/cart' element={<UserPrivateRoute><CartPage /></UserPrivateRoute>} />
                <Route path='/wishlist' element={<UserPrivateRoute><WishlistItem /></UserPrivateRoute>} />
                <Route path='/user/profile' element={<UserProfile />} />
                <Route path='/forgot-password' element={<ForgotPasswordPage />} />
                <Route path='/reset-password' element={<ResetPasswordPage />} />
                <Route path='/order' element={<OrderPage />} />
                <Route path="/payment/:orderId" element={<PaymentPage />} />
            </Routes>
        </LayoutWrapper>
    );
};

export default PublicRoutes;
