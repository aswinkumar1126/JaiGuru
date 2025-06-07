// src/hooks/useUpdateUser.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserById } from '../../service/profileService';

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updatedData }) => updateUserById({ id, updatedData }),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        },
    });
};
