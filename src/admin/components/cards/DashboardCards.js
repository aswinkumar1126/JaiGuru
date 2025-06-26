import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './DashboardCards.css';
import { getDashboardData } from '../../service/dashBoardService';
import {
    FaUsers, FaShoppingCart, FaClock,
    FaCheckCircle, FaTruck, FaTimesCircle,
    FaChartLine, FaChevronUp, FaChevronDown,
    FaRedo, FaExternalLinkAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './Loader';
import { Link } from 'react-router-dom';

const DashboardCards = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    // Professional number formatter with currency support
    const formatNumber = useCallback((num, options = {}) => {
        const { isCurrency = false, currency = 'USD' } = options;

        if (isNaN(num) || num === null) return '-';

        if (isCurrency) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(num);
        }

        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    }, []);

    // Enhanced change calculator with neutral threshold
    const calculateChange = useCallback((cardId, dashboardData) => {
        const percentageMap = {
            totalOrders: dashboardData?.totalPercentage ,
            pendingOrders: dashboardData?.pendingPercentage,
            deliveredOrders: dashboardData?.deliveredPercentage,
            shippedOrders: dashboardData?.shippedPercentage,
            cancelledOrders: dashboardData?.cancelledPercentage
        };

        if (percentageMap[cardId]) {
            const percentageValue = parseFloat(percentageMap[cardId]);
            return {
                value: Math.abs(percentageValue),
                direction: percentageValue > 5 ? 'up' : percentageValue < -5 ? 'down' : 'neutral'
            };
        }

        return { value: 0, direction: 'neutral' };
    }, []);

    // Memoized cards data with professional color scheme
    const cardsData = useMemo(() => {
        if (!dashboardData) return [];

        return [
            {
                id: 'totalUsers',
                title: 'Total Users',
                value: dashboardData.totalUsers,
                icon: <FaUsers />,
                detail: 'Active registered users in the system',
                color: '#4e73df',
                link: 'userDetails',
                trend: generateRandomTrend(7, dashboardData.totalUsers)
            },
            {
                id: 'totalOrders',
                title: 'Total Orders',
                value: dashboardData.totalOrders,
                icon: <FaShoppingCart />,
                detail: 'All orders placed in the system',
                color: '#1cc88a',
                link: 'AllOrderPage',
                trend: generateRandomTrend(7, dashboardData.totalOrders)
            },
            {
                id: 'pendingOrders',
                title: 'Pending Orders',
                value: dashboardData.pendingOrders,
                icon: <FaClock />,
                detail: 'Orders awaiting processing',
                color: '#f6c23e',
                link: 'pendingOrders',
                trend: generateRandomTrend(7, dashboardData.pendingOrders)
            },
            {
                id: 'deliveredOrders',
                title: 'Delivered Orders',
                value: dashboardData.deliveredOrders,
                icon: <FaCheckCircle />,
                detail: 'Orders successfully delivered',
                color: '#36b9cc',
                link: 'deliveredOrders',
                trend: generateRandomTrend(7, dashboardData.deliveredOrders)
            },
            {
                id: 'shippedOrders',
                title: 'Shipped Orders',
                value: dashboardData.shippedOrders,
                icon: <FaTruck />,
                detail: 'Orders currently in transit',
                color: '#858796',
                link: 'shippedOrders',
                trend: generateRandomTrend(7, dashboardData.shippedOrders)
            },
            {
                id: 'cancelledOrders',
                title: 'Cancelled Orders',
                value: dashboardData.cancelledOrders,
                icon: <FaTimesCircle />,
                detail: 'Orders cancelled by users or system',
                color: '#e74a3b',
                link: 'cancelledOrders',
                trend: generateRandomTrend(7, dashboardData.cancelledOrders)
            }
        ].filter(card => !isNaN(card.value));
    }, [dashboardData]);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getDashboardData();
            console.log("dashboard",data);
            setLastUpdated(new Date());

            const transformedData = {
                totalUsers: data.totalUsers?.totalUsers || 0,
                totalOrders: data.totalOrders?.totalOrders || 0,
                pendingOrders: data.pendingOrders?.totalPending || 0,
                deliveredOrders: data.deliveredOrders?.deliveredOrders?.length || 0,
                shippedOrders: data.shippedOrders?.shippedOrders?.length || 0,
                cancelledOrders: data.cancelledOrders?.total || 0,
                totalPercentage: data.totalOrders?.totalPercentage || '0%',
                pendingPercentage: data.pendingOrders?.pendingPercentage || '0%',
                deliveredPercentage: data.deliveredOrders?.deliveredPercentage || '0%',
                shippedPercentage: data.shippedOrders?.ShippedPercentage || '0%',
                cancelledPercentage: data.cancelledOrders?.cancelledPercentage || '0%',
            };

            setDashboardData(transformedData);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, [fetchData]);

    function generateRandomTrend(days, currentValue) {
        return Array.from({ length: days }, (_, i) => {
            const progress = i / (days - 1);
            return Math.max(0, Math.round(
                currentValue * (0.7 + Math.random() * 0.6) * progress
            ));
        });
    }

    if (error) {
        return (
            <motion.div
                className="dashboard-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="error-message">
                    <FaTimesCircle className="error-icon" />
                    <h3>Data Loading Error</h3>
                    <p>{error}</p>
                    <motion.button
                        onClick={fetchData}
                        className="retry-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaRedo className="mr-2" />
                        Retry
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1>Business Overview</h1>
                    {lastUpdated && (
                        <p className="last-updated">
                            Last updated: {lastUpdated.toLocaleTimeString()} on {lastUpdated.toLocaleDateString()}
                        </p>
                    )}
                </motion.div>
            </div>

            {isLoading ? (
                <motion.div
                    className="loading-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <Loader />
                    <p>Loading dashboard data...</p>
                </motion.div>
            ) : (
                <motion.div
                    className="cards-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, staggerChildren: 0.1 }}
                >
                    {cardsData.map((card, index) => (
                        <DashboardCard
                            key={card.id}
                            card={card}
                            index={index}
                            isSelected={selectedMetric === card.id}
                            onSelect={setSelectedMetric}
                            isHovered={hoveredCard === card.id}
                            onHover={setHoveredCard}
                            calculateChange={calculateChange}
                            formatNumber={formatNumber}
                            dashboardData={dashboardData}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
};

const DashboardCard = React.memo(({
    card,
    index,
    isSelected,
    onSelect,
    isHovered,
    onHover,
    calculateChange,
    formatNumber,
    dashboardData
}) => {
    const change = calculateChange(card.id, dashboardData);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onSelect(isSelected ? null : card.id);
            setIsAnimating(false);
        }, 300);
    };

    return (
        <motion.div
            className={`card ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: isAnimating ? (isSelected ? 0.95 : 1.05) : 1
            }}
            transition={{
                duration: 0.3,
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100
            }}
            whileHover={{
                y: -5,
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}
            onClick={handleClick}
            onMouseEnter={() => onHover(card.id)}
            onMouseLeave={() => onHover(null)}
            style={{
                borderTop: `4px solid ${card.color}`,
                transformOrigin: 'center bottom'
            }}
            layout
        >
            <div className="card-header">
                <motion.div
                    className="card-icon"
                    style={{
                        backgroundColor: `${card.color}20`,
                        color: card.color
                    }}
                    whileHover={{ rotate: 15 }}
                >
                    {card.icon}
                </motion.div>
                <motion.div
                    className={`change-indicator ${change.direction}`}
                    whileHover={{ scale: 1.1 }}
                >
                    {change.direction === 'up' ? (
                        <FaChevronUp />
                    ) : change.direction === 'down' ? (
                        <FaChevronDown />
                    ) : null}
                    {change.value}%
                </motion.div>
            </div>

            <h3>{card.title}</h3>

            <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <Link to={`${card.link}`} className="card-link">
                    View Details <FaExternalLinkAlt />
                </Link>
            </motion.div>

            <p className="card-value">{formatNumber(card.value)}</p>

            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        className="card-detail"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: 1,
                            height: 'auto',
                            transition: {
                                opacity: { duration: 0.2 },
                                height: { duration: 0.3 }
                            }
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                            transition: {
                                opacity: { duration: 0.1 },
                                height: { duration: 0.2 }
                            }
                        }}
                    >
                        <p className="card-description">{card.detail}</p>

                        <motion.div
                            className="mini-trend"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="trend-line-container">
                                {card.trend.map((value, i) => (
                                    <motion.div
                                        key={i}
                                        className="trend-line"
                                        initial={{ height: 0 }}
                                        animate={{
                                            height: `${Math.min(100, (value / Math.max(...card.trend)) * 100)}%`,
                                            transition: {
                                                delay: i * 0.05,
                                                type: 'spring',
                                                damping: 10
                                            }
                                        }}
                                        style={{ backgroundColor: card.color }}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        <motion.button
                            className="action-btn"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: `0 2px 10px ${card.color}40`
                            }}
                            whileTap={{ scale: 0.95 }}
                            style={{ backgroundColor: `${card.color}20`, color: card.color }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaChartLine className="mr-2" />
                            View Full Report
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Glow effect */}
            {isHovered && (
                <motion.div
                    className="card-glow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    style={{ backgroundColor: card.color }}
                />
            )}
        </motion.div>
    );
});

export default DashboardCards;