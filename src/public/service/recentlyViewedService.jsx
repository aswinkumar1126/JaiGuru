import axios from 'axios';

const BASE_URL = 'https://app.bmgjewellers.com/api';

const PublicUrl = axios.create({
    baseURL: BASE_URL,
});

// ✅ Dynamically attach token from localStorage on every request
PublicUrl.interceptors.request.use(
    (config) => {

        const usertoken = localStorage.getItem('user_token'); // Moved inside so it's fresh
        if (usertoken) {
            config.headers.Authorization = `Bearer ${usertoken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default PublicUrl;

// Add item to recently viewed
export const addRecentlyViewed = async (itemSno) => {
    const response = await PublicUrl.post('/recently-viewed/add', null, {
        params: { itemSno },
    });
    return response.data;
};

// Get recently viewed items
export const getRecentlyViewedItems = async () => {
    const response = await PublicUrl.get('/recently-viewed/list');
    return response.data;
};
