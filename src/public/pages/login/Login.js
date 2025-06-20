import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth as useUserAuth } from "../../context/authContext/UserAuthContext";
import Image1 from '../../assets/login/loginImage1.jpg';
import Image2 from '../../assets/login/loginImagw2.jpg';
import Image3 from '../../assets/login/loginImage3.jpg';
import Image4 from '../../assets/login/loginImage4.jpg';
import Logo from '../../assets/image.png';
import "./Login.css";

const Login = () => {
    const { user, login, signup } = useUserAuth();
    const [mode, setMode] = useState("login");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/home";
    const isSignup = mode === "signup";

    const toggleMode = () => {
        setMode(isSignup ? "login" : "signup");
        setError(null);
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignup) {
                const userData = {
                    username: name,
                    email,
                    password,
                    contactNumber: mobileNumber,
                    roles: ["USER"],
                };
                await signup(userData);
                navigate("/");
            } else {
                const loginData = {
                    contactOrEmailOrUsername: mobileNumber,
                    password,
                };
                await login(loginData);
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Authentication failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
                when: "beforeChildren",
            },
        },
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut",
            },
        },
    };

    useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user, navigate]);

    const images = [Image1, Image2, Image3, Image4];

    return (
        <div className="login-page">
            <div className="login-carousel">
                <div className="carousel-track">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Carousel image ${index + 1}`}
                            className="carousel-image"
                        />
                    ))}
                    {images.map((image, index) => (
                        <img
                            key={`duplicate-${index}`}
                            src={image}
                            alt={`Carousel image ${index + 1}`}
                            className="carousel-image"
                        />
                    ))}
                </div>
                <div className="carousel-dots">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className="carousel-dot"
                        ></span>
                    ))}
                </div>
            </div>
            <div className="login-container">
                <motion.div
                    className="login-card"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <div className="login-branding">
                        <motion.div className="login-brand-header" variants={itemVariants}>
                            <img src={Logo} alt="BMG Jewellers Logo" className="login-logo" />
                            <h1 className="login-brand-title">BMG Jewellers</h1>
                        </motion.div>
                        <motion.p className="login-brand-tagline" variants={itemVariants}>
                            Crafting Timeless Elegance
                        </motion.p>
                    </div>
                    <div className="login-header">
                        <motion.h2 className="login-title" variants={itemVariants}>
                            {isSignup ? "Create Account" : "Welcome Back"}
                        </motion.h2>
                        <motion.p className="login-subtitle" variants={itemVariants}>
                            {isSignup ? "Join our exclusive community" : "Sign in to explore our collection"}
                        </motion.p>
                    </div>

                    {error && (
                        <motion.div className="login-error" variants={itemVariants}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </motion.div>
                    )}

                    <form className="login-form" onSubmit={handleAuth}>
                        {isSignup && (
                            <motion.div className="login-input-group" variants={itemVariants}>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </motion.div>
                        )}

                        <motion.div className="login-input-group" variants={itemVariants}>
                            <input
                                id="mobile"
                                type={isSignup ? "tel" : "text"}
                                placeholder={isSignup ? "Mobile Number" : "Mobile or Email"}
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                            />
                        </motion.div>

                        {isSignup && (
                            <motion.div className="login-input-group" variants={itemVariants}>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </motion.div>
                        )}

                        <motion.div className="login-input-group password-input" variants={itemVariants}>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="eye-icon">
                                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.49 4.467-5.705 7.69-10.677 7.69-4.973 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="eye-icon">
                                        <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 01-4.242 1.727 1.762 1.762 0 000 1.113c1.49 4.467 5.704 7.69 10.675 7.69 1.96 0 3.83-.545 5.466-1.583l-1.964-1.964a5.236 5.236 0 001.782-3.95z" />
                                        <path fillRule="evenodd" d="M12 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </span>
                        </motion.div>

                        {!isSignup && (
                            <motion.div className="login-actions" variants={itemVariants}>
                                <Link to="/forgot-password" className="login-forgot">
                                    Forgot password?
                                </Link>
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                            variants={itemVariants}
                            whileHover={!loading ? { scale: 1.02 } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                        >
                            {loading ? (
                                <>
                                    <svg className="login-spinner" viewBox="0 0 50 50">
                                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                                    </svg>
                                    {isSignup ? "Creating..." : "Signing in..."}
                                </>
                            ) : (
                                isSignup ? "Create Account" : "Sign In"
                            )}
                        </motion.button>
                    </form>

                    <motion.div className="login-footer" variants={itemVariants}>
                        <span>
                            {isSignup ? "Already have an account?" : "Don't have an account?"}
                            <button type="button" onClick={toggleMode} className="login-toggle">
                                {isSignup ? "Sign In" : "Create Account"}
                            </button>
                        </span>
                        <Link to="/home" className="login-back-home">
                            Back to Home
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;