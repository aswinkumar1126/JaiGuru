import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRatesQuery, useUpdateRateMutation, useDeleteRateMutation } from "../../../hooks/rate/useRatesQuery";
import { FiEdit2, FiTrash2, FiSave, FiX, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import "./ManageRates.css";

const ManageRates = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [editGoldRate, setEditGoldRate] = useState("");
    const [editSilverRate, setEditSilverRate] = useState("");
    const [editCreatedBy, setEditCreatedBy] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const { data: rates, isLoading, error: queryError } = useRatesQuery();
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

        if (isNaN(gold) ){
            setError("Gold rate must be a number");
            return;
        }
        if (gold <= 0) {
            setError("Gold rate must be greater than 0");
            return;
        }
        if (isNaN(silver)) {
            setError("Silver rate must be a number");
            return;
        }
        if (silver <= 0) {
            setError("Silver rate must be greater than 0");
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
                    setTimeout(() => setSuccess(null), 3000);
                },
                onError: (err) => {
                    setError(err.response?.data?.message || "Failed to update rate");
                },
            }
        );
    };

    const handleCancelEdit = () => {
        setSelectedId(null);
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
                        <FiAlertCircle className="message-icon" />
                        {error}
                        <button
                            className="dismiss-message"
                            onClick={() => setError(null)}
                            aria-label="Dismiss error message"
                        >
                            <FiX size={16} />
                        </button>
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
                        <FiCheckCircle className="message-icon" />
                        {success}
                        <button
                            className="dismiss-message"
                            onClick={() => setSuccess(null)}
                            aria-label="Dismiss success message"
                        >
                            <FiX size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading rates...</p>
                </div>
            ) : queryError ? (
                <div className="error-message">
                    <FiAlertCircle className="message-icon" />
                    Error loading rates: {queryError.message}
                </div>
            ) : !rates?.data?.length ? (
                <div className="empty-state">
                    <p className="empty-text">No rates available</p>
                    <p className="empty-subtext">Add new rates to get started</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="rates-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Gold Rate (₹/g)</th>
                                <th>Silver Rate (₹/g)</th>
                                <th>Created By</th>
                                <th className="actions-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rates.data.map((rate) => (
                                <tr key={rate.id} className={selectedId === rate.id ? "editing-row" : ""}>
                                    <td>{rate.id}</td>
                                    <td>
                                        {selectedId === rate.id ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={editGoldRate}
                                                onChange={(e) => setEditGoldRate(e.target.value)}
                                                className="edit-input"
                                                aria-label="Edit Gold Rate"
                                            />
                                        ) : (
                                            `₹${parseFloat(rate.goldRate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        )}
                                    </td>
                                    <td>
                                        {selectedId === rate.id ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={editSilverRate}
                                                onChange={(e) => setEditSilverRate(e.target.value)}
                                                className="edit-input"
                                                aria-label="Edit Silver Rate"
                                            />
                                        ) : (
                                            `₹${parseFloat(rate.silverRate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
                                                    disabled={isUpdating}
                                                    className="action-button save-button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    aria-label="Save changes"
                                                >
                                                    <FiSave className="action-icon" />
                                                    {isUpdating ? "Saving..." : "Save"}
                                                </motion.button>
                                                <motion.button
                                                    onClick={handleCancelEdit}
                                                    disabled={isUpdating}
                                                    className="action-button cancel-button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    aria-label="Cancel editing"
                                                >
                                                    <FiX className="action-icon" />
                                                    Cancel
                                                </motion.button>
                                            </div>
                                        ) : (
                                            <div className="action-buttons">
                                                <motion.button
                                                    onClick={() => handleEditClick(rate)}
                                                    disabled={isDeleting}
                                                    className="action-button edit-button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    aria-label="Edit rate"
                                                >
                                                    <FiEdit2 className="action-icon" />
                                                    <span className="button-text">Edit</span>
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleDelete(rate.id)}
                                                    disabled={isDeleting}
                                                    className="action-button delete-button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    aria-label="Delete rate"
                                                >
                                                    <FiTrash2 className="action-icon" />
                                                    <span className="button-text">Delete</span>
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