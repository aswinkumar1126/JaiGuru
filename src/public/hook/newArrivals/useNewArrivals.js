// src/hooks/useNewArrivals.js
import { useQuery } from '@tanstack/react-query';
import NewArrivalProductService from '../../service/newArrivals';

export const useNewArrivals = () => {
    return useQuery({
        queryKey: ['newArrivals'],
        queryFn: () => NewArrivalProductService.getNewArrivals(),
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        retry: 2,
    });
};