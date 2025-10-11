import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth as useUserAuth } from "../../context/authContext/UserAuthContext";
import Image1 from '../../assets/login/login4.jpg';
import Image2 from '../../assets/login/Login1.jpg';
import Image3 from '../../assets/login/Login2.jpg';
import Image4 from '../../assets/login/Login3.jpg';
import Logo from '../../assets/logo/logo.png';
import "./Login.css";

const Login = () => {
    const { login, signup, currentUser } = useUserAuth();
    const [mode, setMode] = useState("login");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [identifier, setIdentifier] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";
    const isSignup = mode === "signup";

    // Redirect if user is already logged in
    useEffect(() => {
        if (currentUser) {
            navigate(from, { replace: true });
        }
    }, [currentUser, navigate, from]);

    const toggleMode = () => {
        setMode(isSignup ? "login" : "signup");
        setError(null);
        setMobileNumber("");
        setEmail("");
        setName("");
        setIdentifier("");
        setPassword("");
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
                    roles: ["ROLE_USER"],
                };
                const response = await signup(userData);
                if (response?.message?.toLowerCase().includes("already exists")) {
                    setError("An account with this email or mobile already exists.");
                    setLoading(false);
                    return;
                }
            } else {
                const loginData = {
                    contactOrEmailOrUsername: identifier,
                    password,
                };
                await login(loginData);
            }

            // Handle redirect after login/signup
            const redirectData = JSON.parse(localStorage.getItem("redirectAfterLogin"));
            if (redirectData?.path) {
                localStorage.removeItem("redirectAfterLogin");
                navigate(redirectData.path, { replace: true });
            } else {
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

    if (currentUser) {
        return null;
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    };

    const images = [Image1, Image2, Image3, Image4];

    return (
        <div className="login-page" role="main" aria-label="Login or Signup Page">
            <div className="login-carousel" aria-hidden="true">
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
                {/* <div className="carousel-dots">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={`carousel-dot ${index === 0 ? 'active' : ''}`}
                            aria-hidden="true"
                        ></span>
                    ))}
                </div> */}
            </div>
            <div className="login-container">
                <motion.div
                    className="login-card"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    role="form"
                    aria-label={isSignup ? "Signup Form" : "Login Form"}
                >
                    <div className="login-branding">
                        <motion.div className="login-brand-header" variants={itemVariants}>
                            <img src={Logo} alt="JaiGuru Jewellers Logo" className="login-logo" />
                            <h1 className="login-brand-title">
                                JaiGuru Jewellers 
                            </h1>
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
                        <motion.div
                            className="login-error"
                            variants={itemVariants}
                            role="alert"
                            aria-live="assertive"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="error-icon"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form className="login-form" onSubmit={handleAuth} noValidate>
                        {isSignup && (
                            <motion.div className="login-input-group" variants={itemVariants}>
                                <label htmlFor="name" className="sr-only">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    aria-required="true"
                                    autoComplete="name"
                                />
                            </motion.div>
                        )}

                        {isSignup ? (
                            <>
                                <motion.div className="login-input-group" variants={itemVariants}>
                                    <label htmlFor="email" className="sr-only">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        aria-required="true"
                                        autoComplete="email"
                                    />
                                </motion.div>
                                <motion.div className="login-input-group" variants={itemVariants}>
                                    <label htmlFor="mobile" className="sr-only">Mobile Number</label>
                                    <input
                                        id="mobile"
                                        type="tel"
                                        placeholder="Mobile Number"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        required
                                        aria-required="true"
                                        autoComplete="tel"
                                        pattern="[0-9]{10}"
                                    />
                                </motion.div>
                            </>
                        ) : (
                            <motion.div className="login-input-group" variants={itemVariants}>
                                <label htmlFor="identifier" className="sr-only">Email, Mobile, or Username</label>
                                <input
                                    id="identifier"
                                    type="text"
                                    placeholder="Email, Mobile, or Username"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                    aria-required="true"
                                    autoComplete="username"
                                />
                            </motion.div>
                        )}

                        <motion.div className="login-input-group password-input" variants={itemVariants}>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                aria-required="true"
                                minLength={6}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="eye-icon"
                                    >
                                        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.147.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="eye-icon"
                                    >
                                        <path d="M2.854 2.146a.5.5 0 10-.708.708l15 15a.5.5 0 00.708-.708l-15-15z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.147.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zm9.336-3.59a4 4 0 013.708 2.354L5.354 3.646A8.016 8.016 0 0110 7zM6.292 11.354l6.062 6.062A8.016 8.016 0 0010 13a4 4 0 01-3.708-2.646z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </button>
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
                            aria-label={isSignup ? "Create Account" : "Sign In"}
                        >
                            {loading ? (
                                <>
                                    <svg className="login-spinner" viewBox="0 0 50 50" aria-hidden="true">
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
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="login-toggle"
                                aria-label={isSignup ? "Switch to Sign In" : "Switch to Create Account"}
                            >
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