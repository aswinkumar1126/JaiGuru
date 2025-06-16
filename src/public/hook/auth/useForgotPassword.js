import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../../service/AuthService';

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
    });
};
