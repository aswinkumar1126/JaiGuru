import React from 'react';
import { FaMoneyBillWave, FaClock, FaShippingFast, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useCompany } from '../../context/authContext/companyName/CompanyContext';
import './RefundPolicy.css';

const RefundPolicy = () => {
    const { companyName } = useCompany();

    return (
        <div className="container py-4 refund-policy">
            <h1 className="text-center mb-4 main-heading">Refund Policy</h1>

            {/* Refund Eligibility */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaCheckCircle className="icon eligibility-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Refund Eligibility</h2>
                            <p className="card-text mb-2">
                                Refunds will be initiated only for:
                            </p>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">1</span>
                                    <strong>Cancelled prepaid orders</strong> (before dispatch)
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">2</span>
                                    <strong>Returned items</strong> approved under our Return Policy
                                </li>
                            </ul>
                            <div className="alert alert-warning mt-2 compact-alert">
                                <FaExclamationTriangle className="me-2" />
                                Refunds are not available for orders cancelled after dispatch or for custom-made products
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Mode and Time */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaMoneyBillWave className="icon mode-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Refund Mode and Time</h2>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-light rounded">
                                        <h6 className="fw-bold">Prepaid Orders</h6>
                                        <p className="mb-0 compact-text">
                                            Refund to <strong>original payment method</strong><br />
                                            <span className="text-success">
                                                <FaClock className="me-1" />
                                                <strong>7–10 business days</strong>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-light rounded">
                                        <h6 className="fw-bold">Cash on Delivery</h6>
                                        <p className="mb-0 compact-text">
                                            Refund via <strong>NEFT/IMPS</strong><br />
                                            <span className="text-success">
                                                <FaClock className="me-1" />
                                                <strong>7–10 business days</strong>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-info mt-2 compact-alert">
                                <strong>Note:</strong> Processing time depends on your bank/payment gateway
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Charge Refunds */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaShippingFast className="icon shipping-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Shipping Charge Refunds</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-secondary me-2">✗</span>
                                    <strong>Shipping charges are non-refundable</strong>
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    Refunded if return is due to <strong>company error</strong>
                                </li>
                            </ul>
                            <div className="mt-2 p-2 bg-light rounded">
                                <p className="mb-0 compact-text">
                                    <strong>Example:</strong> Wrong or defective item refund includes product amount and shipping
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delayed or Missing Refunds */}
            <div className="card policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaExclamationTriangle className="icon missing-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Delayed or Missing Refunds</h2>
                            <p className="card-text mb-2">
                                If you haven't received your refund:
                            </p>
                            <div className="steps">
                                <div className="step">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        Check your <strong>bank account</strong> and notifications
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        Contact your <strong>bank or payment gateway</strong>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        Contact <strong>{companyName}</strong> support with:
                                        <ul className="mt-1 compact-list">
                                            <li>Order number</li>
                                            <li>Refund request date</li>
                                            <li>Payment method</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-warning mt-2 compact-alert">
                                <FaClock className="me-2" />
                                Allow <strong>10 business days</strong> before contacting support
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;