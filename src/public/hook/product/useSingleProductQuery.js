// src/hook/product/useSingleProductQuery.js
import { useQuery } from '@tanstack/react-query';
import { getProductBySno } from '../../service/ProductService';

export const useSingleProductQuery = (sno) => {
    return useQuery({
        queryKey: ['singleProduct', sno],
        queryFn: () => getProductBySno((sno)),
        enabled: !!sno,
    });
};
