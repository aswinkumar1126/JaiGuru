import { useQuery } from "@tanstack/react-query";
import { getVideos } from "../../service/VideoService";

export const useVideos = () => {
    return useQuery({
        queryKey: ["videos"],
        queryFn: getVideos,
    });
};
