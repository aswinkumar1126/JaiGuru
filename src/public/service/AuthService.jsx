import PublicUrl from "../api/publicUrl"; 

export const registerUser = async (userData) => {
    const response = await PublicUrl.post(`auth/user/register`, userData);
    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await PublicUrl.post(`auth/user/login`, loginData);
    return response.data;
};
