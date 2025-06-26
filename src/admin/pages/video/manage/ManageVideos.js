import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import TablePagination from '@mui/material/TablePagination';
import {
    useVideosQuery,
    useUpdateVideoMutation,
    useDeleteVideoMutation,
} from "../../../hooks/video/useVideoQuery";
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus, FaSync, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "./ManageVideos.css";

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

    // Responsive breakpoints
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
    const isDesktop = useMediaQuery({ minWidth: 1024 });

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
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => navigate('/video/add')}
                                                        className="btn btn-primary add-pluss ms-2"
                                                        aria-label="Add new video"
                                                    >
                                                        <FaPlus />
                                                        {isDesktop && <span className="ms-1">Add Video</span>}
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={handleRefreshClick}
                                                        className="btn btn-primary doctor-refresh ms-2"
                                                        aria-label="Refresh videos"
                                                    >
                                                        <FaSync />
                                                        {isDesktop && <span className="ms-1">Refresh</span>}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
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
                                    <p className="mt-2">Loading videos...</p>
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
                                                {!isMobile && <th>ID</th>}
                                                <th>Video Preview</th>
                                                {!isMobile && <th>Title</th>}
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedVideos.map((video) => (
                                                <tr key={video.id}>
                                                    {!isMobile && <td>{video.id}</td>}
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
                                                                    width={isMobile ? "80" : "120"}
                                                                    height={isMobile ? "60" : "80"}
                                                                    muted
                                                                    controls={false}
                                                                    className="video-thumbnail"
                                                                    onError={(e) => (e.target.poster = "/fallback-video.jpg")}
                                                                />
                                                                {isMobile && (
                                                                    <div className="mobile-video-title">
                                                                        {video.title || 'Untitled Video'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    {!isMobile && <td>{video.title || 'Untitled Video'}</td>}
                                                    <td>
                                                        {selectedId === video.id ? (
                                                            <div className="btn-group">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleSaveEdit(video.id)}
                                                                    disabled={!editFile || isUpdating}
                                                                    className="btn btn-sm btn-success me-2"
                                                                    aria-label="Save changes"
                                                                >
                                                                    {isUpdating ? (
                                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    ) : (
                                                                        <>
                                                                            <FaSave /> {!isMobile && "Save"}
                                                                        </>
                                                                    )}
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={handleCancelEdit}
                                                                    disabled={isUpdating}
                                                                    className="btn btn-sm btn-secondary"
                                                                    aria-label="Cancel editing"
                                                                >
                                                                    <FaTimes /> {!isMobile && "Cancel"}
                                                                </motion.button>
                                                            </div>
                                                        ) : (
                                                            <div className="btn-group">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleEditClick(video)}
                                                                    disabled={isDeleting}
                                                                    className="btn btn-sm btn-primary me-2"
                                                                    aria-label="Edit video"
                                                                >
                                                                    <FaEdit /> {!isMobile && "Edit"}
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleDelete(video.id)}
                                                                    disabled={isDeleting}
                                                                    className="btn btn-sm btn-danger"
                                                                    aria-label="Delete video"
                                                                >
                                                                    {isDeleting ? (
                                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    ) : (
                                                                        <>
                                                                            <FaTrash /> {!isMobile && "Delete"}
                                                                        </>
                                                                    )}
                                                                </motion.button>
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
                                labelRowsPerPage={isMobile ? "Rows:" : "Rows per page:"}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ManageVideos;