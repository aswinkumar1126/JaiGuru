import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getFavorites,
    addFavorite,
    removeFavorite,
} from '../../service/favoriteService';

// ✅ Get Favorites
export const useFavorites = () => {
    return useQuery({
        queryKey: ['favorites'],
        queryFn: getFavorites,
    });
};

// ✅ Add Favorite
export const useAddFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addFavorite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
    });
};

// ✅ Remove Favorite
export const useRemoveFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeFavorite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
    });
};
