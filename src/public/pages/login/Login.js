import React, { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useAuth } from "../../context/authContext/AuthContext";
import { registerUser, loginUser } from "../../service/AuthService";
import "./Login.css";

// Background image (replace with your actual image path)
import authBackground from "../../assets/image.png";

const Login = () => {
    const { login: loginContext } = useAuth();

    const [mode, setMode] = useState("login");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || '/';

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
                const response = await registerUser(userData);
                loginContext(response);;
                navigate("/");
            } else {
                const loginData = {
                    contactOrEmailOrUsername: mobileNumber,
                    password,
                };
                const response = await loginUser(loginData);
                
                await loginContext(response);
                navigate(from, { replace: true });
                
            }
        } catch (err) {
            setError(err.response?.data?.message || "Authentication failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren",
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    return (
        <div className="auth-container" style={{ backgroundImage: `url(${authBackground})` }}>
            <div className="auth-overlay"></div>

            <motion.div
                className="auth-content"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div className="auth-card" variants={itemVariants}>
                    <div className="auth-header">
                        <motion.h2 className="auth-title" variants={itemVariants}>
                            {isSignup ? "Create Account" : "Welcome Back"}
                        </motion.h2>
                        <motion.p className="auth-subtitle" variants={itemVariants}>
                            {isSignup ? "Sign up to get started" : "Sign in to continue"}
                        </motion.p>
                    </div>

                    {error && (
                        <motion.div className="auth-error" variants={itemVariants}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </motion.div>
                    )}

                    <form className="auth-form" onSubmit={handleAuth}>
                        {isSignup && (
                            <motion.div className="form-group" variants={itemVariants}>
                                <label htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </motion.div>
                        )}

                        <motion.div className="form-group" variants={itemVariants}>
                            <label htmlFor="mobile">{isSignup ? "Mobile Number" : "Mobile or Email"}</label>
                            <input
                                id="mobile"
                                type="tel"
                                placeholder={isSignup ? "+91 9876543210" : "Mobile or email"}
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                            />
                        </motion.div>

                        {isSignup && (
                            <>
                                <motion.div className="form-group" variants={itemVariants}>
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </motion.div>
                               
                            </>
                        )}

                        <motion.div className="form-group" variants={itemVariants}>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </motion.div>

                        {!isSignup && (
                            <motion.div className="auth-actions" variants={itemVariants}>
                                <a href="/forgot-password" className="forgot-password">
                                    Forgot password?
                                </a>
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                            variants={itemVariants}
                            whileHover={!loading ? { scale: 1.02 } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                        >
                            {loading ? (
                                <>
                                    <svg className="spinner" viewBox="0 0 50 50">
                                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                isSignup ? "Create Account" : "Sign In"
                            )}
                        </motion.button>
                    </form>

                    <motion.div className="auth-footer" variants={itemVariants}>
                        <p>
                            {isSignup ? "Already have an account?" : "Don't have an account?"}
                            <button type="button" onClick={toggleMode} className="auth-toggle">
                                {isSignup ? "Sign In" : "Create Account"}
                            </button>
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;