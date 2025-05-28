// src/context/ProductContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import productService from '../../service/productService';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const getImages = useCallback(async (sno) => {
        setLoading(true);
        try {
            const response = await productService.getImages(sno);
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadImages = async (sno, imageFiles) => {
        try {
            await productService.uploadImages(sno, imageFiles);
            await getImages(sno);
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

    const deleteImage = async (sno, imagePath) => {
        try {
            await productService.deleteImage(sno, imagePath);
            await getImages(sno);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const updateImage = async (sno, oldImagePath, newImage) => {
        try {
            await productService.updateImage(sno, oldImagePath, newImage);
            await getImages(sno);
        } catch (error) {
            console.error('Error updating image:', error);
        }
    };

    return (
        <ProductContext.Provider
            value={{
                images,
                loading,
                getImages,
                uploadImages,
                deleteImage,
                updateImage,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => useContext(ProductContext);
