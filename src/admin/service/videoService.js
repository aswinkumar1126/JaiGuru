import axiosInstance from "../api/axiosInstance";

export const VideoService = {
    getVideos: () => {
        return axiosInstance.get("/videos/list");
    },

    uploadVideo: (title, video) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("video", video);
        return axiosInstance.post("/videos/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    updateVideo: (id, video) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("video", video);
        return axiosInstance.put("/videos/update", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    removeVideo: (id) => {
        return axiosInstance.delete("/videos/delete", {
            params: { id },
        });
    },
};