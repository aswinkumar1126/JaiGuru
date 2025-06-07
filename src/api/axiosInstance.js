// src/api/axiosInstance.js
import axios from 'axios';

const BASE_URL = 'https://app.bmgjewellers.com/api/v1';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// ✅ Dynamically attach token from localStorage on every request
axiosInstance.interceptors.request.use(
    (config) => {
        
        const token = localStorage.getItem('token'); // Moved inside so it's fresh
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
