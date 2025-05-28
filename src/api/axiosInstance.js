// src/api/axiosInstance.js
import axios from 'axios';

const BASE_URL = 'https://app.bmgjewellers.com/api/v1';

// Hardcoded token (replace with your actual token)
const HARDCODED_TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJjb250YWN0IjoiNzYwMzkwNTA1NiIsInVzZXJJZCI6NTksImVtYWlsIjoia2lydWJhamFkdTA3QGdtYWlsLmNvbSIsInN1YiI6IktpcnViYSIsImlhdCI6MTc0ODIzOTQ0MSwiZXhwIjoxNzUwODMxNDQxfQ.oY90axt6lVeGnP9Nwlkp8fIB-Y-Dmw64LLvAw6SmJ3WsOkpUyg8y9E-K-96-lulCmaaObywEPM9Q_RBL--1H0Q';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    // Do NOT set a default 'Content-Type' header here to allow axios
    // to automatically set it depending on the request (e.g., FormData)
});

// Attach the hardcoded token in Authorization header for every request
axiosInstance.interceptors.request.use(
    (config) => {
        if (HARDCODED_TOKEN) {
            config.headers.Authorization = `Bearer ${HARDCODED_TOKEN}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
