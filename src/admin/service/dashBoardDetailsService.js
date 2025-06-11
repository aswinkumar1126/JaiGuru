import axios from "axios";
import axiosInstance from "../api/axiosInstance";

const dashBoardDetailsService = {
    async getAllUsers() {
        try {
            const response = await axios.get('http://localhost:8082/api/v1/auth/user/getAllUserMasterData');
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }
};

export default dashBoardDetailsService;