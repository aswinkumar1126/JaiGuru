import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecentlyViewedItems, addRecentlyViewed } from '../../service/recentlyViewedService';

export const useRecentlyViewed = () => {
    const queryClient = useQueryClient();

    // GET - Fetch recently viewed
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['recentlyViewed'],
        queryFn: getRecentlyViewedItems,
        staleTime: 1000 * 60 * 5,
    });

    // POST - Add item to recently viewed
    const { mutate: addItem, isPending: isAdding } = useMutation({
        mutationFn: addRecentlyViewed,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recentlyViewed'] }); // Refetch after adding
        },
    });

    return {
        data,
        isLoading,
        isError,
        error,
        addItem,       // 👈 To use: addItem(itemSno)
        isAdding,
    };
};
