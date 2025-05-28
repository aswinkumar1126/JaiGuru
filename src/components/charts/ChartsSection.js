import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar,
} from 'recharts';
import './ChartsSection.css';

const ChartsSection = ({
    salesOverviewData = [],
    salesOverviewKeys = [],
    categoryDistributionData = [],
    categoryColors = [],
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
    topProductsColors = [],
}) => {
    const charts = [
        {
            title: 'Sales Overview',
            component: (
                <LineChart data={salesOverviewData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {salesOverviewKeys.map((key, idx) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={categoryColors[idx % categoryColors.length] || '#8884d8'}
                        />
                    ))}
                </LineChart>
            ),
        },
        {
            title: 'Category Distribution',
            component: (
                <PieChart>
                    <Pie
                        data={categoryDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {categoryDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            ),
        },
        {
            title: 'Order Distribution',
            component: (
                <BarChart data={orderDistributionData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {orderDistributionKeys.map((key, idx) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={categoryColors[idx % categoryColors.length] || '#8884d8'}
                        />
                    ))}
                </BarChart>
            ),
        },
        {
            title: 'Customer Feedback',
            component: (
                <BarChart data={customerFeedbackData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {customerFeedbackKeys.map((key, idx) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={categoryColors[idx % categoryColors.length] || '#8884d8'}
                        />
                    ))}
                </BarChart>
            ),
        },
        {
            title: 'Revenue Trend',
            component: (
                <LineChart data={revenueTrendData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {revenueTrendKeys.map((key, idx) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={categoryColors[idx % categoryColors.length] || '#8884d8'}
                        />
                    ))}
                </LineChart>
            ),
        },
        {
            title: 'Monthly Revenue',
            component: (
                <BarChart data={monthlyRevenueData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {monthlyRevenueKeys.map((key, idx) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={categoryColors[idx % categoryColors.length] || '#8884d8'}
                        />
                    ))}
                </BarChart>
            ),
        },
        {
            title: 'User Registration',
            component: (
                <LineChart data={userRegistrationData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {userRegistrationKeys.map((key, idx) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={categoryColors[idx % categoryColors.length] || '#8884d8'}
                        />
                    ))}
                </LineChart>
            ),
        },
        {
            title: 'Top Products',
            component: (
                <PieChart>
                    <Pie
                        data={topProductsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {topProductsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            ),
        },
    ];

    return (
        <div className="charts-section">
            {charts.map((chart, index) => (
                <div key={chart.title} className="chart-box" style={{ '--index': index }}>
                    <h4>{chart.title}</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        {chart.component}
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    );
};

export default ChartsSection;