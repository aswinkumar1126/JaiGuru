// src/hook/profile/useProfileQuery.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getProfile,
    getUserById,
    getAllUsers,
    updateUserById,
    deleteUserById,
} from '../../service/profileService';

// 🔹 Get current logged-in user profile
export const useCurrentProfile = () =>{
    const token = localStorage.getItem('user_token');
    return useQuery({
        queryKey: ['currentProfile'],
        queryFn: getProfile,
        enabled: !!token, // prevent call if token not available
        staleTime: 1000 * 60 * 5, // optional: cache for 5 mins
    });
}
// 🔹 Get user by ID (admin use)
export const useUserById = (id, enabled = true) =>
    useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserById(id),
        enabled: !!id && enabled ,
        staleTime: 1000 * 60 * 5,
    });

// 🔹 Get all users
export const useAllUsers = () =>
    useQuery({
        queryKey: ['allUsers'],
        queryFn: getAllUsers,
    });

// 🔹 Update user by ID
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUserById,
        onSuccess: () => {
            queryClient.invalidateQueries(['allUsers']); // or ['user', id] if needed
        },
    });
};

// 🔹 Delete user by ID
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUserById,
        onSuccess: () => {
            queryClient.invalidateQueries(['allUsers']);
        },
    });
};
