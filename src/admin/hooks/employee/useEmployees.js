import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, deleteUserById } from '../../service/profileService';

export const useEmployees = () => {
    const queryClient = useQueryClient();

    const {
        data: employees = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['employees'],
        queryFn: getAllUsers,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUserById,
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
        },
        onError: (error) => {
            console.error('Delete error:', error);
        },
    });

    return {
        employees,
        isLoading,
        isError,
        refetch,
        deleteEmployee: deleteMutation.mutate,
        isDeleting: deleteMutation.isLoading,
    };
};