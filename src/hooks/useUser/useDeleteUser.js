// src/hooks/useDeleteUser.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserById } from '../../service/profileService';

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => deleteUserById(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        },
    });
};
