import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../service/authService';
import { useAuth } from '../../context/auth/authContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './LoginPage.css';

// Import your images
import image1 from '../../assets/images/login/Login1.jpg';
import image2 from '../../assets/images/login/Login2.jpg';
import image3 from '../../assets/images/login/Login3.png';
import logo from '../../assets/images/bg-img-01.png';

const LoginPage = () => {
    const [form, setForm] = useState({ contactOrEmailOrUsername: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const passwordInputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.name === 'contactOrEmailOrUsername') {
            passwordInputRef.current?.focus();
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await loginUser(form);
            const token = result.token;
            const userData = {
                id: result.user.id,
                email: result.user.email,
                username: result.user.username,
                roles: result.user.roles,
            };
            const roles = userData.roles || [];

            if (roles.includes('ROLE_EMPLOYEE') || roles.includes('ROLE_ADMIN')) {
                login(token, userData, rememberMe);
                navigate('/');
            } else {
                setError('Access Denied: You are not authorized to access the dashboard.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <section className="sign-in-page">
            <div className="sign-in-container">
                <div className="sign-in-row">
                    {/* Left Side - Carousel */}
                    <div className="sign-in-details text-center">
                        <div className="sign-in-detail text-white">
                            <a className="sign-in-logo">
                                <img src={logo} className="img-fluid sign-in-logo-img" alt="logo" />
                                <span className="logName">Admin Portal</span>
                            </a>

                            <Swiper
                                modules={[Pagination, Navigation, Autoplay]}
                                spaceBetween={10}
                                slidesPerView={1}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                pagination={{ clickable: true, type: 'bullets' }}
                                navigation={true}
                                loop={true}
                                className="swiper-navigation"
                            >
                                <SwiperSlide className="swiper-slide-content">
                                    <img src={image1} alt="Slide 1" className="img-fluid swiper-slide-img" />
                                    <h4 className="firstSlide">Streamline Your Workflow</h4>
                                    <p className="firstSlidePara">
                                        Access all your tools and resources in one secure platform.
                                    </p>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide-content">
                                    <img src={image2} alt="Slide 2" className="img-fluid swiper-slide-img" />
                                    <h4 className="firstSlide">Boost Productivity</h4>
                                    <p className="firstSlidePara">
                                        Integrated tools designed to help you work more efficiently.
                                    </p>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide-content">
                                    <img src={image3} alt="Slide 3" className="img-fluid swiper-slide-img" />
                                    <h4 className="firstSlide">Seamless Collaboration</h4>
                                    <p className="firstSlidePara">
                                        Connect with your team and work together effortlessly.
                                    </p>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="sign-in-form-container">
                        <div className="sign-in-from">
                            <div className="mobile-header text-center">
                                <img src={logo} alt="Company Logo" className="login-mobile-logo" />
                                <h2 className="login-mobile-title">Admin Portal</h2>
                            </div>

                            <h1 className="sign-in-title">Log in</h1>
                            <p className="sign-in-subtitle">
                                Enter your employee name or email and password to access the portal.
                            </p>

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            <form className="sign-in-form" onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label className="form-label">Employee Name / Email</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        name="contactOrEmailOrUsername"
                                        placeholder="Enter your ID or email"
                                        value={form.contactOrEmailOrUsername}
                                        onChange={(e) => setForm({ ...form, contactOrEmailOrUsername: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group password-group">
                                    <label className="form-label">Password</label>
                                   
                                    <input
                                        ref={passwordInputRef}
                                        type="password"
                                        className="form-input"
                                        placeholder="Password"
                                        name="password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-footer">
                                 
                                    <button
                                        type="submit"
                                        className="sign-in-button"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner" role="status" aria-hidden="true"></span>
                                                Logging In...
                                            </>
                                        ) : (
                                            'Log in'
                                        )}
                                    </button>
                                </div>
                                <div className="sign-in-footer">
                                    <span className="sign-up-text">
                                        Don't have an account?{' '}
                                        <p  className="sign-up-link">
                                            Contact Admin
                                        </p>
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;