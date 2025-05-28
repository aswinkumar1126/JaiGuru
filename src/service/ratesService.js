import axiosInstance from "../api/axiosInstance";

export const ratesService = {
    // POST - Create a new rate
    createRate: (goldRate, silverRate, createdBy) => {
        const formData = new FormData();
        formData.append("goldRate", goldRate);
        formData.append("silverRate", silverRate);
        formData.append("createdBy", createdBy);
        return axiosInstance.post("/rates/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    // GET - Fetch all rates
    getRates: () => {
        return axiosInstance.get("/rates/getRate");
    },

    // GET - Fetch a single rate by ID
    getRateById: (id) => {
        return axiosInstance.get(`/rates/getRate/${id}`);
    },

    // PUT - Update a rate by ID
    updateRate: (id, goldRate, silverRate, createdBy) => {
        const formData = new FormData();
        formData.append("goldRate", goldRate);
        formData.append("silverRate", silverRate);
        formData.append("createdBy", createdBy);
        return axiosInstance.put(`/rates/updateRate/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    // DELETE - Delete a rate by ID
    deleteRate: (id) => {
        return axiosInstance.delete(`/rates/delete/${id}`);
    },
};