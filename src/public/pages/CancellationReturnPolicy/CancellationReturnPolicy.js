import React from 'react';
import { FaTimesCircle, FaExchangeAlt, FaUndo, FaEnvelope, FaWhatsapp, FaPhone } from 'react-icons/fa';
import './CancellationReturnPolicy.css';

const CancellationReturnPolicy = () => {
    return (
        <div className="container py-5 cancellation-return-policy">
            <h1 className="text-center mb-5 main-heading">Cancellation & Return Policy</h1>

            {/* Order Cancellation */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaTimesCircle className="icon cancellation-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Order Cancellation</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">1</span>
                                    Orders can be cancelled within <strong>2 hours</strong> of placement via:
                                    <div className="d-flex gap-3 mt-2">
                                        <span className="text-primary"><FaEnvelope className="me-1" /> Email</span>
                                        <span className="text-success"><FaWhatsapp className="me-1" /> WhatsApp</span>
                                        <span className="text-danger"><FaPhone className="me-1" /> Phone</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">2</span>
                                    Cancellation requests <strong>after dispatch</strong> or for <strong>customized products</strong> will not be entertained
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">3</span>
                                    For prepaid cancellations within the allowed period, <strong>full refund</strong> will be issued within <strong>7–10 days</strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Return Policy */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaUndo className="icon return-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Return Policy</h2>
                            <p className="card-text mb-3">
                                We strive for <strong>100% customer satisfaction</strong>. However, we accept returns only under these conditions:
                            </p>
                            <ul className="list-group list-group-flush mb-4">
                                <li className="list-group-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    Item received is <strong>damaged, defective, or incorrect</strong>
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    Return request must be raised within <strong>48 hours</strong> of delivery
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    Product should be <strong>unused, unworn, unwashed</strong> with original <strong>tags, invoice, packaging, and certificates</strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Non-Returnable Items */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaTimesCircle className="icon nonreturnable-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Non-Returnable Items</h2>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="p-3 mb-3 bg-light rounded">
                                        <h5>Customised Products</h5>
                                        <p className="mb-0">Made-to-order or personalized items</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 mb-3 bg-light rounded">
                                        <h5>Used/Tampered Items</h5>
                                        <p className="mb-0">Showing signs of use or tampering</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded">
                                        <h5>Gold-Polished Items</h5>
                                        <p className="mb-0">Due to handmade nature and lighting variations</p>
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
                        <div className="icon-wrapper me-4">
                            <FaExchangeAlt className="icon procedure-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Return Procedure</h2>
                            <div className="steps">
                                <div className="step">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        <strong>Contact Us</strong> with order ID and product pictures showing defect/damage via:
                                        <div className="d-flex gap-3 mt-2">
                                            <span className="text-primary"><FaEnvelope className="me-1" /> Email</span>
                                            <span className="text-success"><FaWhatsapp className="me-1" /> WhatsApp</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        Our team will <strong>review</strong> and approve return if eligible
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        <strong>Reverse pickup</strong> arranged where available, otherwise customer to courier to our return address
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">4</div>
                                    <div className="step-content">
                                        After quality check, <strong>refund/replacement</strong> will be processed
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-info mt-4">
                                <strong>Note:</strong> Refunds will be credited to the original payment method within 7-10 business days after approval
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancellationReturnPolicy;