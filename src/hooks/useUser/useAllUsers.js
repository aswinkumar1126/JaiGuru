// src/hooks/useAllUsers.js
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../../service/profileService';

export const useAllUsers = () =>
    useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
    });
