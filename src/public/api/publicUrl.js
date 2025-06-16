// src/api/axiosInstance.js
import axios from 'axios';

const BASE_URL = 'https://app.bmgjewellers.com/api/v1';

const PublicUrl = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
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
