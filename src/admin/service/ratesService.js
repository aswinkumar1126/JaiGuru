import qs from "qs";
import axiosInstance from "../api/axiosInstance";
export const rateService = {

  
    // POST - Create a new rate
    createRate: (rateData) => {
        return axiosInstance.post('/rates/create', qs.stringify(rateData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    },

    // GET - Fetch all rates
    getRates: () => {
        return axiosInstance.get(`/rates/getRate`);
    },
    getRatesById:(id)=>{
        return axiosInstance.get(`/rates/getRate/${id}`);
    },
    // PUT - Update a rate by ID
    updateRate: (id, rateData) => {
        return axiosInstance.put(`/rates/updateRate/${id}`, qs.stringify(rateData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },});
    },

    // DELETE - Delete a rate by ID
    deleteRate: (id) => {
        return axiosInstance.delete(`/rates/delete/${id}`);
    },
};