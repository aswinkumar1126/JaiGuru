// src/services/dashboardService.js
import axiosInstance from "../api/axiosInstance";

export const getDashboardData = async () => {
    try {
        const [
            pendingOrdersRes,
            totalOrdersRes,
            deliveredOrdersRes,
            cancelledOrdersRes,
            shippedOrdersRes,
            userCountRes,
            categoryCount,
        ] = await Promise.all([
            axiosInstance.get(`/order/pending-orders`),
            axiosInstance.get(`/order/total-orders`),
            axiosInstance.get(`/order/delivered-orders`),
            axiosInstance.get(`/order/cancelled-orders`),
            axiosInstance.get(`/order/shipped-orders`),
            axiosInstance.get(`/auth/user/count`),
            axiosInstance.get('/getMetalCategoryCounts'),

        ]);

        return {
            pendingOrders: pendingOrdersRes.data,
            totalOrders: totalOrdersRes.data,
            deliveredOrders: deliveredOrdersRes.data,
            cancelledOrders: cancelledOrdersRes.data,
            shippedOrders: shippedOrdersRes.data,
            totalUsers: userCountRes.data,
            metalCategory: categoryCount.data
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};
