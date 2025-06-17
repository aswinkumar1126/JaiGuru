import PublicUrl from "../api/publicUrl";

// Add item to recently viewed
export const addRecentlyViewed = async (itemSno) => {
    const token = localStorage.getItem("user_token");
    const response = await PublicUrl.post(
        '/recently-viewed/add',
        null,
        {
            params: { itemSno },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
  
// Get recently viewed items
export const getRecentlyViewedItems = async () => {
    const token = localStorage.getItem("user_token");
    const response = await PublicUrl.get('/recently-viewed/list',{
       headers:{
        Authorization:`Bearer ${token}`,
       },
    });
    return response.data;
};
