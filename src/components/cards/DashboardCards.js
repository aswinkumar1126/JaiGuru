import React, { useEffect, useState } from 'react';
import './DashboardCards.css';
import { getDashboardData } from '../../service/dashBoardService'; // Adjust the path as needed

const DashboardCards = () => {
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        reviews: 0, // Assuming you will implement this later
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDashboardData();
                setDashboardData({
                    totalUsers: data.totalUsers.totalUsers,
                    totalOrders: data.totalOrders.totalOrders,
                    pendingOrders: data.pendingOrders.PendingOrders,
                    deliveredOrders: data.deliveredOrders.DeliveredOrders,
                    cancelledOrders: data.cancelledOrders.CancelledOrders,
                    shippedOrders: data.shippedOrders.ShippedOrders,
                    reviews: 0, // Optional for now
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            }
        };

        fetchData();
    }, []);
    

    const cardsData = [
        { title: 'Total Users', value: dashboardData.totalUsers, gradient: 'linear-gradient(90deg, rgb(13, 192, 22),rgb(51, 218, 59))' },
        { title: 'Orders', value: dashboardData.totalOrders, gradient: 'linear-gradient(90deg, rgb(32, 132, 214),rgb(29, 128, 209))' },
        { title: 'Pending', value: dashboardData.pendingOrders, gradient: 'linear-gradient(90deg, rgb(212, 201, 38),rgb(224, 213, 55))' },
        { title: 'Delivered', value: dashboardData.deliveredOrders, gradient: 'linear-gradient(90deg, rgb(14, 212, 193),rgb(19, 202, 184))' },
        { title: 'Shipping', value: dashboardData.shippedOrders, gradient:'linear-gradient(90deg,rgb(28, 38, 177) , rgb(95, 104, 230)'},
        { title: 'Cancelled', value: dashboardData.cancelledOrders, gradient: 'linear-gradient(90deg, rgb(238, 26, 11),rgb(221, 31, 31))' },
        { title: 'Review', value: dashboardData.reviews, gradient: 'linear-gradient(90deg, rgb(200, 22, 231),rgb(169, 17, 196))' },
    ];

    return (
        <div className="cards-grid">
            {cardsData.map(({ title, value, gradient }, index) => (
                <div key={index} className="card" style={{ background: gradient }}>
                    <h3>{title}</h3>
                    <p>{value}</p>
                </div>
            ))}
        </div>
    );
};

export default DashboardCards;
