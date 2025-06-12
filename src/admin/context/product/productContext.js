import React, { createContext, useContext, useState, useCallback } from 'react';
import productService from '../../service/productService';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const getImages = useCallback(async (sno) => {
        setLoading(true);
        try {
            const response = await productService.getImages(sno);
            setImages(response.data.images || []); // Store image paths
            setDescription(response.data.description || ''); // Store description
        } catch (error) {
            console.error('Error fetching images:', error);
            setImages([]);
            setDescription('');
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadImages = async (sno, imageFiles, description) => {
        try {
            await productService.uploadImages(sno, imageFiles, description);
            await getImages(sno); // Refresh images and description
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error; // Let the caller handle the error
        }
    };

    const deleteImage = async (sno, imagePath) => {
        try {
            await productService.deleteImage(sno, imagePath);
            await getImages(sno); // Refresh images and description
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    };

    const updateImage = async (sno, oldImagePath, newImage) => {
        try {
            await productService.updateImage(sno, oldImagePath, newImage);
            await getImages(sno); // Refresh images and description
        } catch (error) {
            console.error('Error updating image:', error);
            throw error;
        }
    };

    const updateDescription = async (sno, newDescription) => {
        try {
            await productService.updateDescription(sno, newDescription);
            await getImages(sno); // Refresh description (and images)
        } catch (error) {
            console.error('Error updating description:', error);
            throw error;
        }
    };

    return (
        <ProductContext.Provider
            value={{
                images,
                description, // Provide description
                loading,
                getImages,
                uploadImages,
                deleteImage,
                updateImage,
                updateDescription // Provide updateDescription function
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => useContext(ProductContext);