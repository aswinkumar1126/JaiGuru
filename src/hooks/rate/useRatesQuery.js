import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ratesService } from "../../service/ratesService";

// GET - Fetch all rates
export const useRatesQuery = () => {
    return useQuery({
        queryKey: ["rates"],
        queryFn: ratesService.getRates,
    });
};

// GET - Fetch a single rate by ID
export const useRateByIdQuery = (id) => {
    return useQuery({
        queryKey: ["rate", id],
        queryFn: () => ratesService.getRateById(id),
        enabled: !!id,
    });
};

// POST - Create a new rate
export const useCreateRateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ goldRate, silverRate, createdBy }) =>
            ratesService.createRate(goldRate, silverRate, createdBy),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rates"] });
        },
    });
};

// PUT - Update a rate
export const useUpdateRateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, goldRate, silverRate, createdBy }) =>
            ratesService.updateRate(id, goldRate, silverRate, createdBy),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rates"] });
        },
    });
};

// DELETE - Delete a rate
export const useDeleteRateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => ratesService.deleteRate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rates"] });
        },
    });
};