import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../../../context/product/productContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './ManageProduct.css';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const ManageProduct = ({
    sno = 'fhsfh2535741',
    baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://app.bmgjewellers.com'
}) => {
    const navigate = useNavigate();
    const {
        images,
        description,
        getImages,
        deleteImage,
        updateDescription,
        loading
    } = useProductContext();

    // State management
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [newDescription, setNewDescription] = useState(description || '');
    const [feedback, setFeedback] = useState({ error: '', success: '' });
    const [editMode, setEditMode] = useState(false);
    const [imageEditMode, setImageEditMode] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const fetchAttempts = useRef(0);
    const printRef = useRef();

    // Filters state
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

    const [selectedImages, setSelectedImages] = useState([]);

    // Handle window resize for responsive design
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Memoized derived values
    const hasImages = useMemo(() => images && images.length > 0, [images]);
    const allSelected = useMemo(
        () => hasImages && selectedImages.length === images.length,
        [hasImages, selectedImages, images]
    );

    // Fetch images with retry logic
    const fetchImages = useCallback(async () => {
        if (fetchAttempts.current >= MAX_RETRIES) {
            setFeedback({
                error: 'Maximum retry attempts reached. Please check your connection.',
                success: ''
            });
            return;
        }

        try {
            fetchAttempts.current += 1;
            await getImages(sno);
            fetchAttempts.current = 0;
            setNewDescription(description);
            setSelectedImages([]);
        } catch (err) {
            console.error('Error fetching images:', err);
            if (fetchAttempts.current < MAX_RETRIES) {
                const delay = Math.min(RETRY_DELAY_MS * fetchAttempts.current, 5000);
                setTimeout(fetchImages, delay);
            } else {
                setFeedback({
                    error: 'Failed to load product data. Please try again later.',
                    success: ''
                });
            }
        } finally {
            setIsInitialLoad(false);
        }
    }, [getImages, sno, description]);

    // Initial data fetch
    useEffect(() => {
        const controller = new AbortController();
        fetchImages();
        return () => controller.abort();
    }, [fetchImages, sno]);

    // Sync description when context updates
    useEffect(() => {
        setNewDescription(description);
    }, [description]);

    // Filter handlers
    const handleFilterChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    // Data export functions
    const handleExportExcel = useCallback(() => {
        if (!hasImages) {
            alert('No images available to export.');
            return;
        }

        try {
            const data = images.map((img, index) => ({
                'S.No': index + 1,
                'Serial Number': sno,
                'Description': description || 'No description available',
                'Image URL': `${baseUrl}${img}`,
                'Image Path': img
            }));

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'ProductImages');
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            saveAs(
                file,
                `Product_Images_${sno}_${new Date().toISOString().slice(0, 10)}.xlsx`
            );
        } catch (err) {
            console.error('Export failed:', err);
            setFeedback({
                error: 'Failed to generate Excel file. Please try again.',
                success: ''
            });
        }
    }, [images, sno, baseUrl, description, hasImages]);

    const handleExportPDF = useCallback(() => {
        if (!hasImages) {
            alert('No images available to export.');
            return;
        }

        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm'
            });

            // Add title and metadata
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text(`Product Images Report - ${sno}`, 15, 15);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(`Description: ${description || 'No description available'}`, 15, 22);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 28);

            // Prepare table data
            const tableData = images.map((img, index) => [
                index + 1,
                { content: `Image ${index + 1}`, styles: { fontStyle: 'bold' } },
                img,
                `${baseUrl}${img}`
            ]);

            // Generate table
            doc.autoTable({
                startY: 35,
                head: [['S.No', 'Reference', 'Image Path', 'Full URL']],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                    overflow: 'linebreak'
                },
                margin: { left: 15 },
                columnStyles: {
                    0: { cellWidth: 10 },
                    1: { cellWidth: 20 },
                    2: { cellWidth: 60 },
                    3: { cellWidth: 80 }
                }
            });

            doc.save(`Product_Images_${sno}_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error('PDF export failed:', err);
            setFeedback({
                error: 'Failed to generate PDF. Please try again.',
                success: ''
            });
        }
    }, [images, sno, baseUrl, description, hasImages]);

    const handlePrint = useCallback(() => {
        if (!hasImages) {
            alert('No images available to print.');
            return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Product Images - ${sno}</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 1cm;
                        color: #333;
                    }
                    .print-header { 
                        margin-bottom: 20px;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 15px;
                    }
                    .print-header h2 {
                        color: #2c3e50;
                        margin-bottom: 5px;
                    }
                    .print-table { 
                        width: 100%; 
                        border-collapse: collapse;
                        margin-top: 15px;
                        font-size: 12px;
                    }
                    .print-table th, .print-table td { 
                        border: 1px solid #ddd; 
                        padding: 8px; 
                        text-align: left; 
                    }
                    .print-table th { 
                        background-color: #f5f5f5;
                        font-weight: bold;
                    }
                    .print-image { 
                        max-width: 150px; 
                        max-height: 150px;
                        display: block;
                        margin: 0 auto;
                    }
                    @page {
                        size: A4 landscape;
                        margin: 1cm;
                    }
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <h2>Product Images Report</h2>
                    <p><strong>Serial Number:</strong> ${sno}</p>
                    <p><strong>Description:</strong> ${description || 'No description available'}</p>
                    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <table class="print-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Image Preview</th>
                            <th>Image Path</th>
                            <th>Full URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${images.map((img, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>
                                    <img 
                                        class="print-image" 
                                        src="${baseUrl}${img}" 
                                        alt="Product Image ${index + 1}" 
                                        onerror="this.src='https://via.placeholder.com/150?text=Image+Not+Available';this.alt='Image not available';"
                                    >
                                </td>
                                <td>${img}</td>
                                <td>${baseUrl}${img}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 200);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }, [images, sno, baseUrl, description, hasImages]);

    // Navigation handlers
    const handleNew = useCallback(() => navigate('/product/add'), [navigate]);
    const handleExit = useCallback(() => navigate('/'), [navigate]);

    // Image management
    const handleDeleteImage = useCallback(async (imagePath) => {
        if (!window.confirm('Are you sure you want to permanently delete this image?')) return;

        try {
            await deleteImage(sno, imagePath);
            setFeedback({
                error: '',
                success: 'Image was successfully deleted.'
            });
        } catch (err) {
            console.error('Error deleting image:', err);
            setFeedback({
                error: 'Failed to delete image. Please try again.',
                success: ''
            });
        }
    }, [deleteImage, sno]);

    const handleBulkDelete = useCallback(async () => {
        if (selectedImages.length === 0) {
            setFeedback({
                error: 'Please select one or more images to delete.',
                success: ''
            });
            return;
        }

        if (!window.confirm(`This will permanently delete ${selectedImages.length} selected image(s). Continue?`)) return;

        try {
            await Promise.all(selectedImages.map(img => deleteImage(sno, img)));
            setSelectedImages([]);
            setFeedback({
                error: '',
                success: `Successfully deleted ${selectedImages.length} image(s).`
            });
        } catch (err) {
            console.error('Error deleting images:', err);
            setFeedback({
                error: 'Failed to delete some images. Please try again.',
                success: ''
            });
        }
    }, [deleteImage, sno, selectedImages]);

    // Description management
    const handleUpdateDescription = useCallback(async () => {
        if (!newDescription.trim()) {
            setFeedback({
                error: 'Description cannot be empty.',
                success: ''
            });
            return;
        }

        if (newDescription === description) {
            setEditMode(false);
            return;
        }

        try {
            await updateDescription(sno, newDescription);
            setFeedback({
                error: '',
                success: 'Description was successfully updated.'
            });
            setEditMode(false);
        } catch (err) {
            console.error('Error updating description:', err);
            setFeedback({
                error: err.response?.data?.error || 'Failed to update description. Please try again.',
                success: ''
            });
        }
    }, [updateDescription, sno, newDescription, description]);

    // Selection handlers
    const toggleImageSelection = useCallback((imagePath) => {
        setSelectedImages(prev =>
            prev.includes(imagePath)
                ? prev.filter(img => img !== imagePath)
                : [...prev, imagePath]
        );
    }, []);

    const selectAllImages = useCallback(() => {
        if (allSelected) {
            setSelectedImages([]);
        } else {
            setSelectedImages([...images]);
        }
    }, [allSelected, images]);

    // Edit mode toggles
    const toggleEditMode = useCallback(() => {
        setEditMode(prev => !prev);
        if (editMode) {
            setNewDescription(description);
        }
    }, [editMode, description]);

    const toggleImageEditMode = useCallback(() => {
        setImageEditMode(prev => !prev);
        if (imageEditMode) {
            setSelectedImages([]);
        }
    }, [imageEditMode]);

    // Clear feedback messages after timeout
    useEffect(() => {
        if (feedback.success || feedback.error) {
            const timer = setTimeout(() => {
                setFeedback({ error: '', success: '' });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [feedback]);

    // Memoized table columns for better performance
    const tableColumns = useMemo(() => {
        const baseColumns = [
            { id: 'index', label: '#', width: '50px' },
            { id: 'image', label: 'Image', width: '150px' },
            { id: 'sno', label: 'Serial Number', width: '120px' },
            { id: 'description', label: 'Description', width: 'auto' },
            { id: 'actions', label: 'Actions', width: '150px' }
        ];
        
        if (imageEditMode) {
            // Insert select column after index column
            baseColumns.splice(1, 0, { id: 'select', label: 'Select', width: '60px' });
        }
        
        return baseColumns;
    }, [imageEditMode]);

    // Simplified filter section for mobile
    const renderFilterSection = () => (
        <div className="filter-section">
            <div className="filter-row">
                <div className="filter-group">
                    {!isMobileView && (
                        <>
                            <label className="filter-label">
                                <input
                                    type="checkbox"
                                    name="asOnDate"
                                    onChange={handleFilterChange}
                                    aria-label="Filter by date range"
                                />
                                Date Range
                            </label>
                            <input
                                type="date"
                                name="fromDate"
                                value={filters.fromDate}
                                onChange={handleFilterChange}
                                aria-label="Start date"
                                max={filters.toDate || new Date().toISOString().split('T')[0]}
                                className="filter-input"
                            />
                            <span className="filter-separator">to</span>
                        </>
                    )}
                    <input
                        type="date"
                        name="toDate"
                        value={filters.toDate}
                        onChange={handleFilterChange}
                        aria-label="End date"
                        min={filters.fromDate}
                        max={new Date().toISOString().split('T')[0]}
                        className="filter-input"
                    />
                </div>
            </div>

            {!isMobileView && (
                <>
                    <div className="filter-row">
                        <div className="filter-group">
                            <label htmlFor="costCentre" className="filter-label">Cost Centre</label>
                            <select
                                id="costCentre"
                                name="costCentre"
                                value={filters.costCentre}
                                onChange={handleFilterChange}
                                aria-label="Select cost centre"
                                className="filter-select"
                            >
                                <option value="">Select Cost Centre</option>
                                <option value="Showroom1">Showroom 1</option>
                                <option value="Showroom2">Showroom 2</option>
                            </select>

                            <label htmlFor="counter" className="filter-label">Counter</label>
                            <select
                                id="counter"
                                name="counter"
                                value={filters.counter}
                                onChange={handleFilterChange}
                                aria-label="Select counter"
                                className="filter-select"
                            >
                                <option value="ALL">All Counters</option>
                                <option value="Counter1">Counter 1</option>
                                <option value="Counter2">Counter 2</option>
                            </select>
                        </div>
                    </div>

                    <div className="filter-row">
                        <div className="filter-group">
                            <label htmlFor="itemId" className="filter-label">Item ID</label>
                            <input
                                id="itemId"
                                type="text"
                                name="itemId"
                                value={filters.itemId}
                                onChange={handleFilterChange}
                                aria-label="Enter item ID"
                                placeholder="Item ID"
                                className="filter-input"
                            />

                            <label htmlFor="tagNo" className="filter-label">Tag No</label>
                            <input
                                id="tagNo"
                                type="text"
                                name="tagNo"
                                value={filters.tagNo}
                                onChange={handleFilterChange}
                                aria-label="Enter tag number"
                                placeholder="Tag Number"
                                className="filter-input"
                            />
                        </div>
                    </div>
                </>
            )}

            <div className="filter-row">
                <div className="filter-group checkbox-group">
                    <label className="filter-checkbox-label">
                        <input
                            type="checkbox"
                            name="checkPhysicalImage"
                            checked={filters.checkPhysicalImage}
                            onChange={handleFilterChange}
                            aria-label="Include physical image verification"
                            className="filter-checkbox"
                        />
                        Verify Physical Image
                    </label>

                    <label className="filter-checkbox-label">
                        <input
                            type="checkbox"
                            name="withoutImage"
                            checked={filters.withoutImage}
                            onChange={handleFilterChange}
                            aria-label="Include items without images"
                            className="filter-checkbox"
                        />
                        Without Images
                    </label>

                    <label className="filter-checkbox-label">
                        <input
                            type="checkbox"
                            name="withImage"
                            checked={filters.withImage}
                            onChange={handleFilterChange}
                            aria-label="Include items with images"
                            className="filter-checkbox"
                        />
                        With Images
                    </label>
                </div>
            </div>
        </div>
    );

    // Render mobile-friendly image cards
    const renderMobileImageCards = () => (
        <div className="mobile-image-grid">
            {images.map((img, index) => (
                <motion.div
                    key={`mobile-${img}-${index}`}
                    className={`mobile-image-card ${selectedImages.includes(img) ? 'selected' : ''}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                >
                    {imageEditMode && (
                        <div className="mobile-select-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedImages.includes(img)}
                                onChange={() => toggleImageSelection(img)}
                                aria-label={`${selectedImages.includes(img) ? 'Deselect' : 'Select'} image ${index + 1}`}
                            />
                        </div>
                    )}
                    
                    <div className="mobile-image-container">
                        <img
                            src={`${baseUrl}${img}`}
                            alt={`Product ${sno} - Image ${index + 1}`}
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Not+Available';
                                e.currentTarget.alt = 'Image not available';
                            }}
                        />
                    </div>
                    
                    <div className="mobile-image-meta">
                        <div className="mobile-image-index">#{index + 1}</div>
                        <div className="mobile-image-actions">
                            <a
                                href={`${baseUrl}${img}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn small info"
                                aria-label={`View full size of image ${index + 1}`}
                                title="View full size"
                            >
                                <span className="icon" aria-hidden="true">👁️</span>
                            </a>
                            {imageEditMode && (
                                <button
                                    className="btn small danger"
                                    onClick={() => handleDeleteImage(img)}
                                    aria-label={`Delete image ${index + 1}`}
                                    disabled={loading}
                                    title="Delete this image"
                                >
                                    <span className="icon" aria-hidden="true">🗑️</span>
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    return (
        <div className="manage-product-container" role="main">
            {/* Filters Section */}
            <motion.div
                className="filter-box card"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                aria-labelledby="filter-section-title"
            >
                <h2 id="filter-section-title" className="visually-hidden">Product Filters</h2>
                {renderFilterSection()}

                <div className="action-buttons">
                    <button
                        className="btn primary"
                        aria-label="Search products"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-icon" aria-hidden="true"></span>
                                Searching...
                            </>
                        ) : (
                            <>
                                <span className="icon" aria-hidden="true">🔍</span>
                                Search
                            </>
                        )}
                    </button>
                    
                    <div className="button-group">
                        <button
                            className="btn success"
                            onClick={handleNew}
                            aria-label="Add new product"
                        >
                            <span className="icon" aria-hidden="true">✨</span>
                            {!isMobileView && 'New Product'}
                        </button>
                        <button
                            className="btn danger"
                            onClick={handleExit}
                            aria-label="Exit to dashboard"
                        >
                            <span className="icon" aria-hidden="true">❌</span>
                            {!isMobileView && 'Exit'}
                        </button>
                    </div>
                    
                    <div className="export-actions">
                        <button
                            className="btn info"
                            onClick={handleExportExcel}
                            aria-label="Export to Excel"
                            disabled={!hasImages}
                            title="Export to Excel"
                        >
                            <span className="icon" aria-hidden="true">📊</span>
                            {!isMobileView && 'Excel'}
                        </button>
                        <button
                            className="btn secondary"
                            onClick={handleExportPDF}
                            aria-label="Export to PDF"
                            disabled={!hasImages}
                            title="Export to PDF"
                        >
                            <span className="icon" aria-hidden="true">📄</span>
                            {!isMobileView && 'PDF'}
                        </button>
                        <button
                            className="btn secondary"
                            onClick={handlePrint}
                            aria-label="Print report"
                            disabled={!hasImages}
                            title="Print Report"
                        >
                            <span className="icon" aria-hidden="true">🖨️</span>
                            {!isMobileView && 'Print'}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Feedback Messages */}
            <AnimatePresence>
                {feedback.error && (
                    <motion.div
                        className="alert error"
                        role="alert"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        aria-live="assertive"
                    >
                        <span className="alert-icon" aria-hidden="true">⚠️</span>
                        <span className="alert-message">{feedback.error}</span>
                        <button
                            onClick={fetchImages}
                            className="btn small"
                            aria-label="Retry loading data"
                        >
                            Retry
                        </button>
                    </motion.div>
                )}
                {feedback.success && (
                    <motion.div
                        className="alert success"
                        role="alert"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        aria-live="polite"
                    >
                        <span className="alert-icon" aria-hidden="true">✅</span>
                        <span className="alert-message">{feedback.success}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Description Section */}
            <motion.div
                className="description-section card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                aria-labelledby="description-section-title"
            >
                <div className="section-header">
                    <h3 id="description-section-title">Product Description</h3>
                    <div className="section-actions">
                        <span className="sno-badge">
                            <span className="sno-label">Serial:</span>
                            <span className="sno-value">{sno}</span>
                        </span>
                        {editMode ? (
                            <>
                                <button
                                    onClick={handleUpdateDescription}
                                    className="btn success small"
                                    disabled={loading || !newDescription.trim() || newDescription === description}
                                    aria-label="Save description changes"
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-icon small" aria-hidden="true"></span>
                                            {!isMobileView && 'Saving...'}
                                        </>
                                    ) : (
                                        <>
                                            <span className="icon" aria-hidden="true">💾</span>
                                            {!isMobileView && 'Save'}
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={toggleEditMode}
                                    className="btn danger small"
                                    aria-label="Cancel editing description"
                                >
                                    <span className="icon" aria-hidden="true">❌</span>
                                    {!isMobileView && 'Cancel'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={toggleEditMode}
                                className="btn primary small"
                                aria-label="Edit product description"
                            >
                                <span className="icon" aria-hidden="true">✏️</span>
                                {!isMobileView && 'Edit'}
                            </button>
                        )}
                    </div>
                </div>
                <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Enter detailed product description..."
                    className="description-textarea"
                    rows={isMobileView ? 3 : 4}
                    aria-label="Product description input"
                    disabled={!editMode}
                />
            </motion.div>

            {/* Image Display Section */}
            <motion.div
                className="image-section card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                aria-labelledby="images-section-title"
            >
                {isInitialLoad && loading ? (
                    <motion.div
                        className="loading-state"
                        aria-live="polite"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="spinner" aria-hidden="true"></div>
                        <p>Loading product images...</p>
                    </motion.div>
                ) : hasImages ? (
                    <>
                        <div className="section-header">
                            <h3 id="images-section-title">Product Images</h3>
                            <div className="section-actions">
                                <span className="results-count">
                                    {images.length} image{images.length !== 1 ? 's' : ''}
                                </span>
                                {imageEditMode ? (
                                    <>
                                        {selectedImages.length > 0 && (
                                            <button
                                                className="btn danger small"
                                                onClick={handleBulkDelete}
                                                aria-label={`Delete ${selectedImages.length} selected images`}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-icon small" aria-hidden="true"></span>
                                                        {!isMobileView && `Deleting (${selectedImages.length})...`}
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="icon" aria-hidden="true">🗑️</span>
                                                        {!isMobileView && `Delete (${selectedImages.length})`}
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        <button
                                            className="btn small"
                                            onClick={selectAllImages}
                                            aria-label={allSelected ? 'Deselect all images' : 'Select all images'}
                                        >
                                            {allSelected ? (
                                                <>
                                                    <span className="icon" aria-hidden="true">❌</span>
                                                    {!isMobileView && 'Deselect All'}
                                                </>
                                            ) : (
                                                <>
                                                    <span className="icon" aria-hidden="true">✔️</span>
                                                    {!isMobileView && 'Select All'}
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={toggleImageEditMode}
                                            className="btn danger small"
                                            aria-label="Exit image edit mode"
                                        >
                                            <span className="icon" aria-hidden="true">❌</span>
                                            {!isMobileView && 'Cancel'}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={toggleImageEditMode}
                                        className="btn primary small"
                                        aria-label="Enable image edit mode"
                                    >
                                        <span className="icon" aria-hidden="true">✏️</span>
                                        {!isMobileView && 'Edit Images'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {isMobileView ? (
                            renderMobileImageCards()
                        ) : (
                            <div className="responsive-table-container">
                                <table className="image-table" ref={printRef}>
                                    <thead>
                                        <tr>
                                            {tableColumns.map(column => (
                                                <th
                                                    key={column.id}
                                                    width={column.width}
                                                    scope="col"
                                                >
                                                    {column.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {images.map((img, index) => (
                                            <motion.tr
                                                key={`${img}-${index}`}
                                                className={selectedImages.includes(img) ? 'selected-row' : ''}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2, delay: index * 0.02 }}
                                            >
                                                <td>{index + 1}</td>
                                                {imageEditMode && (
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedImages.includes(img)}
                                                            onChange={() => toggleImageSelection(img)}
                                                            aria-label={`${selectedImages.includes(img) ? 'Deselect' : 'Select'} image ${index + 1}`}
                                                            className="image-checkbox"
                                                        />
                                                    </td>
                                                )}
                                                <td>
                                                    <div className="thumbnail-container">
                                                        <img
                                                            src={`${baseUrl}${img}`}
                                                            alt={`Product ${sno} - Image ${index + 1}`}
                                                            className="thumbnail"
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Not+Available';
                                                                e.currentTarget.alt = 'Image not available';
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td>{sno}</td>
                                                <td className="description-cell">
                                                    {description || 'No description available'}
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <a
                                                            href={`${baseUrl}${img}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn small info"
                                                            aria-label={`View full size of image ${index + 1}`}
                                                            title="View full size"
                                                        >
                                                            <span className="icon" aria-hidden="true">👁️</span>
                                                            View
                                                        </a>
                                                        {imageEditMode && (
                                                            <button
                                                                className="btn small danger"
                                                                onClick={() => handleDeleteImage(img)}
                                                                aria-label={`Delete image ${index + 1}`}
                                                                disabled={loading}
                                                                title="Delete this image"
                                                            >
                                                                <span className="icon" aria-hidden="true">🗑️</span>
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                ) : (
                    <motion.div
                        className="empty-state"
                        aria-live="polite"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="empty-state-icon">📷</div>
                        <h4>No Images Found</h4>
                        <p>No images are currently associated with product {sno}.</p>
                        <button
                            onClick={fetchImages}
                            className="btn primary"
                            disabled={loading}
                            aria-label="Refresh product data"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-icon" aria-hidden="true"></span>
                                    Refreshing...
                                </>
                            ) : (
                                <>
                                    <span className="icon" aria-hidden="true">🔄</span>
                                    Refresh Data
                                </>
                            )}
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

ManageProduct.propTypes = {
    sno: PropTypes.string,
    baseUrl: PropTypes.string
};

export default React.memo(ManageProduct);