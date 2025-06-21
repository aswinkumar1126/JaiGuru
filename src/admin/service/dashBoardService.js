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
           
        ] = await Promise.all([
            axiosInstance.get(`/order/pending-orders`),
            axiosInstance.get(`/order/all-ordersCount`),
            axiosInstance.get(`/order/delivered-orders`),
            axiosInstance.get(`/order/cancelled-orders`),
            axiosInstance.get(`/order/shipped-orders`),
            axiosInstance.get(`/auth/user/count`),
          

        ]);

        return {
            pendingOrders: pendingOrdersRes.data,
            totalOrders: totalOrdersRes.data,
            deliveredOrders: deliveredOrdersRes.data,
            cancelledOrders: cancelledOrdersRes.data,
            shippedOrders: shippedOrdersRes.data,
            totalUsers: userCountRes.data,
           
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};
