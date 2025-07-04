import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.css';

function NotFound() {
    const navigate = useNavigate();

    // Animation variants for better organization
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2,
                when: "beforeChildren"
            }
        },
        exit: { opacity: 0, transition: { duration: 0.5 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const errorCodeVariants = {
        pulse: {
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut"
            }
        }
    };

    const buttonHover = {
        hover: {
            y: -3,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <motion.div
            className="not-found-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="not-found-content">
                <motion.div
                    className="error-code"
                    variants={errorCodeVariants}
                    animate="pulse"
                >
                    404
                </motion.div>

                <motion.h1
                    className="error-title"
                    variants={itemVariants}
                >
                    Page Not Found
                </motion.h1>

                <motion.p
                    className="error-message"
                    variants={itemVariants}
                >
                    Oops! The page you're looking for doesn't exist or has been moved.
                </motion.p>

                <motion.div
                    className="action-buttons"
                    variants={itemVariants}
                >
                    <motion.button
                        className="home-button"
                        onClick={() => navigate('/')}
                        variants={buttonHover}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <span className="button-icon">🏠</span>
                        Return to Home
                    </motion.button>

                    <motion.button
                        className="back-button"
                        onClick={() => navigate(-1)}
                        variants={buttonHover}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <span className="button-icon">↩️</span>
                        Go Back
                    </motion.button>
                </motion.div>
            </div>

            {/* Decorative animated elements */}
            <motion.div
                className="bg-circle circle-1"
                initial={{ x: -100, y: -100, opacity: 0 }}
                animate={{
                    x: [0, 20, 0],
                    y: [0, 20, 0],
                    opacity: [0.1, 0.15, 0.1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="bg-circle circle-2"
                initial={{ x: 100, y: 100, opacity: 0 }}
                animate={{
                    x: [0, -20, 0],
                    y: [0, -20, 0],
                    opacity: [0.1, 0.15, 0.1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />
        </motion.div>
    );
}

export default NotFound;