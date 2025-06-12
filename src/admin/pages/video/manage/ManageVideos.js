import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TablePagination from '@mui/material/TablePagination';
import {
    useVideosQuery,
    useUpdateVideoMutation,
    useDeleteVideoMutation,
} from "../../../hooks/video/useVideoQuery";
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus, FaSync, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import "./ManageVideos.css";
import pdfSvg from '../../../assets/svg/pdf-icon-01.svg';
import xlsSvg from '../../../assets/svg/pdf-icon-04.svg';
const BASE_VIDEO_URL = "https://app.bmgjewellers.com";

const ManageVideos = () => {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(null);
    const [editFile, setEditFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredVideos, setFilteredVideos] = useState([]);

    const { data: videosData, isLoading, error, refetch } = useVideosQuery();
    const { mutate: updateVideo, isLoading: isUpdating } = useUpdateVideoMutation();
    const { mutate: deleteVideo, isLoading: isDeleting } = useDeleteVideoMutation();

    const videos = videosData?.data || [];

    useEffect(() => {
        if (videos.length > 0) {
            setFilteredVideos(videos);
        }
    }, [videos]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        filterVideos(query);
    };

    const filterVideos = (query) => {
        const filtered = videos.filter(video =>
            video.title.toLowerCase().includes(query.toLowerCase()) ||
            video.id.toString().includes(query)
        );
        setFilteredVideos(filtered);
        setPage(0);
    };

    const handleRefreshClick = () => {
        refetch();
        setSuccessMessage("Videos refreshed successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const handleEditClick = (video) => {
        setSelectedId(video.id);
        setEditFile(null);
        setErrorMessage("");
    };

    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match("video.*")) {
            setErrorMessage("Please select a valid video file (MP4, WebM, QuickTime)");
            return;
        }

        if (file.size > 100 * 1024 * 1024) {
            setErrorMessage("File size exceeds maximum limit of 100MB");
            return;
        }

        setEditFile(file);
        setErrorMessage("");
    };

    const handleSaveEdit = (id) => {
        if (!editFile) {
            setErrorMessage("Please select a video file to update.");
            return;
        }

        updateVideo(
            { id, video: editFile },
            {
                onSuccess: () => {
                    setSuccessMessage("Video updated successfully!");
                    setSelectedId(null);
                    setEditFile(null);
                    setTimeout(() => setSuccessMessage(""), 3000);
                    refetch();
                },
                onError: (error) => {
                    setErrorMessage(error.response?.data?.error || "Failed to update video.");
                },
            }
        );
    };

    const handleCancelEdit = () => {
        setSelectedId(null);
        setEditFile(null);
        setErrorMessage("");
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this video?")) {
            deleteVideo(id, {
                onSuccess: () => {
                    setSuccessMessage("Video deleted successfully!");
                    setTimeout(() => setSuccessMessage(""), 3000);
                    refetch();
                },
                onError: (error) => {
                    setErrorMessage(error.response?.data?.error || "Failed to delete video.");
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
        try {
            // Define the table headers
            const headers = [
                'ID',
                'Video title',
                'Video',
                'CreatedAt ',
                
            ];

            // Prepare the data rows
            const dataRows = filteredVideos.map(video => [
                 video.id,
                 video.title || "Untitled",
                `${BASE_VIDEO_URL}${video.video_path}`,
                 new Date(video.created_at).toLocaleString()
              
            ]);

            // Create a new PDF document
            const doc = new jsPDF();

            // Add title
            doc.setFontSize(18);
            doc.setTextColor(40);
            doc.text('Video Management Report', 14, 15);

            // Add the table using autoTable
            doc.autoTable({
                head: [headers],
                body: dataRows,
                startY: 25,
                theme: 'grid',
                headStyles: {
                    fillColor: [59, 93, 231],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240]
                },
                margin: { top: 30 },
            });

            // Save the PDF
            doc.save(`rates_report_${new Date().toISOString().slice(0, 10)}.pdf`);

            // Show success message
            setSuccessMessage("PDF exported successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);

        } catch (error) {
            console.error('Error exporting PDF:', error);
            setErrorMessage("Failed to export PDF. Please try again.");
        }
      };
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredVideos.map(video => ({
                ID: video.id,
                Title: video.title || "Untitled",
                "Video Path": `${BASE_VIDEO_URL}${video.video_path}`,
                "Created At": new Date(video.created_at).toLocaleString()
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Videos");

        const wscols = [
            { wch: 10 },
            { wch: 30 },
            { wch: 50 },
            { wch: 20 }
        ];
        worksheet["!cols"] = wscols;

        XLSX.writeFile(workbook, `videos_${new Date().toISOString().slice(0, 10)}.xlsx`);
        setSuccessMessage("Excel file exported successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const paginatedVideos = filteredVideos.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <div className="right-content w-100">
            <div className="page-header">
                <div className="row">
                    <div className="col-sm-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <p onClick={() => navigate(`/dashboard`)}>Dashboard</p>
                            </li>
                            <li className="breadcrumb-item">
                                <i className="fas fa-angle-right"></i>
                            </li>
                            <li className="breadcrumb-item active">Manage Videos</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12">
                    <motion.div
                        className="card card-table show-entire"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="card-body cardBody">
                            <div className="page-table-header mb-2">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <div className="doctor-table-blk">
                                            <h3>Manage Videos</h3>
                                            <div className="doctor-search-blk">
                                                <div className="top-nav-search table-search-blk">
                                                    <form>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Search videos..."
                                                            value={searchQuery}
                                                            onChange={handleSearch}
                                                        />
                                                        <p className="btn">
                                                            <FaSearch />
                                                        </p>
                                                    </form>
                                                </div>

                                                <div className="add-group">
                                                    <p
                                                        onClick={() => navigate('/video/add')}
                                                        className="btn btn-primary add-pluss ms-2"
                                                    >
                                                        <FaPlus />
                                                    </p>
                                                    <p
                                                        href="#"
                                                        className="btn btn-primary doctor-refresh ms-2"
                                                        onClick={handleRefreshClick}
                                                    >
                                                        <FaSync />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-auto text-end float-end ms-auto download-grp">
                                        <img src={pdfSvg} alt="" onClick={exportToPDF}
                                            className="btn btn-light me-2 export-btn" />
                                            
                                        
                                            
                                        <img src={xlsSvg} alt=""
                                            onClick={exportToExcel}
                                            className="btn btn-light export-btn"
                                        />
                                            
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {errorMessage && (
                                    <motion.div
                                        className="alert alert-danger"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        role="alert"
                                    >
                                        {errorMessage}
                                    </motion.div>
                                )}
                                {successMessage && (
                                    <motion.div
                                        className="alert alert-success"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        role="alert"
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
                                <div className="alert alert-danger">
                                    Error loading videos: {error.message}
                                </div>
                            ) : filteredVideos.length === 0 ? (
                                <div className="alert alert-info">
                                    {searchQuery ? "No videos match your search" : "No videos available"}
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table border-0 custom-table comman-table datatable mb-0">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Video Preview</th>
                                                <th>Title</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedVideos.map((video) => (
                                                <tr key={video.id}>
                                                    <td>{video.id}</td>
                                                    <td>
                                                        {selectedId === video.id ? (
                                                            <div className="video-edit-container">
                                                                <input
                                                                    type="file"
                                                                    accept="video/mp4,video/webm,video/quicktime"
                                                                    onChange={handleEditFileChange}
                                                                    className="form-control"
                                                                />
                                                                {editFile && (
                                                                    <div className="mt-2">
                                                                        <span className="badge bg-info">
                                                                            Selected: {editFile.name}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="video-preview-container">
                                                                <video
                                                                    src={`${BASE_VIDEO_URL}${video.video_path}`}
                                                                    width="120"
                                                                    height="80"
                                                                    muted
                                                                    controls={false}
                                                                    className="video-thumbnail"
                                                                    onError={(e) => (e.target.poster = "/fallback-video.jpg")}
                                                                />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>{video.title || 'Untitled Video'}</td>
                                                    <td>
                                                        {selectedId === video.id ? (
                                                            <div className="btn-group">
                                                                <button
                                                                    onClick={() => handleSaveEdit(video.id)}
                                                                    disabled={!editFile || isUpdating}
                                                                    className="btn btn-sm btn-success me-2"
                                                                >
                                                                    {isUpdating ? (
                                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    ) : (
                                                                        <>
                                                                            <FaSave /> Save
                                                                        </>
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelEdit}
                                                                    disabled={isUpdating}
                                                                    className="btn btn-sm btn-secondary"
                                                                >
                                                                    <FaTimes /> Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="btn-group">
                                                                <button
                                                                    onClick={() => handleEditClick(video)}
                                                                    disabled={isDeleting}
                                                                    className="btn btn-sm btn-primary me-2"
                                                                >
                                                                    <FaEdit /> Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(video.id)}
                                                                    disabled={isDeleting}
                                                                    className="btn btn-sm btn-danger"
                                                                >
                                                                    {isDeleting ? (
                                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    ) : (
                                                                        <>
                                                                            <FaTrash /> Delete
                                                                        </>
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
                                count={filteredVideos.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                className="pagination-bar"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ManageVideos;