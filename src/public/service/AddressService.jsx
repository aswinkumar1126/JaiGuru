import PublicUrl from "../api/publicUrl";


const createAddress = async (addressData) => {
    const response = await PublicUrl.post('/addresses/create', addressData);
    return response.data;
};

const getAddressesByCustomer = async (customerId) => {
    const response = await PublicUrl.get(`/addresses/customer/${customerId}`);
    return response.data;
};

const getAddressById = async (id) => {
    const response = await PublicUrl.get(`/addresses/${id}`);
    return response.data;
};

const updateAddress = async (id, addressData) => {
    const response = await PublicUrl.put(`/addresses/update/${id}`, addressData);
    return response.data;
};

const deleteAddress = async (id) => {
    const response = await PublicUrl.delete(`/addresses/delete/${id}`);
    return response.data;
};

export const addressService = {
    createAddress,
    getAddressesByCustomer,
    getAddressById,
    updateAddress,
    deleteAddress,
};
