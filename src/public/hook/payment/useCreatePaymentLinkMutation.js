// src/hook/payment/useCreatePaymentLinkMutation.js
import { useMutation } from '@tanstack/react-query';
import { createPaymentLink } from '../../service/paymentService';

export const useCreatePaymentLinkMutation = () => {
    return useMutation({
        mutationFn: ({ orderId, token }) => createPaymentLink({ orderId, token }),
    });
};
