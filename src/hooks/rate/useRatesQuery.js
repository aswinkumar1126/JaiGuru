import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rateService } from "../../service/ratesService";

// GET - Fetch all rates
export const useRatesQuery = () => {
    return useQuery({
        queryKey: ["rates"],
        queryFn: rateService.getRates,
    });
};

// POST - Create a new rate
export const useCreateRateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (rateData) => rateService.createRate(rateData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rates"] });
        },
    });
};

// PUT - Update a rate
export const useUpdateRateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, rateData }) => rateService.updateRate(id, rateData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rates"] });
        },
    });
};

// DELETE - Delete a rate
export const useDeleteRateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => rateService.deleteRate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rates"] });
        },
    });
};