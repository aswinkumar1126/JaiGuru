import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "../../hook/auth/useForgotPassword";
import "./AuthStyles.css";

const ForgotPasswordPage = () => {
    const [contactNumber, setContactNumber] = useState("");
    const [error, setError] = useState("");
    const [isSending, setIsSending] = useState(false);
    

    const { mutateAsync } = useForgotPassword();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSending(true);

        try {
            // Call mutation first
            const result = await mutateAsync({ contactNumber });
            console.log("✅ Forgot Password Result:", result);

            // Save contact and OTP only if success
            sessionStorage.setItem("contactNumber", contactNumber);
            sessionStorage.setItem(`otp_${contactNumber}`, result.otp);

            navigate("/reset-password");
        } catch (err) {
            console.error("❌ Forgot Password Error:", err);
            setError("Something went wrong. Try again.");
        } finally {
            setIsSending(false);
        }
    };
    

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Forgot Password</h2>

                <label>Mobile Number</label>
                <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                    placeholder="Enter your mobile number"
                />

                <button type="submit" disabled={isSending}>
                    {isSending ? "Sending OTP..." : "Send OTP"}
                </button>

                {error && <p className="error-msg">{error}</p>}
            </form>
        </div>
    );
};

export default ForgotPasswordPage;
