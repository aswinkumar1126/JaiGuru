import React, { useState, useEffect } from 'react';
import { useProductContext } from '../../../context/product/productContext';
import './AddProduct.css';

const AddProducts = () => {
    const { uploadImages, loading } = useProductContext(); // Fixed naming: uploadImages instead of uploadProductImages

    const [sno, setSno] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [feedback, setFeedback] = useState({ error: '', success: '' });

    useEffect(() => {
        if (!selectedFiles.length) {
            setPreviews([]);
            return;
        }

        const objectUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviews(objectUrls);

        return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
    }, [selectedFiles]);

    const handleFileChange = (e) => {
        setFeedback({ error: '', success: '' });

        const files = Array.from(e.target.files);
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (files.some(file => !validTypes.includes(file.type))) {
            setFeedback({ error: 'Only JPG, PNG, and WEBP formats are allowed.', success: '' });
            return;
        }

        setSelectedFiles(files);
    };

    const removeImage = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
    };

    const handleUpload = async () => {
        setFeedback({ error: '', success: '' });

        if (!sno.trim()) {
            setFeedback({ error: 'Please enter a valid product serial number.', success: '' });
            return;
        }

        if (selectedFiles.length < 3 || selectedFiles.length > 5) {
            setFeedback({ error: 'Please select between 3 to 5 images.', success: '' });
            return;
        }

        if (!description.trim()) {
            setFeedback({ error: 'Please enter a product description.', success: '' });
            return;
        }

        try {
            await uploadImages(sno, selectedFiles, description);
            setFeedback({ error: '', success: 'Images and description uploaded successfully!'});
            localStorage.setItem('sno',sno);
            setSno('');
            setDescription('');
            setSelectedFiles([]);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Upload failed. Please try again.';
            setFeedback({ error: errorMessage, success: '' });
        }
    };

    return (
        <div className="upload-container">
            <header className="upload-header">
                <h2 className="upload-title">Upload Product Images</h2>
                <p className="upload-subtitle">Attach images and description to a product entry</p>
            </header>

            <section className="upload-form">
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
                    <label htmlFor="description" className="form-label">Product Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write a brief description of the product..."
                        className="form-input"
                        rows="4"
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
                                    : 'Click or drag images here'}
                            </span>
                            <span className="file-upload-hint">(Select 3–5 JPG/PNG/WEBP files)</span>
                        </div>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/jpeg, image/png, image/webp"
                            multiple
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
                                    <img src={src} alt={`Preview ${index + 1}`} className="preview-image" />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="preview-remove"
                                        aria-label="Remove image"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {feedback.error && (
                    <div className="alert alert-error">
                        <svg className="alert-icon" viewBox="0 0 24 24">
                            <path d="M1 21h22L12 2 1 21zM12 16h-1v-1h1v1zm0-4h-1v-4h1v4z" />
                        </svg>
                        <span>{feedback.error}</span>
                    </div>
                )}

                {feedback.success && (
                    <div className="alert alert-success">
                        <svg className="alert-icon" viewBox="0 0 24 24">
                            <path d="M12 2a10 10 0 1 1-7.07 2.93A10 10 0 0 1 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
                        </svg>
                        <span>{feedback.success}</span>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    className="submit-button"
                    disabled={loading || !sno || selectedFiles.length === 0 || !description.trim()}
                >
                    {loading ? (
                        <>
                            <svg className="spinner" viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                            </svg>
                            Uploading...
                        </>
                    ) : (
                        'Upload Product & Description'
                    )}
                </button>
            </section>
        </div>
    );
};

export default AddProducts;