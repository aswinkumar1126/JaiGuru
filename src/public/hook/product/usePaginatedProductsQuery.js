import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../service/ProductService";

export const usePaginatedProductsQuery = (metalId, page, pageSize = 50) => {
    return useQuery({
        queryKey: ["paginatedProducts", metalId, page],
        queryFn: () => getAllProducts(metalId, page, pageSize),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });
};
