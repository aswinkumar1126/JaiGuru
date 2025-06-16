// src/hook/payment/useVerifyPaymentQuery.js
import { useQuery } from '@tanstack/react-query';
import { verifyPayment } from '../../service/paymentService';

export const useVerifyPaymentQuery = (orderId) => {
    return useQuery({
        queryKey: ['verifyPayment', orderId],
        queryFn: () => verifyPayment(orderId),
        enabled: !!orderId,
    });
};
