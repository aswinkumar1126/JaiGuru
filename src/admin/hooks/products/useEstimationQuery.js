import { useQuery } from '@tanstack/react-query';
import productService from '../../service/productService';

const useEstimationQuery = () => {
    return useQuery({
        queryKey: ['estimation-list'],
        queryFn: productService.getEstimationList,
        staleTime: 5 * 60 * 1000, // optional: cache for 5 mins
    });
};

export default useEstimationQuery;
