import { GetRates } from "../../service/RateService";
import { useQuery } from '@tanstack/react-query';

export const useRatesQuery = () => {
    return useQuery({
        queryKey: ['todayRate'],
        queryFn: GetRates,
        staleTime: 1000 * 60 * 2, // 2 minutes
        retry: 1,
    });
}
