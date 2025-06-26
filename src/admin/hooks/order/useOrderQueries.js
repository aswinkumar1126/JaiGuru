import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../service/orderService';

export const useOrderQueries = () => {
    // 🔹 Fetch Paginated Pending Orders
    const usePendingOrders = (page = 0, size = 10) => {
        return useQuery({
            queryKey: ['pendingOrders', page, size],
            queryFn: () => orderService.getPaginatedPendingOrders(page, size).then(res => res.data),
            keepPreviousData: true,
        });
    };

    // 🔹 Fetch Paginated Delivered Orders
    const useDeliveredOrders = (page = 0, size = 10) => {
        return useQuery({
            queryKey: ['deliveredOrders', page, size],
            queryFn: () => orderService.getPaginatedDeliveredOrders(page, size).then(res => res.data),
            keepPreviousData: true,
        });
    };

    // 🔹 Fetch Paginated Cancelled Orders
    const useCancelledOrders = (page = 0, size = 10) => {
        return useQuery({
            queryKey: ['cancelledOrders', page, size],
            queryFn: () => orderService.getPaginatedCancelledOrders(page, size).then(res => res.data),
            keepPreviousData: true,
        });
    };

    // 🔹 Fetch Paginated Shipped Orders
    const useShippedOrders = (page = 0, size = 10) => {
        return useQuery({
            queryKey: ['shippedOrders', page, size],
            queryFn: () => orderService.getPaginatedShippedOrders(page, size).then(res => res.data),
            keepPreviousData: true,
        });
    };

    // 🔹 Fetch Total Revenue
    const useTotalRevenue = () => {
        return useQuery({
            queryKey: ['totalRevenue'],
            queryFn: () => orderService.getTotalRevenue().then(res => res.data),
        });
    };

    // 🔹 Fetch Today's Revenue
    const useTodayRevenue = () => {
        return useQuery({
            queryKey: ['todayRevenue'],
            queryFn: () => orderService.getTodayRevenue().then(res => res.data),
        });
    };

    // 🔹 Fetch Monthly Sales Report
    const useMonthlySalesReport = () => {
        return useQuery({
            queryKey: ['monthlySalesReport'],
            queryFn: () => orderService.getMonthlySalesReport().then(res => res.data),
        });
    };

    return {
        usePendingOrders,
        useDeliveredOrders,
        useCancelledOrders,
        useShippedOrders,
        useTotalRevenue,
        useTodayRevenue,
        useMonthlySalesReport,
    };
};