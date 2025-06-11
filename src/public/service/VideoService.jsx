import PublicUrl from "../api/publicUrl";

export const getVideos = () =>  PublicUrl.get("/videos/list");
    
