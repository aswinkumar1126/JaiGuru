import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TablePagination from '@mui/material/TablePagination';
import {
    useBannersQuery,
  
} from '../../../hooks/banners/useBannersQuery';
import {
    useUpdateBannerMutation,
    useDeleteBannerMutation,
} from '../../../hooks/banners/useUploadBannerMutation';
import pdfSvg from '../../../assets/svg/pdf-icon-01.svg';
import xlsSvg from '../../../assets/svg/pdf-icon-04.svg';
import refreshSvg from '../../../assets/svg/re-fresh.svg';
import searchSvg from '../../../assets/svg/search-normal.svg';
import plusSvg from '../../../assets/svg/plus.svg';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './ManageBanners.css';

const BASE_IMAGE_URL = 'https://app.bmgjewellers.com';

const ManageBanner = () => {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(null);
    const [editFile, setEditFile] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBanners, setFilteredBanners] = useState([]);

    const { data: bannersData, isLoading, error, refetch } = useBannersQuery();
    const { mutate: updateBanner, isLoading: isUpdating } = useUpdateBannerMutation();
    const { mutate: deleteBanner, isLoading: isDeleting } = useDeleteBannerMutation();

    const banners = bannersData?.data || [];

    useEffect(() => {
        if (banners.length > 0) {
            const filtered = banners.filter(
                (banner) =>
                    banner.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    banner.id.toString().includes(searchQuery)
            );
            setFilteredBanners(filtered);
            setPage(0);
        } else {
            setFilteredBanners([]);
        }
    }, [banners, searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleRefreshClick = () => {
        refetch();
        setSearchQuery('');
    };

    const handleEditClick = (banner) => {
        setSelectedId(banner.id);
        setEditFile(null);
        setEditTitle(banner.title || '');
        setErrorMessage('');
    };

    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            setErrorMessage('Please select a valid image file (JPEG, PNG, etc.)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('File size exceeds maximum limit of 5MB');
            return;
        }

        setEditFile(file);
        setErrorMessage('');
    };

    const handleEditTitleChange = (e) => {
        setEditTitle(e.target.value);
        setErrorMessage('');
    };

    const handleSaveEdit = (id) => {
        if (!editFile) {
            setErrorMessage('Please select an image to update.');
            return;
        }
        if (!editTitle.trim()) {
            setErrorMessage('Please provide a title for the banner.');
            return;
        }

        updateBanner(
            { image: editFile, title: editTitle, id },
            {
                onSuccess: () => {
                    setSuccessMessage('Banner updated successfully!');
                    setSelectedId(null);
                    setEditFile(null);
                    setEditTitle('');
                    setTimeout(() => setSuccessMessage(''), 3000);
                    refetch();
                },
                onError: (error) => {
                    setErrorMessage(error.response?.data?.error || 'Failed to update banner.');
                },
            }
        );
    };

    const handleCancelEdit = () => {
        setSelectedId(null);
        setEditFile(null);
        setEditTitle('');
        setErrorMessage('');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            deleteBanner(id, {
                onSuccess: () => {
                    setSuccessMessage('Banner deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                    refetch();
                },
                onError: (error) => {
                    setErrorMessage(error.response?.data?.error || 'Failed to delete banner.');
                },
            });
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ['ID', 'Title', 'Image Path'];
        const tableRows = filteredBanners.map((banner) => [
            banner.id,
            banner.title || 'Untitled',
            `${BASE_IMAGE_URL}${banner.image_path}`,
        ]);

        doc.setFontSize(18);
        doc.setTextColor(59, 93, 231);
        doc.text('Banner Management Report', 14, 15);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 25,
            theme: 'grid',
            headStyles: { fillColor: [59, 93, 231], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            styles: { fontSize: 10, cellPadding: 3 },
            margin: { top: 30 },
        });

        doc.save(`banners_report_${new Date().toISOString().slice(0, 10)}.pdf`);
        setSuccessMessage('PDF exported successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredBanners.map((banner) => ({
                ID: banner.id,
                Title: banner.title || 'Untitled',
                'Image Path': `${BASE_IMAGE_URL}${banner.image_path}`,
                'Created At': new Date(banner.created_at).toLocaleString(),
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Banners');

        worksheet['!cols'] = [
            { wch: 10 },
            { wch: 30 },
            { wch: 50 },
            { wch: 20 },
        ];

        XLSX.writeFile(workbook, `banners_${new Date().toISOString().slice(0, 10)}.xlsx`);
        setSuccessMessage('Excel file exported successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const paginatedBanners = filteredBanners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <div className="manage-banners-container">
            <div className="page-header">
                <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                    </li>
                   
                    <li className="breadcrumb-item active">Manage Banners</li>
                </ul>
            </div>

            <motion.div
                className="card card-table"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="card-body">
                    <div className="page-table-header">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="table-title">Manage Banners</h3>
                                <div className="action-buttons">
                                    <button
                                        onClick={() => navigate('/admin/banner/add')}
                                        className="btn btn-primary add-btn"
                                        title="Add Banner"
                                    >
                                        <img src={plusSvg} alt="Add" />
                                    </button>
                                    <button
                                        onClick={handleRefreshClick}
                                        className="btn btn-primary refresh-btn"
                                        title="Refresh"
                                    >
                                        <img src={refreshSvg} alt="Refresh" />
                                    </button>
                                </div>
                                {/* <div className="search-bar">
                                    <form className="search-form">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search banners by title or ID..."
                                            value={searchQuery}
                                            onChange={handleSearch}
                                        />
                                        <img src={searchSvg} alt="Search" className="search-icon" />
                                    </form>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => navigate('/banners/add')}
                                            className="btn btn-primary add-btn"
                                            title="Add Banner"
                                        >
                                            <img src={plusSvg} alt="Add" />
                                        </button>
                                        <button
                                            onClick={handleRefreshClick}
                                            className="btn btn-primary refresh-btn"
                                            title="Refresh"
                                        >
                                            <img src={refreshSvg} alt="Refresh" />
                                        </button>
                                    </div>
                                </div> */}
                            </div>
                            <div className="col-auto export-buttons">
                                <button onClick={exportToPDF} className="btn export-btn" title="Export to PDF">
                                    <img src={pdfSvg} alt="PDF" />
                                </button>
                                <button onClick={exportToExcel} className="btn export-btn" title="Export to Excel">
                                    <img src={xlsSvg} alt="Excel" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {errorMessage && (
                            <motion.div
                                className="alert alert-danger"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {errorMessage}
                            </motion.div>
                        )}
                        {successMessage && (
                            <motion.div
                                className="alert alert-success"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {successMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isLoading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">Error loading banners: {error.message}</div>
                    ) : filteredBanners.length === 0 ? (
                        <div className="alert alert-info">
                            {searchQuery ? 'No banners match your search' : 'No banners available'}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table custom-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedBanners.map((banner) => (
                                        <tr key={banner.id}>
                                            <td>{banner.id}</td>
                                            <td>
                                                {selectedId === banner.id ? (
                                                    <div className="banner-edit-container">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleEditFileChange}
                                                            className="form-control"
                                                        />
                                                        {editFile && (
                                                            <div className="mt-2">
                                                                <span className="badge bg-info">Selected: {editFile.name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="banner-preview-container">
                                                        <img
                                                            src={`${BASE_IMAGE_URL}${banner.image_path}`}
                                                            alt={`banner-${banner.id}`}
                                                            width="100"
                                                            className="banner-thumbnail"
                                                            onError={(e) => (e.target.src = '/fallback-image.jpg')}
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {selectedId === banner.id ? (
                                                    <input
                                                        type="text"
                                                        value={editTitle}
                                                        onChange={handleEditTitleChange}
                                                        className="form-control"
                                                        placeholder="Enter banner title"
                                                    />
                                                ) : (
                                                    banner.title || 'Untitled Banner'
                                                )}
                                            </td>
                                            <td>
                                                {selectedId === banner.id ? (
                                                    <div className="btn-group">
                                                        <button
                                                            onClick={() => handleSaveEdit(banner.id)}
                                                            disabled={!editFile || isUpdating}
                                                            className="btn btn-sm btn-success me-2"
                                                        >
                                                            {isUpdating ? (
                                                                <span
                                                                    className="spinner-border spinner-border-sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                'Save'
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            disabled={isUpdating}
                                                            className="btn btn-sm btn-secondary"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="btn-group">
                                                        <button
                                                            onClick={() => handleEditClick(banner)}
                                                            disabled={isDeleting}
                                                            className="btn btn-sm btn-primary me-2"
                                                        >
                                                            <i className="fas fa-edit" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(banner.id)}
                                                            disabled={isDeleting}
                                                            className="btn btn-sm btn-danger"
                                                            > <i className="fas fa-edit" /> Delete
                                                            {isDeleting ? (
                                                                <span
                                                                    className="spinner-border spinner-border-sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                <i className="fas fa-trash-alt" />
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredBanners.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default ManageBanner;