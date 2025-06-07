// src/hooks/useUserById.js
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../../service/profileService';

export const useUserById = (id) =>
    useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserById(id),
        enabled: !!id,
    });
