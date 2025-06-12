import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../../service/ProductService';

export const useProductsQuery = (metalId = '', page = 1, pageSize = 50) => {
    return useQuery({
        queryKey: ['products', metalId, page, pageSize],
        queryFn: () => getAllProducts(metalId, page, pageSize),
        staleTime: 5 * 60 * 1000, // optional: cache for 5 mins
    });
};
