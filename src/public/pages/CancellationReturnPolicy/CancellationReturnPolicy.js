import React from 'react';
import { FaTimesCircle, FaExchangeAlt, FaUndo, FaEnvelope, FaWhatsapp, FaPhone } from 'react-icons/fa';
import { useCompany } from '../../context/authContext/companyName/CompanyContext';
import './CancellationReturnPolicy.css';

const CancellationReturnPolicy = () => {
    const { companyName } = useCompany();

    return (
        <div className="container py-4 cancellation-return-policy">
            <h1 className="text-center mb-4 main-heading">Cancellation & Return Policy</h1>

            {/* Order Cancellation */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaTimesCircle className="icon cancellation-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Order Cancellation</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">1</span>
                                    Cancel within <strong>2 hours</strong> via:
                                    <div className="d-flex gap-2 mt-1">
                                        <span className="text-primary compact-text"><FaEnvelope className="me-1" /> Email</span>
                                        <span className="text-success compact-text"><FaWhatsapp className="me-1" /> WhatsApp</span>
                                        <span className="text-danger compact-text"><FaPhone className="me-1" /> Phone</span>
                                    </div>
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">2</span>
                                    No cancellation after <strong>dispatch</strong> or for <strong>customized products</strong>
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">3</span>
                                    Prepaid cancellations: <strong>Full refund</strong> in <strong>7–10 days</strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Return Policy */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaUndo className="icon return-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Return Policy</h2>
                            <p className="card-text mb-2 compact-text">
                                We accept returns under these conditions:
                            </p>
                            <ul className="list-group list-group-flush mb-3">
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    Item <strong>damaged, defective, or incorrect</strong>
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    Request within <strong>48 hours</strong> of delivery
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    Product <strong>unused</strong> with original tags and packaging
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Non-Returnable Items */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaTimesCircle className="icon nonreturnable-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Non-Returnable Items</h2>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-light rounded">
                                        <h6 className="fw-bold">Customised Products</h6>
                                        <p className="mb-0 compact-text">Made-to-order items</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-light rounded">
                                        <h6 className="fw-bold">Used/Tampered Items</h6>
                                        <p className="mb-0 compact-text">Showing signs of use</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-light rounded">
                                        <h6 className="fw-bold">Gold-Polished Items</h6>
                                        <p className="mb-0 compact-text">Handmade nature variations</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Return Procedure */}
            <div className="card policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaExchangeAlt className="icon procedure-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Return Procedure</h2>
                            <div className="steps">
                                <div className="step">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        <strong>Contact {companyName}</strong> with order ID and product pictures
                                        <div className="d-flex gap-2 mt-1">
                                            <span className="text-primary compact-text"><FaEnvelope className="me-1" /> Email</span>
                                            <span className="text-success compact-text"><FaWhatsapp className="me-1" /> WhatsApp</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        Team <strong>review</strong> and approval
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        <strong>Reverse pickup</strong> or customer courier
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">4</div>
                                    <div className="step-content">
                                        Quality check and <strong>refund/replacement</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-info mt-3 compact-alert">
                                <strong>Note:</strong> Refunds credited to original payment method within 7-10 business days
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancellationReturnPolicy;