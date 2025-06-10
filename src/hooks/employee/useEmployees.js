// src/hooks/useEmployees.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, deleteUserById } from '../../service/profileService';
import { message } from 'antd';

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
            message.success('Employee deleted successfully!');
            queryClient.invalidateQueries(['employees']);
        },
        onError: (error) => {
            console.error('Delete error:', error);
            message.error('Failed to delete employee.');
        }
    });

    return {
        employees,
        isLoading,
        isError,
        refetch,
        deleteEmployee: deleteMutation.mutate,
    };
};
