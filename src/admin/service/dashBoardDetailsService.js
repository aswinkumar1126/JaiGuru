import axios from "axios";
import axiosInstance from "../api/axiosInstance";

const dashBoardDetailsService = {
    async getAllUsers() {
        try {
            const response = await axiosInstance.get('/auth/user/getAllUserMasterData');
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }
};

export default dashBoardDetailsService;