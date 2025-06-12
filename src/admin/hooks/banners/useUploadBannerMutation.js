import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bannersService } from "../../service/bannersSerivce";

export const useUploadBannerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ image, title }) =>
            bannersService.createBanner(image, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] }); // Refetch banners list
        },
    });
};

export const useUpdateBannerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ image, id }) =>
            bannersService.updateBanner(image, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] }); // Refetch banners list after update
        },
    });
};

export const useDeleteBannerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) =>
            bannersService.deleteBanner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] }); // Refetch banners list after deletion
        },
    });
};
