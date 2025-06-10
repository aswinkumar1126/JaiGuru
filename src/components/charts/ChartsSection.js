import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, CartesianGrid, RadialBarChart, RadialBar, AreaChart, Area,
    Legend, ScatterChart, Scatter, ZAxis, ComposedChart, ReferenceLine
} from 'recharts';
import {
    FiTrendingUp, FiPieChart, FiBarChart2, FiUsers, FiDollarSign,
    FiCalendar, FiShoppingBag, FiStar, FiActivity, FiAward, FiTarget
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import './ChartsSection.css';

const CustomTooltip = ({ active, payload, label, unit = '', isCurrency = false }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="tooltip-label">{label}</p>
                <div className="tooltip-items">
                    {payload.map((item, index) => (
                        <div key={index} className="tooltip-item">
                            <span className="tooltip-marker" style={{ backgroundColor: item.color }} />
                            <span className="tooltip-name">{item.name}:</span>
                            <span className="tooltip-value">
                                {isCurrency ? '$' : ''}{item.value.toLocaleString()}{unit}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, name
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10}
            fontWeight={500}
        >
            {name.length > 8 ? `${name.substring(0, 6)}...` : name}
        </text>
    );
};

const ChartsSection = ({
    salesOverviewData = [],
    salesOverviewKeys = [],
    categoryDistributionData = [],
    categoryColors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
    orderDistributionData = [],
    orderDistributionKeys = [],
    customerFeedbackData = [],
    customerFeedbackKeys = [],
    revenueTrendData = [],
    revenueTrendKeys = [],
    monthlyRevenueData = [],
    monthlyRevenueKeys = [],
    userRegistrationData = [],
    userRegistrationKeys = [],
    topProductsData = [],
    performanceMetrics = [],
    kpiData = []
}) => {
    // Chart icons mapping
    const chartIcons = {
        'Revenue Trends': <FiTrendingUp className="chart-icon-svg" />,
        'Product Mix': <FiPieChart className="chart-icon-svg" />,
        'Order Fulfillment': <FiBarChart2 className="chart-icon-svg" />,
        'Customer Insights': <FiUsers className="chart-icon-svg" />,
        'Financial Overview': <FiDollarSign className="chart-icon-svg" />,
        'Monthly Breakdown': <FiCalendar className="chart-icon-svg" />,
        'User Acquisition': <FiUsers className="chart-icon-svg" />,
        'Top Performers': <FiShoppingBag className="chart-icon-svg" />,
        'Performance Metrics': <FiActivity className="chart-icon-svg" />,
        'Sales Distribution': <FiStar className="chart-icon-svg" />,
        'Business KPIs': <FiTarget className="chart-icon-svg" />,
        'Achievements': <FiAward className="chart-icon-svg" />
    };

    const charts = [
        {
            title: 'Revenue Trends',
            component: (
                <ComposedChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                        content={<CustomTooltip isCurrency />}
                        cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                    />
                    <ReferenceLine y={0} stroke="#E5E7EB" />
                    {revenueTrendData.length > 0 && (
                        <ReferenceLine
                            y={revenueTrendData.reduce((a, b) => a + b.revenue, 0) / revenueTrendData.length}
                            stroke="#10B981"
                            strokeDasharray="3 3"
                            label="Avg"
                        />
                    )}
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        fill="url(#colorRevenue)"
                        stroke="#6366F1"
                        strokeWidth={2}
                        fillOpacity={0.2}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366F1"
                        strokeWidth={2}
                        dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                    />
                </ComposedChart>
            ),
        },
        {
            title: 'Product Mix',
            component: (
                <PieChart>
                    <Pie
                        data={categoryDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                        label={renderCustomizedLabel}
                        labelLine={false}
                    >
                        {categoryDistributionData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={categoryColors[index % categoryColors.length]}
                                stroke="#fff"
                                strokeWidth={1}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        content={<CustomTooltip />}
                        formatter={(value) => [`${value}`, 'Value']}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                        formatter={(value) => value.length > 12 ? `${value.substring(0, 10)}...` : value}
                    />
                </PieChart>
            ),
        },
        {
            title: 'Order Fulfillment',
            component: (
                <BarChart data={orderDistributionData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: '#F3F4F6' }}
                    />
                    {orderDistributionKeys.map((key, idx) => (
                        <Bar
                            key={key}
                            stackId="a"
                            dataKey={key}
                            fill={categoryColors[idx % categoryColors.length]}
                            radius={idx === orderDistributionKeys.length - 1 ? [4, 4, 0, 0] : 0}
                            barSize={14}
                        />
                    ))}
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                    />
                </BarChart>
            ),
        },
        {
            title: 'Business KPIs',
            component: (
                <div className="kpi-grid">
                    {kpiData.map((kpi, index) => (
                        <motion.div
                            key={kpi.name}
                            className="kpi-card"
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="kpi-icon" style={{ backgroundColor: `${categoryColors[index]}20` }}>
                                {kpi.icon || chartIcons[kpi.name] || <FiTarget />}
                            </div>
                            <div className="kpi-content">
                                <span className="kpi-name">{kpi.name}</span>
                                <span className="kpi-value">{kpi.value}</span>
                                <div className="kpi-trend">
                                    <span
                                        className={`trend-${kpi.trend.direction}`}
                                        style={{ color: kpi.trend.direction === 'up' ? '#10B981' : '#EF4444' }}
                                    >
                                        {kpi.trend.value}%
                                    </span>
                                    <span className="kpi-period">vs last period</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Customer Insights',
            component: (
                <AreaChart data={customerFeedbackData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <defs>
                        {customerFeedbackKeys.map((key, idx) => (
                            <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={categoryColors[idx % categoryColors.length]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={categoryColors[idx % categoryColors.length]} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                    />
                    {customerFeedbackKeys.map((key, idx) => (
                        <Area
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={categoryColors[idx % categoryColors.length]}
                            fill={`url(#color${key})`}
                            strokeWidth={2}
                            fillOpacity={1}
                        />
                    ))}
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                    />
                </AreaChart>
            ),
        },
        {
            title: 'Top Performers',
            component: (
                <RadialBarChart
                    innerRadius="20%"
                    outerRadius="80%"
                    data={topProductsData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    startAngle={90}
                    endAngle={-270}
                >
                    <RadialBar
                        minAngle={15}
                        label={{
                            position: 'insideStart',
                            fill: '#fff',
                            fontSize: 10,
                            formatter: (value) => `${value}%`
                        }}
                        background
                        clockWise
                        dataKey="value"
                    >
                        {topProductsData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={categoryColors[index % categoryColors.length]}
                            />
                        ))}
                    </RadialBar>
                    <Tooltip
                        content={<CustomTooltip unit="%" />}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                        formatter={(value) => value.length > 12 ? `${value.substring(0, 10)}...` : value}
                    />
                </RadialBarChart>
            ),
        }
    ];

    return (
        <div className="charts-section-container">
            <div className="charts-section">
                {charts.map((chart, index) => (
                    <motion.div
                        key={chart.title}
                        className={`chart-box ${chart.title === 'Business KPIs' ? 'kpi-container' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: chart.title === 'Business KPIs' ? 1 : 1.02 }}
                    >
                        <div className="chart-header">
                            <div className="chart-icon">
                                {chartIcons[chart.title]}
                            </div>
                            <h4 className="chart-title">{chart.title}</h4>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                {chart.component}
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ChartsSection;