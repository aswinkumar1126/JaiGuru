import { useQuery } from "@tanstack/react-query";
import * as BannerService from "../../service/BannerService";

export const useBanners = () =>
    useQuery({
        queryKey: ["banners"],
        queryFn: BannerService.getAllSliderImages,
    });

export const useBannerById = (id, enabled = true) =>
    useQuery({
        queryKey: ["banner", id],
        queryFn: () => BannerService.getSliderImageById(id),
        enabled: !!id && enabled,
        staleTime: 1000 * 60 * 5,
    });
