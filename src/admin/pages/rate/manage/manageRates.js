import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRatesQuery, useUpdateRateMutation, useDeleteRateMutation } from "../../../hooks/rate/useRatesQuery";
import "./ManageRates.css";

const ManageRates = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [editGoldRate, setEditGoldRate] = useState("");
    const [editSilverRate, setEditSilverRate] = useState("");
    const [editCreatedBy, setEditCreatedBy] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const { data: rates, isLoading, error: queryError } = useRatesQuery();
    console.log("today rate ", rates);
    const { mutate: updateRate, isLoading: isUpdating } = useUpdateRateMutation();
    const { mutate: deleteRate, isLoading: isDeleting } = useDeleteRateMutation();

    const handleEditClick = (rate) => {
        setSelectedId(rate.id);
        setEditGoldRate(rate.goldRate.toString());
        setEditSilverRate(rate.silverRate.toString());
        setEditCreatedBy(rate.createdBy);
        setError(null);
    };

    const handleSaveEdit = (id) => {
        const gold = parseFloat(editGoldRate);
        const silver = parseFloat(editSilverRate);
        if (isNaN(gold) || gold <= 0) {
            setError("Gold rate must be a positive number");
            return;
        }
        if (isNaN(silver) || silver <= 0) {
            setError("Silver rate must be a positive number");
            return;
        }
        if (!editCreatedBy.trim()) {
            setError("Created by is required");
            return;
        }
        if (editCreatedBy.length > 50) {
            setError("Created by must be less than 50 characters");
            return;
        }

        const rateData = { goldRate: gold, silverRate: silver, createdBy: editCreatedBy };
        updateRate(
            { id, rateData },
            {
                onSuccess: () => {
                    setSuccess("Rate updated successfully!");
                    setSelectedId(null);
                    setEditGoldRate("");
                    setEditSilverRate("");
                    setEditCreatedBy("");
                    setTimeout(() => setSuccess(null), 3000);
                },
                onError: (err) => {
                    console.error("Update rate error:", err);
                    setError(err.response?.data?.message || "Failed to update rate");
                },
            }
        );
    };

    const handleCancelEdit = () => {
        setSelectedId(null);
        setEditGoldRate("");
        setEditSilverRate("");
        setEditCreatedBy("");
        setError(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this rate?")) {
            deleteRate(id, {
                onSuccess: () => {
                    setSuccess("Rate deleted successfully!");
                    setTimeout(() => setSuccess(null), 3000);
                },
                onError: (err) => {
                    console.error("Delete rate error:", err);
                    setError(err.response?.data?.message || "Failed to delete rate");
                },
            });
        }
    };

    return (
        <motion.div
            className="manage-rates-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            role="region"
            aria-labelledby="manage-rates-heading"
        >
            <header className="table-header">
                <h1 id="manage-rates-heading" className="table-heading">Manage Rates</h1>
                <p className="table-subheading">View and update gold and silver rates</p>
            </header>

            <AnimatePresence>
                {error && (
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
                        {error}
                    </motion.div>
                )}
                {success && (
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
                        {success}
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading rates...</p>
                </div>
            ) : queryError ? (
                <p className="error-message">Error loading rates: {queryError.message}</p>
            ) : !rates?.data?.length ? (
                <p className="no-data-text">No rates available.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="rates-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Gold Rate (₹/g)</th>
                                <th>Silver Rate (₹/g)</th>
                                <th>Created By</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rates.data.map((rate) => (
                                <tr key={rate.id}>
                                    <td>{rate.id}</td>
                                    <td>
                                        {selectedId === rate.id ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editGoldRate}
                                                onChange={(e) => setEditGoldRate(e.target.value)}
                                                className="edit-input"
                                                aria-label="Edit Gold Rate"
                                            />
                                        ) : (
                                                `₹${parseFloat(rate.goldRate || 0).toFixed(2)}`

                                        )}
                                    </td>
                                    <td>
                                        {selectedId === rate.id ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editSilverRate}
                                                onChange={(e) => setEditSilverRate(e.target.value)}
                                                className="edit-input"
                                                aria-label="Edit Silver Rate"
                                            />
                                        ) : (
                                                `₹${parseFloat(rate.silverRate || 0).toFixed(2)}`

                                        )}
                                    </td>
                                    <td>
                                        {selectedId === rate.id ? (
                                            <input
                                                type="text"
                                                value={editCreatedBy}
                                                onChange={(e) => setEditCreatedBy(e.target.value)}
                                                className="edit-input"
                                                aria-label="Edit Created By"
                                                maxLength="50"
                                            />
                                        ) : (
                                            rate.createdBy
                                        )}
                                    </td>
                                    <td className="action-cell">
                                        {selectedId === rate.id ? (
                                            <div className="action-buttons">
                                                <motion.button
                                                    onClick={() => handleSaveEdit(rate.id)}
                                                    disabled={isUpdating || isDeleting}
                                                    className="action-button save-button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {isUpdating ? "Saving..." : "Save"}
                                                </motion.button>
                                                <motion.button
                                                    onClick={handleCancelEdit}
                                                    disabled={isUpdating || isDeleting}
                                                    className="action-button cancel-button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Cancel
                                                </motion.button>
                                            </div>
                                        ) : (
                                            <div className="action-buttons">
                                                <motion.button
                                                    onClick={() => handleEditClick(rate)}
                                                    disabled={isUpdating || isDeleting}
                                                    className="action-button edit-button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Edit
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleDelete(rate.id)}
                                                    disabled={isUpdating || isDeleting}
                                                    className="action-button delete-button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Delete
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
        </motion.div>
    );
};

export default ManageRates;