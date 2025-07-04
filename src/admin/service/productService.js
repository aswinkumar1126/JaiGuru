import axiosInstance from '../api/axiosInstance';

const productService = {
    getImages: async (sno) => {
        try {
            const response = await axiosInstance.get('/product_image/record-images', {
                params: { sno }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching images:', error);
            throw error.response?.data || error;
        }
    },

    uploadImages: async (sno, imageFiles, description) => {
        try {
            const formData = new FormData();
            formData.append('sno', sno);
            formData.append('description', description);

            // Append each image file
            imageFiles.forEach((file) => {
                formData.append('images', file);
            });

            const response = await axiosInstance.post(
                '/product_image/upload-record-images',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error.response?.data || error;
        }
    },

    deleteImage: async (sno, imagePath) => {
        try {
            const response = await axiosInstance.delete('/product_image/delete-image', {
                params: { sno, imagePath }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error.response?.data || error;
        }
    },

    updateImage: async (sno, oldImagePath, newImageFile) => {
        try {
            const formData = new FormData();
            formData.append('sno', sno);
            formData.append('oldImagePath', oldImagePath);
            formData.append('newImage', newImageFile);

            const response = await axiosInstance.put(
                '/product_image/update-image',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating image:', error);
            throw error.response?.data || error;
        }
    },

    updateDescription: async (sno, newDescription) => {
        try {
            const response = await axiosInstance.put(
                '/product_image/update-description',
                null,
                {
                    params: { sno, newDescription }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating description:', error);
            throw error.response?.data || error;
        }
    },
    getEstimationList: async () => {
        try {
            const response = await axiosInstance.get('/product/list');
            return response.data;
        } catch (error) {
            console.error('Error fetching estimation list:', error);
            throw error.response?.data || error;
        }
    }
};

export default productService;