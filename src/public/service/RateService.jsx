import PublicUrl from "../api/publicUrl";


// Get the latest gold and silver rates.

export const GetRates = async () => {
    try {
        const response = await PublicUrl.get('/product/todayrate');
        return response.data; // Return only the useful part
    } catch (error) {
        console.error("Error fetching rates:", error);
        throw error; // Rethrow so the caller can handle it
    }
};
