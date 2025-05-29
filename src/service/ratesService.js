//import axiosInstance from "../api/axiosInstance";
import axios from "axios";
const baseUrl = "http://localhost:8081/api/v1";
export const rateService = {

  
    // POST - Create a new rate
    createRate: (rateData) => {
        return axios.post(`${baseUrl}/rate`, rateData);
    },

    // GET - Fetch all rates
    getRates: () => {
        return axios.get(`${baseUrl}/rates`);
    },

    // PUT - Update a rate by ID
    updateRate: (id, rateData) => {
        return axios.put(`${baseUrl}/rate/${id}`, rateData);
    },

    // DELETE - Delete a rate by ID
    deleteRate: (id) => {
        return axios.delete(`${baseUrl}/rate/${id}`);
    },
};