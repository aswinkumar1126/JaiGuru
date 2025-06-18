import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth as useUserAuth } from "../../context/authContext/UserAuthContext";
import "./Login.css";

const Login = () => {
    const { user, login, signup } = useUserAuth();
    const [mode, setMode] = useState("login");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
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
                navigate("/home");
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
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                when: "beforeChildren",
            },
        },
    };

    const itemVariants = {
        hidden: { y: 5, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.2,
                ease: "easeOut",
            },
        },
    };

    useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user, navigate]);

    return (
        <div className="login-container">
            <motion.div
                className="login-card"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="login-header">
                    <motion.h2 className="login-title" variants={itemVariants}>
                        {isSignup ? "Create Account" : "Welcome Back"}
                    </motion.h2>
                    <motion.p className="login-subtitle" variants={itemVariants}>
                        {isSignup ? "Get started with your account" : "Sign in to continue"}
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

                    <motion.div className="login-input-group" variants={itemVariants}>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
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
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;