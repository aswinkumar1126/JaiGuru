import publicUrl from '../api/publicUrl'; // axios instance with Authorization header

// Add to favorites
export const addFavorite = async (itemSno) => {
  const response = await publicUrl.post(`/favorites/add?itemSno=${itemSno}`);
  return response.data;
};

// Remove from favorites
export const removeFavorite = async (itemSno) => {
  const response = await publicUrl.delete(`/favorites/remove/${itemSno}`);
  return response.data;
};

// Get favorites list
export const getFavorites = async () => {
  const response = await publicUrl.get('/favorites/list');
  return response.data;
};
