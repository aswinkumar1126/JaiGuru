import React, { useState } from "react";
import {
    useUpdateBannerMutation,
    useDeleteBannerMutation,
} from "../../../hooks/banners/useUploadBannerMutation";
import { useBannersQuery } from "../../../hooks/banners/useBannersQuery";
import "./ManageBanners.css";

// Base URL for images
const BASE_IMAGE_URL = "https://app.bmgjewellers.com";

const ManageBanner = () => {
    const [selectedId, setSelectedId] = useState(null); // Tracks the row being edited
    const [editFile, setEditFile] = useState(null); // File for updating image
    const [editTitle, setEditTitle] = useState(""); // Title for updating
    const [errorMessage, setErrorMessage] = useState(""); // Error feedback
    const [successMessage, setSuccessMessage] = useState(""); // Success feedback
   

    const { data: banners, isLoading, error } = useBannersQuery();
    console.log("Banners data:", banners); // Debug: Check data structure

    const { mutate: updateBanner, isLoading: isUpdating } = useUpdateBannerMutation();
    const { mutate: deleteBanner, isLoading: isDeleting } = useDeleteBannerMutation();

    // Start editing a row
    const handleEditClick = (banner) => {
        setSelectedId(banner.id);
        setEditFile(null); // Reset file input
        setEditTitle(banner.title); // Pre-fill with current title
        setErrorMessage("");
    };

    // Handle file change for edit
    const handleEditFileChange = (e) => {
        setEditFile(e.target.files[0]);
        setErrorMessage("");
    };

    // Handle title change for edit
    const handleEditTitleChange = (e) => {
        setEditTitle(e.target.value);
        setErrorMessage("");
    };

  

    // Handle save edit
    const handleSaveEdit = (id) => {
        if (!editFile) {
            setErrorMessage("Please select an image to update.");
            return;
        }
        updateBanner(
            { image: editFile, id },
            {
                onSuccess: () => {
                    setSuccessMessage("Banner updated successfully!");
                    setSelectedId(null); // Exit edit mode
                    setEditFile(null);
                    setEditTitle("");
                    setTimeout(() => setSuccessMessage(""), 3000);
                },
                onError: (error) => {
                    setErrorMessage(error.response?.data?.error || "Failed to update banner.");
                },
            }
        );
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setSelectedId(null);
        setEditFile(null);
        setEditTitle("");
        setErrorMessage("");
    };

    // Handle delete banner
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            deleteBanner(id, {
                onSuccess: () => {
                    setSuccessMessage("Banner deleted successfully!");
                    setTimeout(() => setSuccessMessage(""), 3000);
                },
                onError: (error) => {
                    setErrorMessage(error.response?.data?.error || "Failed to delete banner.");
                },
            });
        }
    };

    return (
        <div className="manage-banner-container">
            <h2>🖼️ Manage Banners</h2>

    

            {/* Feedback Messages */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {/* Banners Table */}
            {isLoading ? (
                <p>Loading banners...</p>
            ) : error ? (
                <p className="error-message">Error loading banners: {error.message}</p>
            ) : !banners?.data?.length ? (
                <p>No banners available.</p>
            ) : (
                <table className="banner-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>
                                    {selectedId === item.id ? (
                                        <input
                                            type="file"
                                            onChange={handleEditFileChange}
                                            accept="image/*"
                                        />
                                    ) : (
                                        <img
                                            src={`${BASE_IMAGE_URL}${item.image_path}`}
                                            alt={`banner-${item.id}`}
                                            width="100"
                                            onError={(e) => (e.target.src = "/fallback-image.jpg")}
                                        />
                                    )}
                                    {editFile && selectedId === item.id && (
                                        <p>Selected File: {editFile.name}</p>
                                    )}
                                </td>
                                <td>
                                    {selectedId === item.id ? (
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={handleEditTitleChange}
                                            placeholder="Enter banner title"
                                        />
                                    ) : (
                                        item.title
                                    )}
                                </td>
                                <td>
                                    {selectedId === item.id ? (
                                        <>
                                            <button
                                                onClick={() => handleSaveEdit(item.id)}
                                                disabled={!editFile || isUpdating}
                                            >
                                                {isUpdating ? "Saving..." : "Save"}
                                            </button>{" "}
                                            <button onClick={handleCancelEdit} disabled={isUpdating}>
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEditClick(item)}
                                                disabled={isUpdating || isDeleting }
                                            >
                                                ✏️ Edit
                                            </button>{" "}
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={isUpdating || isDeleting }
                                            >
                                                🗑️ Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManageBanner;