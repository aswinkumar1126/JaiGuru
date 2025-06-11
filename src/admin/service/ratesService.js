//import axiosInstance from "../api/axiosInstance";

import axiosInstance from "../api/axiosInstance";
export const rateService = {

  
    // POST - Create a new rate
    createRate: (rateData) => {
        return axiosInstance.post(`/rates/create`, rateData);
    },

    // GET - Fetch all rates
    getRates: () => {
        return axiosInstance.get(`/rates/getRate`);
    },
    getRatesById:(id)=>{
        return axiosInstance.get('/rates/getRate/{id}');
    },
    // PUT - Update a rate by ID
    updateRate: (id, rateData) => {
        return axiosInstance.put(`/rates/update/${id}`, rateData);
    },

    // DELETE - Delete a rate by ID
    deleteRate: (id) => {
        return axiosInstance.delete(`/rates/delete/${id}`);
    },
};