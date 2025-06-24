import { orderService } from "../../service/orderService";
import { useQuery } from "@tanstack/react-query";

export const useAllOrders = (page, size) => {
    return useQuery({
        queryKey: ['getAllOrders', page, size], // include args for caching
        queryFn: () => orderService.getAllOrders(page, size),
        enabled: page !== undefined && size !== undefined,
    });
};
