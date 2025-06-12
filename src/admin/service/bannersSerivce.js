import axiosInstance from "../api/axiosInstance";

export const bannersService = {
    getBanners: () => axiosInstance.get("/banner/list"),

    createBanner: (image, title) => {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);

        return axiosInstance.post("/banner/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    updateBanner: (image, id) => {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("id", id);

        return axiosInstance.put("/banner/update", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    deleteBanner: (id) => {
        return axiosInstance.delete("/banner/delete", {
            params: { id }, // Send id as query parameter
        });
    },
};