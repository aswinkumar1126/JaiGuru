import { useQuery } from '@tanstack/react-query';
import productService from '../../service/productService';

// Data fetcher function
const fetchImages = async (sno) => {
    const response = await productService.getImages(sno);
    return response.data;
};

const useProductQuery = (sno) => {
    return useQuery({
        queryKey: ['record-images', sno],
        queryFn: () => fetchImages(sno),
        enabled: !!sno,
        staleTime: 5 * 60 * 1000, // optional: 5 minutes
    });
};

export default useProductQuery;
