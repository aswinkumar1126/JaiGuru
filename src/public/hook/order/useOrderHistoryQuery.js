// src/hooks/order/useOrderHistoryQuery.js
import { useQuery } from '@tanstack/react-query';
import { getOrderHistory } from '../../service/orderService';

export const useOrderHistory = ({ page = 0, size = 10, status = '' }) => {
    return useQuery({
        queryKey: ['orderHistory', page, size, status],
        queryFn: () => getOrderHistory({ page, size, status }),
    });
};
 