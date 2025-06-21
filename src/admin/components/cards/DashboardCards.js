import React, { useEffect, useState, Suspense } from 'react';
import './DashboardCards.css';
import { getDashboardData } from '../../service/dashBoardService';
import {
    FaUsers, FaShoppingCart, FaClock,
    FaCheckCircle, FaTruck, FaTimesCircle,
    FaChartLine, FaChevronUp, FaChevronDown
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './Loader';
import { Link } from 'react-router-dom';
const Chart = React.lazy(() => import('react-apexcharts'));

const DashboardCards = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeView, setActiveView] = useState('cards');
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [timeRange, setTimeRange] = useState('week');
    const [trendData, setTrendData] = useState({});

    const generateTimeCategories = (range) => {
        const now = new Date();
        const categories = [];
        const days = range === 'week' ? 7 : range === 'month' ? 30 : 90;

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            if (range === 'week') {
                categories.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            } else if (range === 'month' && (i % 5 === 0 || i === days - 1)) {
                categories.push(date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));
            } else if (range === 'quarter' && (i % 15 === 0 || i === days - 1)) {
                categories.push(date.toLocaleDateString('en-US', { month: 'short' }));
            } else {
                categories.push('');
            }
        }

        return categories;
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const calculateChange = (trend, cardId, dashboardData) => {
        // Use the percentage from API if available
        const percentageMap = {
            pendingOrders: dashboardData?.pendingPercentage,
            deliveredOrders: dashboardData?.deliveredPercentage,
            shippedOrders: dashboardData?.shippedPercentage,
            cancelledOrders: dashboardData?.cancelledPercentage
        };

        if (percentageMap[cardId]) {
            const percentageValue = parseFloat(percentageMap[cardId]);
            return {
                value: Math.abs(percentageValue),
                direction: percentageValue > 0 ? 'up' : percentageValue < 0 ? 'down' : 'neutral'
            };
        }

        // Fallback to trend calculation if no percentage from API
        if (!trend || trend.length < 2) return { value: 0, direction: 'neutral' };

        const current = trend[trend.length - 1];
        const previous = trend[trend.length - 2];
        const change = previous !== 0 ? ((current - previous) / previous) * 100 : 100;

        return {
            value: Math.abs(Math.round(change)),
            direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getDashboardData();
                console.log('trans', data);

                const transformedData = {
                    totalUsers: data.totalUsers?.totalUsers || 0,
                    totalOrders: data.totalOrders?.totalOrders || 0,

                    // Order counts
                    pendingOrders: data.pendingOrders?.totalPending || 0,
                    deliveredOrders: data.deliveredOrders?.deliveredOrders?.length || 0,
                    shippedOrders: data.shippedOrders?.shippedOrders?.length || 0,
                    cancelledOrders: data.cancelledOrders?.cancelledOrders?.length || 0,

                    // Percentages (optional, if you want to show them)
                    pendingPercentage: data.pendingOrders?.pendingPercentage || '0%',
                    deliveredPercentage: data.deliveredOrders?.deliveredPercentage || '0%',
                    shippedPercentage: data.shippedOrders?.ShippedPercentage || '0%',
                    cancelledPercentage: data.cancelledOrders?.cancelledPercentage || '0%',

                    // Additional metrics
                    conversionRate: data.conversionRate || 0,
                    avgOrderValue: data.avgOrderValue || 0,
                    trends: data.trends || generateDefaultTrends(data),
                };

                setDashboardData(transformedData);
                setTrendData(transformedData.trends);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        const generateDefaultTrends = (data) => {
            const metrics = [
                'totalUsers', 'totalOrders', 'pendingOrders',
                'deliveredOrders', 'shippedOrders', 'cancelledOrders',
                'conversionRate', 'avgOrderValue'
            ];

            return metrics.reduce((acc, metric) => {
                const currentValue = data[metric] || 0;
                acc[metric] = {
                    week: generateRandomTrend(7, currentValue),
                    month: generateRandomTrend(30, currentValue),
                    quarter: generateRandomTrend(90, currentValue)
                };
                return acc;
            }, {});
        };

        const generateRandomTrend = (days, currentValue) => {
            return Array.from({ length: days }, (_, i) => {
                const progress = i / (days - 1);
                return Math.max(0, Math.round(
                    currentValue * (0.7 + Math.random() * 0.6) * progress
                ));
            });
        };

        fetchData();
    }, []);

    console.log(dashboardData);
    const cardsData = dashboardData ? [
        {
            id: 'totalUsers',
            title: 'Total Users',
            value: dashboardData.totalUsers,
            icon: <FaUsers />,
            detail: 'Active registered users in the system',
            color: '#3498db',
            link: 'userDetails'
        },
        {
            id: 'totalOrders',
            title: 'Total Orders',
            value: dashboardData.totalOrders,
            icon: <FaShoppingCart />,
            detail: 'All orders placed in the system',
            color: '#2ecc71'
        },
        {
            id: 'pendingOrders',
            title: 'Pending Orders',
            value: dashboardData.pendingOrders,
            icon: <FaClock />,
            detail: 'Orders awaiting processing',
            color: '#f1c40f'
        },
        {
            id: 'deliveredOrders',
            title: 'Delivered Orders',
            value: dashboardData.deliveredOrders,
            icon: <FaCheckCircle />,
            detail: 'Orders successfully delivered',
            color: '#27ae60'
        },
        {
            id: 'shippedOrders',
            title: 'Shipped Orders',
            value: dashboardData.shippedOrders,
            icon: <FaTruck />,
            detail: 'Orders currently in transit',
            color: '#2980b9'
        },
        {
            id: 'cancelledOrders',
            title: 'Cancelled Orders',
            value: dashboardData.cancelledOrders,
            icon: <FaTimesCircle />,
            detail: 'Orders cancelled by users or system',
            color: '#e74c3c'
        }
    ] : [];

    const getChartOptions = (metricId) => {
        const metric = cardsData.find(m => m.id === metricId);
        return {
            chart: {
                height: '100%',
                type: 'area',
                toolbar: { show: false },
                zoom: { enabled: false },
                animations: { enabled: true, easing: 'easeout', speed: 800 }
            },
            colors: [metric.color],
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 2 },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.3,
                }
            },
            xaxis: {
                categories: generateTimeCategories(timeRange),
                labels: { style: { colors: '#7f8c8d' } },
                tooltip: { enabled: false }
            },
            yaxis: {
                labels: {
                    style: { colors: '#7f8c8d' },
                    formatter: (value) => formatNumber(value)
                }
            },
            tooltip: {
                y: { formatter: (value) => formatNumber(value) }
            },
            grid: {
                borderColor: '#f1f1f1',
                strokeDashArray: 3
            },
            responsive: [{
                breakpoint: 768,
                options: {
                    chart: { height: 250 },
                    xaxis: { labels: { show: false } }
                }
            }]
        };
    };

    if (error) {
        return (
            <div className="dashboard-error">
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Business Overview</h1>
                <div className="controls">
                    <div className="view-toggle">
                        <button
                            onClick={() => setActiveView('cards')}
                            className={`toggle-btn ${activeView === 'cards' ? 'active' : ''}`}
                            aria-label="Cards view"
                        >
                            Cards View
                        </button>
                        <button
                            onClick={() => {
                                setActiveView('analytics');
                                if (cardsData.length > 0 && !selectedMetric) {
                                    setSelectedMetric(cardsData[0].id);
                                }
                            }}
                            className={`toggle-btn ${activeView === 'analytics' ? 'active' : ''}`}
                            aria-label="Analytics view"
                        >
                            Analytics View
                        </button>
                    </div>

                    {activeView === 'analytics' && (
                        <div className="time-range-selector">
                            {['week', 'month', 'quarter'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`range-btn ${timeRange === range ? 'active' : ''}`}
                                    aria-label={`Show ${range} data`}
                                >
                                    {range.charAt(0).toUpperCase() + range.slice(1)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="loading-state">
                    <Loader />
                    <p>Loading dashboard data...</p>
                </div>
            ) : activeView === 'cards' ? (
                <motion.div
                    className="cards-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {cardsData.map((card) => (
                        <DashboardCard
                            key={card.id}
                            card={card}
                            isSelected={selectedMetric === card.id}
                            onSelect={setSelectedMetric}
                            trend={trendData[card.id]?.week || []}
                            onViewAnalytics={() => {
                                setActiveView('analytics');
                                setSelectedMetric(card.id);
                            }}
                            calculateChange={calculateChange}
                            formatNumber={formatNumber}
                            dashboardData={dashboardData}
                        />
                    ))}
                </motion.div>
            ) : (
                <AnalyticsView
                    cardsData={cardsData}
                    selectedMetric={selectedMetric}
                    setSelectedMetric={setSelectedMetric}
                    timeRange={timeRange}
                    trendData={trendData}
                    getChartOptions={getChartOptions}
                    formatNumber={formatNumber}
                    calculateChange={calculateChange}
                    dashboardData={dashboardData}
                />
            )}
        </div>
    );
};

