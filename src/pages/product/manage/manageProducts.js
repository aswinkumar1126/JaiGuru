import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../../../context/product/productContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'framer-motion';
import './ManageProduct.css';

const ManageProduct = ({
    sno = 'SFH24TA72883|001',
    baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://app.bmgjewellers.com'
}) => {
    const navigate = useNavigate();
    const { images, getImages, deleteImage, loading, error } = useProductContext();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const fetchAttempts = useRef(0);
    const maxRetries = 3;
    const printRef = useRef();

    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: '',
        costCentre: '',
        counter: 'ALL',
        itemId: '',
        tagNo: '',
        withImage: true,
        withoutImage: true,
        checkPhysicalImage: false,
    });

    const fetchImages = useCallback(async () => {
        if (fetchAttempts.current >= maxRetries) {
            console.error('Max retry attempts reached');
            return;
        }

        try {
            fetchAttempts.current += 1;
            await getImages(sno);
            fetchAttempts.current = 0; // Reset on success
        } catch (err) {
            console.error('Error fetching images:', err);
            if (fetchAttempts.current < maxRetries) {
                const delay = Math.min(1000 * fetchAttempts.current, 5000); // Exponential backoff with max 5s
                setTimeout(fetchImages, delay);
            }
        } finally {
            setIsInitialLoad(false);
        }
    }, [getImages, sno]);

    useEffect(() => {
        const controller = new AbortController();

        console.log('Initializing image fetch for sno:', sno);
        fetchImages();

        return () => {
            controller.abort();
        };
    }, [fetchImages, sno]);

    const handleFilterChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    const handleExport = useCallback(() => {
        if (!images || images.length === 0) {
            alert('No images to export.');
            return;
        }

        try {
            const data = images.map((img, index) => ({
                Index: index + 1,
                ImagePath: `${baseUrl}${img}`,
                ProductSno: sno,
            }));

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'ProductImages');
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(file, `product_images_${sno}_${new Date().toISOString().slice(0, 10)}.xlsx`);
        } catch (err) {
            console.error('Export failed:', err);
            alert('Failed to export data. Please try again.');
        }
    }, [images, sno, baseUrl]);

    const handlePrint = useCallback(() => {
        if (!images || images.length === 0) {
            alert('No images to print.');
            return;
        }

        if (!printRef.current) {
            alert('Print area is not available.');
            return;
        }

        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    }, [images]);
      
    const handleNew = useCallback(() => {
        navigate('/product/add');
    }, [navigate]);

    const handleExit = useCallback(() => {
        navigate('/');
    }, [navigate]);

    const handleDeleteImage = useCallback(async (imagePath) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            console.log('Deleting image:', imagePath);
            await deleteImage(sno, imagePath);
            // Only refetch if deletion was successful
            await fetchImages();
        } catch (err) {
            console.error('Error deleting image:', err);
            alert('Failed to delete image. Please try again.');
        }
    }, [deleteImage, sno, fetchImages]);

    const handleSearch = useCallback(() => {
        console.log('Applying filters:', filters);
        fetchImages(); // Refetch with current filters
    }, [filters, fetchImages]);

    return (
        <div className="manage-product-container">
            {/* Filters Section */}
            <motion.div
                className="filter-box"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                role="form"
                aria-label="Product filters"
            >
                <div className="filter-row">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="asOnDate"
                            onChange={handleFilterChange}
                            aria-label="Filter by date"
                        />
                        As on date
                    </label>
                    <input
                        type="date"
                        name="fromDate"
                        value={filters.fromDate}
                        onChange={handleFilterChange}
                        aria-label="Start date"
                        max={filters.toDate || new Date().toISOString().split('T')[0]}
                    />
                    <span className="filter-label">To</span>
                    <input
                        type="date"
                        name="toDate"
                        value={filters.toDate}
                        onChange={handleFilterChange}
                        aria-label="End date"
                        min={filters.fromDate}
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="filter-row">
                    <label htmlFor="costCentre">Cost Centre</label>
                    <select
                        id="costCentre"
                        name="costCentre"
                        value={filters.costCentre}
                        onChange={handleFilterChange}
                        aria-label="Select cost centre"
                    >
                        <option value="">Select</option>
                        <option value="Showroom1">Showroom1</option>
                    </select>

                    <label htmlFor="counter">Counter</label>
                    <select
                        id="counter"
                        name="counter"
                        value={filters.counter}
                        onChange={handleFilterChange}
                        aria-label="Select counter"
                    >
                        <option value="ALL">ALL</option>
                        <option value="Counter1">Counter1</option>
                    </select>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="checkPhysicalImage"
                            checked={filters.checkPhysicalImage}
                            onChange={handleFilterChange}
                            aria-label="Check physical image"
                        />
                        Check Physical Image
                    </label>

                    <button
                        className="btn"
                        disabled
                        aria-label="Bulk update (coming soon)"
                        title="Feature coming soon"
                    >
                        Bulk Update
                    </button>
                </div>

                <div className="filter-row">
                    <label htmlFor="itemId">Item ID</label>
                    <input
                        id="itemId"
                        type="text"
                        name="itemId"
                        value={filters.itemId}
                        onChange={handleFilterChange}
                        aria-label="Item ID"
                        placeholder="Enter item ID"
                    />

                    <label htmlFor="tagNo">Tag No</label>
                    <input
                        id="tagNo"
                        type="text"
                        name="tagNo"
                        value={filters.tagNo}
                        onChange={handleFilterChange}
                        aria-label="Tag number"
                        placeholder="Enter tag number"
                    />

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="withoutImage"
                            checked={filters.withoutImage}
                            onChange={handleFilterChange}
                            aria-label="Show products without images"
                        />
                        Without Image
                    </label>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="withImage"
                            checked={filters.withImage}
                            onChange={handleFilterChange}
                            aria-label="Show products with images"
                        />
                        With Image
                    </label>
                </div>

                <div className="filter-actions">
                    <button
                        className="btn"
                        onClick={handleSearch}
                        aria-label="Search products"
                        disabled={loading}
                    >
                        {loading ? '⏳ Searching...' : '🔍 Search'}
                    </button>
                    <button
                        className="btn"
                        onClick={handleNew}
                        aria-label="Add new product"
                    >
                        ✨ New [F3]
                    </button>
                    <button
                        className="btn red"
                        onClick={handleExit}
                        aria-label="Exit to home"
                    >
                        ❌ Exit [F12]
                    </button>
                    <button
                        className="btn"
                        onClick={handleExport}
                        aria-label="Export to Excel"
                        disabled={!images || images.length === 0}
                    >
                        📤 Export [X]
                    </button>
                    <button
                        className="btn"
                        onClick={handlePrint}
                        aria-label="Print (coming soon)"
                        title="Feature coming soon"
                    >
                        🖨️ Print
                    </button>
                </div>
            </motion.div>

            {/* Status Indicators */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        className="error-message"
                        role="alert"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        ⚠️ Error: {error.message || error.toString()}
                        <button
                            onClick={fetchImages}
                            className="btn small"
                            style={{ marginLeft: '1rem' }}
                        >
                            Retry
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Display Section */}
            <motion.div
                className="image-grid-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {isInitialLoad && loading ? (
                    <motion.div
                        className="loading-spinner"
                        aria-live="polite"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="spinner"></div>
                        <p>Loading product images...</p>
                    </motion.div>
                ) : images && images.length > 0 ? (
                    <>
                        <div className="results-count">
                            Showing {images.length} image{images.length !== 1 ? 's' : ''}
                        </div>
                            <div className="image-grid" ref={printRef} >
                            {images.map((img, index) => (
                                <motion.div
                                    key={`${img}-${index}`}
                                    className="image-card"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02 }}
                                    
                                >
                                    <div className="image-container" >
                                        <img
                                            src={`${baseUrl}${img}`}
                                            alt={`Product ${index + 1} for serial number ${sno}`}
                                            className="product-image"
                                            loading="lazy"
                                            onError={(e) => {
                                                console.error('Image failed to load:', `${baseUrl}${img}`);
                                                e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                                                e.currentTarget.alt = 'Image not available';
                                            }}
                                        />
                                    </div>
                                    <div className="image-actions">
                                        <button
                                            className="btn small red"
                                            onClick={() => handleDeleteImage(img)}
                                            aria-label={`Delete image ${index + 1}`}
                                            disabled={loading}
                                        >
                                            {loading ? 'Deleting...' : 'Delete'}
                                        </button>
                                        <a
                                            href={`${baseUrl}${img}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn small"
                                            aria-label={`View full size image ${index + 1}`}
                                        >
                                            View Full
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    <motion.div
                        className="no-images"
                        aria-live="polite"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <p>No images found for product {sno}.</p>
                        <button
                            onClick={fetchImages}
                            className="btn"
                            disabled={loading}
                        >
                            {loading ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default ManageProduct;