import React, { createContext, useContext, useState, useCallback } from 'react';
import productService from '../../service/productService';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getImages = useCallback(async (sno) => {
        setLoading(true);
        setError(null);
        try {
            const response = await productService.getImages(sno);
            setImages(response.images || []);
            setDescription(response.description || '');
            return response;
        } catch (err) {
            setError(err.message || 'Failed to fetch images');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadImages = useCallback(async (sno, imageFiles, description) => {
        setLoading(true);
        setError(null);
        try {
            await productService.uploadImages(sno, imageFiles, description);
            const updatedData = await getImages(sno);
            return updatedData;
        } catch (err) {
            setError(err.message || 'Failed to upload images');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getImages]);

    const deleteImage = useCallback(async (sno, imagePath) => {
        setLoading(true);
        setError(null);
        try {
            await productService.deleteImage(sno, imagePath);
            const updatedData = await getImages(sno);
            return updatedData;
        } catch (err) {
            setError(err.message || 'Failed to delete image');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getImages]);

    const updateImage = useCallback(async (sno, oldImagePath, newImageFile) => {
        setLoading(true);
        setError(null);
        try {
            await productService.updateImage(sno, oldImagePath, newImageFile);
            const updatedData = await getImages(sno);
            return updatedData;
        } catch (err) {
            setError(err.message || 'Failed to update image');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getImages]);

    const updateDescription = useCallback(async (sno, newDescription) => {
        setLoading(true);
        setError(null);
        try {
            await productService.updateDescription(sno, newDescription);
            const updatedData = await getImages(sno);
            return updatedData;
        } catch (err) {
            setError(err.message || 'Failed to update description');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getImages]);

    return (
        <ProductContext.Provider
            value={{
                images,
                description,
                loading,
                error,
                getImages,
                uploadImages,
                deleteImage,
                updateImage,
                updateDescription,
                setError // Allow manual error setting if needed
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => useContext(ProductContext);