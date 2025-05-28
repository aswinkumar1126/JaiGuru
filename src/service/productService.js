import axiosInstance from '../api/axiosInstance';

const productService = {
    getImages: (sno) =>
        axiosInstance.get('/record-images', { params: { sno } }),

    uploadImages: (sno, images) => {
        const formData = new FormData();
        formData.append('sno', sno);
        images.forEach(img => formData.append('images', img)); // images is array of File
        // No need to set Content-Type manually here
        return axiosInstance.post('/upload-record-images', formData);
    },

    deleteImage: (sno, imagePath) =>
        axiosInstance.delete('/delete-image', { params: { sno, imagePath } }),

    updateImage: (sno, oldImagePath, newImage) => {
        const formData = new FormData();
        formData.append('sno', sno);
        formData.append('oldImagePath', oldImagePath);
        formData.append('newImage', newImage); // newImage is a single File
        return axiosInstance.put('/update-image', formData);
    },
};

export default productService;
