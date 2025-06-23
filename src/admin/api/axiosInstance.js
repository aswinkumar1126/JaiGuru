// src/api/axiosInstance.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// console.log(BASE_URL);

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// ✅ Dynamically attach token from localStorage on every request
axiosInstance.interceptors.request.use(
    (config) => {

        const authtoken = sessionStorage.getItem('auth_token'); // Moved inside so it's fresh
        if (authtoken) {
            config.headers.Authorization = `Bearer ${authtoken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;