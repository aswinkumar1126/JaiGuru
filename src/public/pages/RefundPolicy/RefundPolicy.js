import React from 'react';
import { FaMoneyBillWave, FaClock, FaShippingFast, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import './RefundPolicy.css';

const RefundPolicy = () => {
    return (
        <div className="container py-5 refund-policy">
            <h1 className="text-center mb-5 main-heading">Refund Policy</h1>

            {/* Refund Eligibility */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaCheckCircle className="icon eligibility-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Refund Eligibility</h2>
                            <p className="card-text mb-3">
                                Refunds will be initiated only for:
                            </p>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">1</span>
                                    <strong>Cancelled prepaid orders</strong> (before dispatch)
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">2</span>
                                    <strong>Returned items</strong> approved under our Return Policy
                                </li>
                            </ul>
                            <div className="alert alert-warning mt-3">
                                <FaExclamationTriangle className="me-2" />
                                Refunds are not available for orders cancelled after dispatch or for custom-made products
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Mode and Time */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaMoneyBillWave className="icon mode-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Refund Mode and Time</h2>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="p-3 h-100 bg-light rounded">
                                        <h5>Prepaid Orders</h5>
                                        <p className="mb-0">
                                            Refund to <strong>original payment method</strong> (UPI, card, net banking)<br />
                                            <span className="text-success">
                                                <FaClock className="me-1" />
                                                Processed within <strong>7–10 business days</strong>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="p-3 h-100 bg-light rounded">
                                        <h5>Cash on Delivery (COD)</h5>
                                        <p className="mb-0">
                                            Refund via <strong>NEFT/IMPS</strong> to provided bank account<br />
                                            <span className="text-success">
                                                <FaClock className="me-1" />
                                                Processed within <strong>7–10 business days</strong>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-info mt-2">
                                <strong>Note:</strong> Refund processing time depends on your bank/payment gateway and may take additional 2-3 days to reflect in your account
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Charge Refunds */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaShippingFast className="icon shipping-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Shipping Charge Refunds</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <span className="badge bg-secondary me-2">✗</span>
                                    <strong>Shipping charges are non-refundable</strong> in most cases
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    <strong>Exception:</strong> Refunded if return is due to <strong>our mistake</strong> (wrong or defective item)
                                </li>
                            </ul>
                            <div className="mt-3 p-3 bg-light rounded">
                                <p className="mb-0">
                                    <strong>Example:</strong> If you received a wrong item, we'll refund both product amount and shipping charges
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
                        <div className="icon-wrapper me-4">
                            <FaExclamationTriangle className="icon missing-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Delayed or Missing Refunds</h2>
                            <p className="card-text mb-3">
                                If you haven't received your refund yet:
                            </p>
                            <div className="steps">
                                <div className="step">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        First, <strong>check your bank account</strong> (including spam/junk folders for UPI notifications)
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        Then contact your <strong>bank or payment gateway</strong> (sometimes delays occur at their end)
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        If still unresolved, contact our <strong>support team</strong> with:
                                        <ul className="mt-2">
                                            <li>Order number</li>
                                            <li>Refund request date</li>
                                            <li>Payment method details</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-warning mt-3">
                                <FaClock className="me-2" />
                                Please allow <strong>full 10 business days</strong> for refund processing before contacting support
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;