import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../../service/AddressService';

// ✅ Create Address
export const useCreateAddress = () => {
    return useMutation({
        mutationFn: addressService.createAddress
    });
};

// ✅ Get All Addresses for a Customer
export const useAddressesByCustomer = (customerId) => {
    return useQuery({
        queryKey: ['addresses', customerId],
        queryFn: () => addressService.getAddressesByCustomer(customerId),
        enabled: !!customerId, // prevent unnecessary call when customerId is undefined
    });
};

// ✅ Get Single Address by ID
export const useAddressById = (id) => {
    return useQuery({
        queryKey: ['address', id],
        queryFn: () => addressService.getAddressById(id),
        enabled: !!id, // avoid firing if id is null
    });
};

// ✅ Update Address
export const useUpdateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, address }) => addressService.updateAddress(id, address),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
    });
};

// ✅ Delete Address
export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => addressService.deleteAddress(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
    });
};
