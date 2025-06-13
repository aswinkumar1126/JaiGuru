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

    const data = response.data;

    if (Array.isArray(data) && data.length > 0) {
        return data[0]; // ✅ return single product
    }

    throw new Error(`No product found for SNO: ${sno}`);
};
