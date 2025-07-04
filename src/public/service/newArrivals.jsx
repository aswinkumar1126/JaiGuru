
import publicUrl from '../api/publicUrl';

const NewArrivalProductService = {

    getNewArrivals: async () => {
        try {
            const response = await publicUrl.get('/new-arrivals');
            return response.data;
        } catch (error) {
            console.error('Error fetching new arrivals:', error);
            throw error;
        }
      },

};

export default NewArrivalProductService;