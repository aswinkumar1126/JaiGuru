// src/service/authService.js
import axiosInstance from '../api/axiosInstance';

// ✅ Login user (Admin or Employee)
export const loginUser = async (credentials) => {
    const response = await axiosInstance.post(`/auth/user/login`, credentials);
    const { token, id, email, username, roles } = response.data;

    localStorage.setItem('token', token);

    return { token, user: { id, email, username, roles } }; // Return structured user object
};

// ✅ Fetch user profile using token
export const fetchUserProfile = async () => {
    const response = await axiosInstance.get(`/auth/user/profile`);
    return response.data;
};

// ✅ Logout helper (optional)
export const logoutUser = () => {
    localStorage.removeItem('token');
};
