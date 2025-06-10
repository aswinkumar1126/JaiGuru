import React, { useEffect, useState } from 'react';
import ChartsSection from './ChartsSection';
import { getDashboardData } from '../../service/dashBoardService';

const ChartsSectionWrapper = () => {
    const [categoryDistributionData, setCategoryDistributionData] = useState([]);
    const dummyColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042','#ff0000'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dashboardData = await getDashboardData();
                const metalCategory = dashboardData.metalCategory;

                const transformed = Object.entries(metalCategory).map(([key, value]) => ({
                    name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(), // Format: GOLD -> Gold
                    value,
                }));

                setCategoryDistributionData(transformed);
            } catch (error) {
                console.error('Error loading dashboard data in wrapper:', error);
            }
        };

        fetchData();
    }, []);
    console.log("categoryDistributionData", categoryDistributionData)

    return (
        <ChartsSection
            salesOverviewData={[
                { month: 'Jan', online: 4000, offline: 2400 },
                { month: 'Feb', online: 3000, offline: 1398 },
                { month: 'Mar', online: 2000, offline: 9800 },
            ]}
            salesOverviewKeys={['online', 'offline']}

            categoryDistributionData={categoryDistributionData}
            categoryColors={dummyColors}

            orderDistributionData={[
                { month: 'Jan', placed: 120, delivered: 100 },
                { month: 'Feb', placed: 98, delivered: 85 },
                { month: 'Mar', placed: 86, delivered: 80 },
            ]}
            orderDistributionKeys={['placed', 'delivered']}

            customerFeedbackData={[
                { month: 'Jan', positive: 90, negative: 10 },
                { month: 'Feb', positive: 85, negative: 15 },
                { month: 'Mar', positive: 88, negative: 12 },
            ]}
            customerFeedbackKeys={['positive', 'negative']}

            revenueTrendData={[
                { month: 'Jan', revenue: 24000 },
                { month: 'Feb', revenue: 13980 },
                { month: 'Mar', revenue: 9800 },
            ]}
            revenueTrendKeys={['revenue']}

            monthlyRevenueData={[
                { month: 'Jan', gross: 32000, net: 24000 },
                { month: 'Feb', gross: 28000, net: 21000 },
                { month: 'Mar', gross: 26000, net: 20000 },
            ]}
            monthlyRevenueKeys={['gross', 'net']}

            userRegistrationData={[
                { month: 'Jan', registered: 500 },
                { month: 'Feb', registered: 400 },
                { month: 'Mar', registered: 350 },
            ]}
            userRegistrationKeys={['registered']}

            topProductsData={[
                { name: 'Gold Ring', value: 200 },
                { name: 'Silver Chain', value: 180 },
                { name: 'Diamond Earrings', value: 150 },
                { name: 'Platinum Bracelet', value: 120 },
            ]}
            topProductsColors={dummyColors}
        />
    );
};

export default ChartsSectionWrapper;
