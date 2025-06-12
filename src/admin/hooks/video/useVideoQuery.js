// hooks/video/useVideoQuery.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VideoService } from "../../service/videoService";

export const useVideosQuery = () => {
    return useQuery({
        queryKey: ["videos"],
        queryFn: VideoService.getVideos,
    });
};

export const useUploadVideoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ title, video }) => VideoService.uploadVideo(title, video),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["videos"] });
        },
    });
};

export const useUpdateVideoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, video }) => VideoService.updateVideo(id, video),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["videos"] });
        },
    });
};

export const useDeleteVideoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => VideoService.removeVideo(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["videos"] });
        },
    });
};