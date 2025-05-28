import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    useVideosQuery,
    useUpdateVideoMutation,
    useDeleteVideoMutation,
} from "../../../hooks/video/useVideoQuery";
import "./ManageVideos.css";

const BASE_VIDEO_URL = "https://app.bmgjewellers.com";

const ManageVideos = () => {
    const [selectedId, setSelectedId] = useState(null); // Tracks the row being edited
    const [editFile, setEditFile] = useState(null); // File for updating video
    const [errorMessage, setErrorMessage] = useState(""); // Error feedback
    const [successMessage, setSuccessMessage] = useState(""); // Success feedback

    const { data: videos, isLoading, error } = useVideosQuery();
    console.log("Videos data:", videos);

    const { mutate: updateVideo, isLoading: isUpdating } = useUpdateVideoMutation();
    const { mutate: deleteVideo, isLoading: isDeleting } = useDeleteVideoMutation();

    // Start editing a row
    const handleEditClick = (video) => {
        setSelectedId(video.id);
        setEditFile(null);
        setErrorMessage("");
    };

    // Handle file change for edit
    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match("video.*")) {
                setErrorMessage("Please select a video file (MP4, WebM, or QuickTime)");
                return;
            }
            // Validate file size (100MB)
            if (file.size > 100 * 1024 * 1024) {
                setErrorMessage("File size exceeds maximum limit of 100MB");
                return;
            }
            setEditFile(file);
            setErrorMessage("");
        }
    };

    // Handle save edit
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
                },
                onError: (error) => {
                    setErrorMessage(error.response?.data?.error || "Failed to update video.");
                },
            }
        );
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setSelectedId(null);
        setEditFile(null);
        setErrorMessage("");
    };

    // Handle delete video
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this video?")) {
            deleteVideo(id, {
                onSuccess: () => {
                    setSuccessMessage("Video deleted successfully!");
                    setTimeout(() => setSuccessMessage(""), 3000);
                },
                onError: (error) => {
                    setErrorMessage(error.response?.data?.error || "Failed to delete video.");
                },
            });
        }
    };

    return (
        <motion.div
            className="manage-videos-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            role="region"
            aria-labelledby="manage-videos-heading"
        >
            <header className="table-header">
                <h1 id="manage-videos-heading" className="table-heading">Manage Videos</h1>
                <p className="table-subheading">View and update your video content</p>
            </header>

            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        className="error-message"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        role="alert"
                    >
                        <svg className="message-icon" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        {errorMessage}
                    </motion.div>
                )}
                {successMessage && (
                    <motion.div
                        className="success-message"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        role="alert"
                    >
                        <svg className="message-icon" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        {successMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading ? (
                <p className="loading-text">Loading videos...</p>
            ) : error ? (
                <p className="error-message">Error loading videos: {error.message}</p>
            ) : !videos?.data?.length ? (
                <p className="no-data-text">No videos available.</p>
            ) : (
                <table className="video-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Video Preview</th>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>
                                    {selectedId === item.id ? (
                                        <>
                                            <input
                                                type="file"
                                                accept="video/mp4,video/webm,video/quicktime"
                                                onChange={handleEditFileChange}
                                            />
                                            {editFile && <p>Selected File: {editFile.name}</p>}
                                        </>
                                    ) : (
                                        <video
                                            src={`${BASE_VIDEO_URL}${item.video_path}`}
                                            width="100"
                                            muted
                                            controls={false}
                                            className="video-preview"
                                            onError={(e) => (e.target.poster = "/fallback-video.jpg")}
                                        />
                                    )}
                                </td>
                                <td>{item.title}</td>
                                <td>
                                    {selectedId === item.id ? (
                                        <>
                                            <motion.button
                                                onClick={() => handleSaveEdit(item.id)}
                                                disabled={!editFile || isUpdating}
                                                className="action-button primary-button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {isUpdating ? "Saving..." : "Save"}
                                            </motion.button>
                                            <motion.button
                                                onClick={handleCancelEdit}
                                                disabled={isUpdating}
                                                className="action-button secondary-button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Cancel
                                            </motion.button>
                                        </>
                                    ) : (
                                        <>
                                            <motion.button
                                                onClick={() => handleEditClick(item)}
                                                disabled={isUpdating || isDeleting}
                                                className="action-button primary-button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                ✏️ Edit
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={isUpdating || isDeleting}
                                                className="action-button danger-button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                🗑️ Delete
                                            </motion.button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </motion.div>
    );
};

export default ManageVideos;