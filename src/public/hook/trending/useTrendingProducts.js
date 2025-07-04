// src/hooks/useTrendingProducts.js
import { useQuery } from '@tanstack/react-query';
import TrendingProductService from '../../service/trendingService';

export const useTrendingProducts = () => {
    return useQuery({
        queryKey: ['trendingProducts'],
        queryFn: () => TrendingProductService.getTrendingProducts(),
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        retry: 2,
    });
};