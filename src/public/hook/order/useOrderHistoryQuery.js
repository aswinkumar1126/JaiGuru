import { useQuery } from '@tanstack/react-query';
import { getOrderHistory } from '../../service/orderService';

export const useOrderHistory = ({ page = 0, size = 10, status = '' }) => {
    return useQuery({
        queryKey: ['orderHistory', page, size, status],
        queryFn: () => getOrderHistory({ page, size, status }),
        staleTime: 1000, // 1 second, data is considered stale after 1s
        refetchOnMount: 'always', // Always refetch when component mounts
        refetchOnWindowFocus: true, // Refetch when window regains focus
        retry: 1, // Retry failed requests once
    });
};