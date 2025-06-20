// src/service/profileService.js
import axiosInstance from '../api/axiosInstance';

// Get current user's profile
export const getProfile = async () => {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
};

// Get user profile by ID (for admin use)
export const getUserById = async (id) => {
    const response = await axiosInstance.get(`/auth/user/getUserMasterDataById/${id}`);
    return response.data;
};

// Get all users (for admin table view)
export const getAllUsers = async () => {
    const response = await axiosInstance.get('/auth/user/all');
    return response.data;
};

// Update a user's profile (by ID)
export const updateUserById = async ({ id, updatedData }) => {
    const response = await axiosInstance.put(`/auth/user/update/${id}`, updatedData);
    return response.data;
};

// Delete user by ID
export const deleteUserById = async (id) => {
    const response = await axiosInstance.delete(`/auth/user/delete/${id}`);
    return response.data;
};