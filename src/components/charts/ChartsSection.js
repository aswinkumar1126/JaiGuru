import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, CartesianGrid, RadialBarChart, RadialBar, AreaChart, Area
} from 'recharts';
import { FiTrendingUp, FiPieChart, FiBarChart2, FiUsers, FiDollarSign, FiCalendar, FiShoppingBag } from 'react-icons/fi';
import './ChartsSection.css';

const ChartsSection = ({
    salesOverviewData = [],
    salesOverviewKeys = [],
    categoryDistributionData = [],
    categoryColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'],
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
}) => {
    // Chart icons mapping
    const chartIcons = {
        'Sales': <FiTrendingUp className="chart-icon-svg" />,
        'Categories': <FiPieChart className="chart-icon-svg" />,
        'Orders': <FiBarChart2 className="chart-icon-svg" />,
        'Feedback': <FiUsers className="chart-icon-svg" />,
        'Revenue': <FiDollarSign className="chart-icon-svg" />,
        'Monthly': <FiCalendar className="chart-icon-svg" />,
        'Users': <FiUsers className="chart-icon-svg" />,
        'Products': <FiShoppingBag className="chart-icon-svg" />
    };

    const charts = [
        {
            title: 'Sales',
            component: (
                <LineChart data={salesOverviewData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            padding: '8px',
                            fontSize: '12px'
                        }}
                    />
                    {salesOverviewKeys.map((key, idx) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={categoryColors[idx % categoryColors.length]}
                            strokeWidth={1.5}
                            dot={{ r: 2 }}
                            activeDot={{ r: 4 }}
                        />
                    ))}
                </LineChart>
            ),
        },
        {
            title: 'Categories',
            component: (
                <PieChart>
                    <Pie
                        data={categoryDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={40}
                        innerRadius={0}
                        paddingAngle={10}
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
                        labelLine={false}
                    >
                        {categoryDistributionData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={categoryColors[index % categoryColors.length]}
                                stroke="#fff"
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => [`${value}`, 'Value']}
                        contentStyle={{
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            padding: '8px',
                            fontSize: '12px',
                            
                        }}
                    />
                </PieChart>
            ),
        },
        {
            title: 'Orders',
            component: (
                <BarChart data={orderDistributionData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            padding: '8px',
                            fontSize: '12px'
                        }}
                    />
                    {orderDistributionKeys.map((key, idx) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={categoryColors[idx % categoryColors.length]}
                            radius={[3, 3, 0, 0]}
                        />
                    ))}
                </BarChart>
            ),
        },
        {
            title: 'Feedback',
            component: (
                <AreaChart data={customerFeedbackData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <defs>
                        {customerFeedbackKeys.map((key, idx) => (
                            <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={categoryColors[idx % categoryColors.length]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={categoryColors[idx % categoryColors.length]} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            padding: '8px',
                            fontSize: '12px'
                        }}
                    />
                    {customerFeedbackKeys.map((key, idx) => (
                        <Area
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={categoryColors[idx % categoryColors.length]}
                            fillOpacity={1}
                            fill={`url(#color${key})`}
                        />
                    ))}
                </AreaChart>
            ),
        },
        {
            title: 'Revenue',
            component: (
                <LineChart data={revenueTrendData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <Tooltip
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                        contentStyle={{
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            padding: '8px',
                            fontSize: '12px'
                        }}
                    />
                    {revenueTrendKeys.map((key, idx) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={categoryColors[idx % categoryColors.length]}
                            strokeWidth={1.5}
                            dot={{ r: 2 }}
                            activeDot={{ r: 4 }}
                        />
                    ))}
                </LineChart>
            ),
        },
        {
            title: 'Monthly',
            component: (
                <BarChart data={monthlyRevenueData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <Tooltip
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                        contentStyle={{
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            padding: '8px',
                            fontSize: '12px'
                        }}
                    />
                    {monthlyRevenueKeys.map((key, idx) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={categoryColors[idx % categoryColors.length]}
                            radius={[3, 3, 0, 0]}
                        />
                    ))}
                </BarChart>
            ),
        },
        {
            title: 'Users',
            component: (
                <LineChart data={userRegistrationData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            padding: '8px',
                            fontSize: '12px'
                        }}
                    />
                    {userRegistrationKeys.map((key, idx) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={categoryColors[idx % categoryColors.length]}
                            strokeWidth={1.5}
                            dot={{ r: 2 }}
                            activeDot={{ r: 4 }}
                        />
                    ))}
                </LineChart>
            ),
        },
        {
            title: 'Products',
            component: (
                <RadialBarChart
                    innerRadius="20%"
                    outerRadius="70%"
                    data={topProductsData}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                    <RadialBar
                        minAngle={15}
                        label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
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
                        formatter={(value) => [`${value} units`, 'Sales']}
                        contentStyle={{
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            padding: '8px',
                            fontSize: '12px'
                        }}
                    />
                </RadialBarChart>
            ),
        },
    ];

    return (
        <div className="charts-section-container">
            <div className="charts-section">
                {charts.map((chart, index) => (
                    <div key={chart.title} className="chart-box">
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChartsSection;