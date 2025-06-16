import React, { useState } from "react";
import { useResetPassword } from "../../hook/auth/useResetPassword";
import { useNavigate } from "react-router-dom";
import "./AuthStyles.css";

const ResetPasswordPage = () => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const contactNumber = sessionStorage.getItem("contactNumber"); // ✅ fixed
    const { mutate, isLoading } = useResetPassword();
    const navigate = useNavigate();

    const handleReset = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!contactNumber) {
            setError("Session expired. Go back and request OTP again.");
            return;
        }

        const storedOtp = sessionStorage.getItem(`otp_${contactNumber}`);
        if (!storedOtp || otp !== storedOtp) {
            setError("Invalid or expired OTP");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        mutate(
            { contactNumber, otp, newPassword },
            {
                onSuccess: () => {
                    setSuccess("Password reset successfully");
                    sessionStorage.removeItem(`otp_${contactNumber}`);
                    sessionStorage.removeItem("contactNumber");
                    setTimeout(() => navigate("/login"), 2000);
                },
                onError: (err) => {
                    setError(err.message || "Reset failed");
                }
            }
        );
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleReset}>
                <h2>Reset Password</h2>

                <label>Enter OTP</label>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />

                <label>New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                />

                <label>Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                </button>

                {success && <p className="success-msg">{success}</p>}
                {error && <p className="error-msg">{error}</p>}
            </form>
        </div>
    );
};

export default ResetPasswordPage;