const DashboardCard = ({ card, isSelected, onSelect, trend, onViewAnalytics, calculateChange, formatNumber, dashboardData }) => {
    const change = calculateChange(trend, card.id, dashboardData);

    return (
        <motion.div
            className={`card ${isSelected ? 'selected' : ''}`}
            whileHover={{ y: -5 }}
            onClick={() => onSelect(isSelected ? null : card.id)}
            style={{ borderTop: `4px solid ${card.color}` }}
            layout
        >
            <div className="card-header">
                <div className="card-icon" style={{ backgroundColor: `${card.color}20` }}>
                    {card.icon}
                </div>
                <div className={`change-indicator ${change.direction}`}>
                    {change.direction === 'up' ? <FaChevronUp /> : <FaChevronDown />}
                    {change.value}%
                </div>
            </div>
            <h3>{card.title}</h3>
            <Link to={`${card.link}`} title="View details" style={{ textDecoration: 'none', color: 'green', fontWeight: '600' }} >Details</Link>
            <p>{formatNumber(card.value)}</p>

            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        className="card-detail"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <p>{card.detail}</p>
                        <div className="mini-chart">
                            <Suspense fallback={<div className="chart-placeholder" />}>
                                <Chart
                                    options={{
                                        chart: { sparkline: { enabled: true } },
                                        stroke: { curve: 'smooth', width: 2 },
                                        colors: [card.color],
                                        tooltip: { enabled: false },
                                        xaxis: { labels: { show: false } },
                                        yaxis: { show: false }
                                    }}
                                    series={[{ name: card.title, data: trend.slice(-7) }]}
                                    type="area"
                                    height="80px"
                                />
                            </Suspense>
                        </div>
                        <button
                            className="action-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewAnalytics();
                            }}
                            aria-label={`View ${card.title} analytics`}
                        >
                            View Full Analytics <FaChartLine />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const AnalyticsView = ({
    cardsData,
    selectedMetric,
    setSelectedMetric,
    timeRange,
    trendData,
    getChartOptions,
    formatNumber,
    calculateChange,
    dashboardData
}) => {
    const currentMetric = cardsData.find(m => m.id === selectedMetric);
    const currentTrend = trendData[selectedMetric]?.[timeRange] || [];
    const change = calculateChange(currentTrend, selectedMetric, dashboardData);

    if (!currentMetric) {
        return (
            <div className="no-metric-selected">
                <p>Please select a metric to view analytics</p>
            </div>
        );
    }

    return (
        <div className="analytics-view">
            <div className="metrics-selector">
                {cardsData.map((card) => (
                    <button
                        key={card.id}
                        className={`metric-btn ${selectedMetric === card.id ? 'active' : ''}`}
                        onClick={() => setSelectedMetric(card.id)}
                        style={selectedMetric === card.id ? {
                            backgroundColor: card.color,
                            borderColor: card.color
                        } : {}}
                        aria-label={`View ${card.title} analytics`}
                    >
                        {card.title}
                    </button>
                ))}
            </div>

            <div className="metric-detail-container">
                <div className="metric-header">
                    <h2>{currentMetric.title}</h2>
                    <div className="metric-value-container">
                        <div className="metric-value">
                            {formatNumber(currentMetric.value)}
                        </div>
                        <div className={`change-indicator-lg ${change.direction}`}>
                            {change.direction === 'up' ? <FaChevronUp /> : <FaChevronDown />}
                            {change.value}%
                            <span>vs previous period</span>
                        </div>
                    </div>
                </div>

                <div className="chart-container">
                    <Suspense fallback={<div className="chart-loading">Loading chart...</div>}>
                        <Chart
                            options={getChartOptions(selectedMetric)}
                            series={[{ name: currentMetric.title, data: currentTrend }]}
                            type="area"
                            height="100%"
                        />
                    </Suspense>
                </div>

                <MetricStats
                    metric={currentMetric}
                    trend={currentTrend}
                    timeRange={timeRange}
                    formatNumber={formatNumber}
                />
            </div>
        </div>
    );
};

const MetricStats = ({ metric, trend, timeRange, formatNumber }) => {
    const stats = [
        { label: 'Current', value: metric.value },
        { label: `Min (${timeRange})`, value: Math.min(...trend) },
        { label: `Max (${timeRange})`, value: Math.max(...trend) },
        {
            label: `Avg (${timeRange})`,
            value: Math.round(trend.reduce((a, b) => a + b, 0) / Math.max(1, trend.length))
        },
    ];

    return (
        <div className="metric-details">
            <p>{metric.detail}</p>
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-label">{stat.label}</div>
                        <div className="stat-value">
                            {formatNumber(stat.value)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardCards;