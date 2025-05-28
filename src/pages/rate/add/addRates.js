import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateRateMutation } from "../../../hooks/rate/useRatesQuery";
import "./AddRates.css";

const AddRates = () => {
    const [goldRate, setGoldRate] = useState("");
    const [silverRate, setSilverRate] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const { mutate: createRate, isLoading, isError, error: mutationError, isSuccess } =
        useCreateRateMutation();

    // Reset success state after 5 seconds
    useEffect(() => {
        if (isSuccess) {
            setSuccess("Rate created successfully!");
            const timer = setTimeout(() => {
                setSuccess(null);
                setGoldRate("");
                setSilverRate("");
                setCreatedBy("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        const gold = parseFloat(goldRate);
        const silver = parseFloat(silverRate);
        if (isNaN(gold) || gold <= 0) {
            setError("Gold rate must be a positive number");
            return;
        }
        if (isNaN(silver) || silver <= 0) {
            setError("Silver rate must be a positive number");
            return;
        }
        if (!createdBy.trim()) {
            setError("Created by is required");
            return;
        }
        if (createdBy.length > 50) {
            setError("Created by must be less than 50 characters");
            return;
        }

        createRate(
            { goldRate: gold, silverRate: silver, createdBy },
            {
                onError: (err) => {
                    console.error("Create rate error:", err);
                    setError(err.response?.data?.error || "Failed to create rate");
                },
            }
        );
    };

    return (
        <motion.div
            className="add-rates-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            role="region"
            aria-labelledby="add-rates-heading"
        >
            <header className="form-header">
                <h1 id="add-rates-heading" className="form-heading">Add New Rate</h1>
                <p className="form-subheading">Enter gold and silver rates</p>
            </header>

            <motion.form
                onSubmit={handleSubmit}
                className="add-rates-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                noValidate
            >
                <div className="form-group">
                    <label htmlFor="gold-rate" className="form-label">
                        Gold Rate (per gram)
                        <span className="required-indicator" aria-hidden="true">*</span>
                    </label>
                    <input
                        id="gold-rate"
                        type="number"
                        step="0.01"
                        value={goldRate}
                        onChange={(e) => setGoldRate(e.target.value)}
                        placeholder="Enter gold rate"
                        className="form-input"
                        aria-label="Gold Rate"
                        aria-required="true"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="silver-rate" className="form-label">
                        Silver Rate (per gram)
                        <span className="required-indicator" aria-hidden="true">*</span>
                    </label>
                    <input
                        id="silver-rate"
                        type="number"
                        step="0.01"
                        value={silverRate}
                        onChange={(e) => setSilverRate(e.target.value)}
                        placeholder="Enter silver rate"
                        className="form-input"
                        aria-label="Silver Rate"
                        aria-required="true"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="created-by" className="form-label">
                        Created By
                        <span className="required-indicator" aria-hidden="true">*</span>
                    </label>
                    <input
                        id="created-by"
                        type="text"
                        value={createdBy}
                        onChange={(e) => setCreatedBy(e.target.value)}
                        placeholder="Enter your name"
                        className="form-input"
                        aria-label="Created By"
                        aria-required="true"
                        maxLength="50"
                        required
                    />
                    <div className="character-count">{createdBy.length}/50</div>
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
                            >
                                <svg className="message-icon" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                                {error || mutationError?.message || "Failed to create rate"}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
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
                </div>

                <div className="form-actions">
                    <motion.button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                            setGoldRate("");
                            setSilverRate("");
                            setCreatedBy("");
                            setError(null);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                    >
                        Clear
                    </motion.button>
                    <motion.button
                        type="submit"
                        className="primary-button"
                        disabled={isLoading || !goldRate || !silverRate || !createdBy.trim()}
                        whileHover={{ scale: isLoading ? 1 : 1.03 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        aria-busy={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create Rate"}
                    </motion.button>
                </div>
            </motion.form>
        </motion.div>
    );
};

export default AddRates;