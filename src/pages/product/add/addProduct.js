import React, { useState, useEffect } from 'react';
import { useProductContext } from '../../../context/product/productContext';
import './AddProduct.css';

const AddProducts = () => {
    const { uploadImages, loading } = useProductContext();
    const [sno, setSno] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!selectedFiles.length) {
            setPreviews([]);
            return;
        }

        const objectUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviews(objectUrls);

        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [selectedFiles]);

    const handleFileChange = (e) => {
        setError('');
        setSuccess('');
        const files = Array.from(e.target.files);

        // Validate file types
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const invalidFiles = files.some(file => !validTypes.includes(file.type));

        if (invalidFiles) {
            setError('Only JPG, PNG, and WEBP images are allowed');
            return;
        }

        setSelectedFiles(files);
    };

    const handleUpload = async () => {
        setError('');
        setSuccess('');

        if (!sno.trim()) {
            setError('Please enter a valid product SNO');
            return;
        }

        if (selectedFiles.length < 3 || selectedFiles.length > 5) {
            setError('Please select between 3 to 5 images');
            return;
        }

        try {
            await uploadImages(sno, selectedFiles);
            setSuccess('Images uploaded successfully!');
            setSelectedFiles([]);
            setSno('');
        } catch (err) {
            setError(err.message || 'Failed to upload images. Please try again.');
        }
    };

    const removeImage = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
    };

    return (
        <div className="upload-container">
            <div className="upload-header">
                <h2 className="upload-title">Product Image Upload</h2>
                <p className="upload-subtitle">Add product images to the inventory system</p>
            </div>

            <div className="upload-form">
                <div className="form-group">
                    <label htmlFor="sno" className="form-label">Product S/N</label>
                    <input
                        id="sno"
                        type="text"
                        value={sno}
                        onChange={(e) => setSno(e.target.value)}
                        placeholder="Enter product serial number"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="fileInput" className="file-upload-label">
                        <div className="file-upload-box">
                            <svg className="upload-icon" viewBox="0 0 24 24">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            <span className="file-upload-text">
                                {selectedFiles.length > 0
                                    ? `${selectedFiles.length} file(s) selected`
                                    : 'Click to browse or drag & drop images'}
                            </span>
                            <span className="file-upload-hint">(3-5 images required)</span>
                        </div>
                        <input
                            id="fileInput"
                            type="file"
                            multiple
                            accept="image/jpeg, image/png, image/webp"
                            onChange={handleFileChange}
                            className="file-input"
                        />
                    </label>
                </div>

                {previews.length > 0 && (
                    <div className="preview-section">
                        <h3 className="preview-title">Image Previews</h3>
                        <div className="preview-grid">
                            {previews.map((src, index) => (
                                <div key={index} className="preview-item">
                                    <img
                                        src={src}
                                        alt={`Preview ${index + 1}`}
                                        className="preview-image"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="preview-remove"
                                        aria-label="Remove image"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="alert alert-error">
                        <svg className="alert-icon" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <svg className="alert-icon" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <span>{success}</span>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={loading || !sno || selectedFiles.length === 0}
                    className="submit-button"
                >
                    {loading ? (
                        <>
                            <svg className="spinner" viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                            </svg>
                            Uploading...
                        </>
                    ) : (
                        'Upload Product Images'
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddProducts;