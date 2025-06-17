import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../../service/AuthService';

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
    });
};
