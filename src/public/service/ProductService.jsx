import PublicUrl from '../api/publicUrl';

export const getAllProducts = async (metalId = '', page = 1, pageSize = 50) => {
    const response = await PublicUrl.get('/getAllDetails', {
        params: {
            metalId,
            page,
            pageSize,
        },
    });
    return response.data;
};
export const getProductBySno = async (sno) => {
    const response = await PublicUrl.get('/getSnofilter', {
        params: { sno }
    });
    // Assuming API returns an array, return the first item
    return response.data[0];
};