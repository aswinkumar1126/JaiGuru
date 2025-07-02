
import publicUrl from '../api/publicUrl';

const TrendingProductService = {
  
    getTrendingProducts: async () => {
        const response = await publicUrl.get('/trending/top10');
        return response.data;
    },

  
};

export default TrendingProductService;