import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadVideoMutation } from "../../../hooks/video/useVideoQuery";
import "./AddVideos.css";

const AddVideos = () => {
    const [title, setTitle] = useState("");
    const [video, setVideo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const {
        mutate: uploadVideo,
        isLoading,
        isError,
        error: mutationError,
        isSuccess,
        reset,
    } = useUploadVideoMutation();

    // Reset success state after 5 seconds
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                reset();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, reset]);

    // Clean up preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            setError("No file selected");
            return;
        }

        // Validate file type
        if (!selectedFile.type.match("video.*")) {
            setError("Please select a video file (MP4, WebM, or QuickTime format)");
            return;
        }

        // Validate file size (max 100MB)
        if (selectedFile.size > 100 * 1024 * 1024) {
            setError("File size exceeds maximum limit of 100MB");
            return;
        }

        setVideo(selectedFile);
        setError(null);

        // Create preview URL
        if (preview) {
            URL.revokeObjectURL(preview); // Clean up previous preview
        }
        const url = URL.createObjectURL(selectedFile);
        setPreview(url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("Video title is required");
            return;
        }

        if (title.length > 100) {
            setError("Title must be less than 100 characters");
            return;
        }

        if (!video) {
            setError("Please select a video file to upload");
            return;
        }

        // ✅ Correct way to call mutation
        uploadVideo({ title, video }, {
            onSuccess: () => {
                setTitle("");
                setVideo(null);
                setPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            },
            onError: (err) => {
                console.error("Upload error:", err);
                setError(
                    err.response?.data?.error ||
                    err.message ||
                    "An error occurred during video upload"
                );
            },
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            const event = { target: { files: [file] } };
            handleFileChange(event);
        }
    };

    return (
        <motion.div
            className="add-videos-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            role="region"
            aria-labelledby="video-heading"
        >
            <header className="form-header">
                <h1 id="video-heading" className="video-heading">Upload New Video</h1>
                <p className="form-subheading">Add your video content to the platform</p>
            </header>

            <motion.form
                onSubmit={handleSubmit}
                className="add-videos-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                noValidate
            >
                <div className="form-group">
                    <label htmlFor="video-title" className="form-label">
                        Video Title
                        <span className="required-indicator" aria-hidden="true">*</span>
                    </label>
                    <input
                        id="video-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a descriptive title for your video"
                        className="form-input"
                        aria-label="Video Title"
                        aria-required="true"
                        maxLength="100"
                        required
                    />
                    <div className="character-count">{title.length}/100</div>
                </div>

                <div className="form-group">
                    <label htmlFor="video-upload" className="file-upload-label">
                        <motion.div
                            className={`file-upload-box ${preview ? "has-preview" : ""}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            role="button"
                            aria-label="Upload video file"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            tabIndex="0"
                        >
                            {preview ? (
                                <div className="video-preview-wrapper">
                                    <video
                                        src={preview}
                                        className="preview-video"
                                        muted
                                        controls={false}
                                        aria-label="Video preview"
                                    />
                                    <div className="video-overlay">
                                        <div className="video-info">
                                            <span className="video-size">
                                                {video
                                                    ? (video.size / (1024 * 1024)).toFixed(2)
                                                    : 0}{" "}
                                                MB
                                            </span>
                                        </div>
                                        <div className="change-video">
                                            <svg className="replace-icon" viewBox="0 0 24 24">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5 5 5M12 15V5" />
                                            </svg>
                                            Replace Video
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="upload-prompt">
                                    <svg className="upload-icon" viewBox="0 0 24 24">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                    <div className="upload-instructions">
                                        <p className="upload-primary-text">Select a video to upload</p>
                                        <p className="upload-secondary-text">or drag and drop here</p>
                                    </div>
                                    <p className="upload-requirements">
                                        MP4, WebM or QuickTime • Max 100MB
                                    </p>
                                </div>
                            )}
                        </motion.div>
                        <input
                            id="video-upload"
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="file-input"
                            aria-describedby="video-error"
                            required
                        />
                    </label>
                </div>

                <div className="form-messages">
                    <AnimatePresence>
                        {(isError || error) && (
                            <motion.div
                                className="error-message"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                role="alert"
                                id="video-error"
                            >
                                <svg className="message-icon" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                                {error || mutationError?.message || "Failed to upload video"}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isSuccess && (
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
                                Video uploaded successfully! Processing may take a few minutes.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="form-actions">
                    <motion.button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                            setTitle("");
                            setVideo(null);
                            setPreview(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                    >
                        Cancel
                    </motion.button>

                    <motion.button
                        type="submit"
                        className="primary-button"
                        disabled={isLoading || !title.trim() || !video}
                        whileHover={{ scale: isLoading ? 1 : 1.03 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="spinner" viewBox="0 0 24 24">
                                    <circle className="spinner-circle" cx="12" cy="12" r="10" />
                                    <path className="spinner-path" d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z" />
                                </svg>
                                Uploading...
                            </>
                        ) : (
                            "Upload Video"
                        )}
                    </motion.button>
                </div>
            </motion.form>
        </motion.div>
    );
};

export default AddVideos;