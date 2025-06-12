// 📁 src/pages/admin/AddBanner.js
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadBannerMutation } from "../../../hooks/banners/useUploadBannerMutation";
import './AddBanner.css';

const AddBanner = () => {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const { mutate, isPending, isSuccess } = useUploadBannerMutation();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validate file type
        if (!selectedFile.type.match('image.*')) {
            setError('Please select an image file (JPEG, PNG, etc.)');
            return;
        }

        // Validate file size (max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size should be less than 5MB');
            return;
        }

        setImage(selectedFile);
        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!image) {
            setError('Please select an image file');
            return;
        }

        if (!title) {
            setError('Please enter a title for your banner');
            return;
        }

        mutate({ image, title}, {
            onSuccess: () => {
                // Reset form on success
                setImage(null);
                setTitle("");
                setPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            },
            onError: (err) => {
                setError(err.message || 'Failed to upload banner');
            }
        });
    };

    return (
        <motion.div 
            className="banner-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h2 className="banner-heading">Add New Banner</h2>
            
            <motion.form 
                onSubmit={handleSubmit}
                className="banner-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <div className="form-group">
                    <label htmlFor="banner-upload" className="file-upload-label">
                        <motion.div 
                            className="file-upload-box"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {preview ? (
                                <div className="image-preview">
                                    <img 
                                        src={preview} 
                                        alt="Preview" 
                                        className="preview-image"
                                    />
                                    <div className="change-image">Change Image</div>
                                </div>
                            ) : (
                                <>
                                    <svg className="upload-icon" viewBox="0 0 24 24">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                    </svg>
                                    <span>Select Banner Image</span>
                                </>
                            )}
                        </motion.div>
                        <input
                            id="banner-upload"
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="file-input"
                        />
                    </label>
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-input"
                        aria-label="Serial Number"
                    />
                </div>

                {/* <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={isBanner}
                            onChange={(e) => setIsBanner(e.target.checked)}
                            className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-text">Is Banner</span>
                    </label>
                </div> */}

                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="error-message"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isSuccess && (
                        <motion.div
                            className="success-message"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            Banner uploaded successfully!
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    type="submit"
                    className="submit-button"
                    disabled={isPending || !image || !title}
                    whileHover={{ scale: isPending ? 1 : 1.03 }}
                    whileTap={{ scale: isPending ? 1 : 0.98 }}
                >
                    {isPending ? (
                        <>
                            <span className="spinner"></span>
                            Uploading...
                        </>
                    ) : (
                        'Upload Banner'
                    )}
                </motion.button>
            </motion.form>
        </motion.div>
    );
};

export default AddBanner;