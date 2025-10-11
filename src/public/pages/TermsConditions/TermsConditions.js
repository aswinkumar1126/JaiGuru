import React from 'react';
import {
    FaImage,
    FaTag,
    FaCreditCard,
    FaGem,
    FaExclamationTriangle,
    FaCopyright,
    FaBalanceScale
} from 'react-icons/fa';
import { useCompany } from '../../context/authContext/companyName/CompanyContext';
import './TermsConditions.css';

const TermsConditions = () => {
    const { companyName } = useCompany();

    return (
        <div className="container py-4 terms-conditions">
            <h1 className="text-center mb-4 main-heading">Terms & Conditions</h1>

            {/* 1. Product Representation */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaImage className="icon product-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">1. Product Representation</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Images are for reference only.</strong> Minor color variations may occur.
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    All products are <strong>handcrafted</strong> with natural irregularities.
                                </li>
                            </ul>
                            <div className="alert alert-info mt-2 compact-alert">
                                Check product descriptions or contact us for exact details.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Pricing */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaTag className="icon price-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">2. Pricing</h2>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-light rounded">
                                        <h6 className="fw-bold">Currency & Taxes</h6>
                                        <p className="mb-0 compact-text">
                                            Prices in <strong>INR</strong>, inclusive of <strong>GST</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-light rounded">
                                        <h6 className="fw-bold">Price Changes</h6>
                                        <p className="mb-0 compact-text">
                                            Subject to change <strong>without notice</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-warning mt-2 compact-alert">
                                Final amount charged is the price at checkout.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Payments */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaCreditCard className="icon payment-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">3. Payments</h2>
                            <p className="card-text mb-2">
                                Accepted payment methods:
                            </p>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-success bg-opacity-10 rounded">
                                        <h6 className="fw-bold">Online Payments</h6>
                                        <ul className="mb-0 compact-list">
                                            <li>UPI</li>
                                            <li>Debit/Credit Cards</li>
                                            <li>Net Banking</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-info bg-opacity-10 rounded">
                                        <h6 className="fw-bold">Cash on Delivery</h6>
                                        <ul className="mb-0 compact-list">
                                            <li>Select pin codes only</li>
                                            <li>₹50 COD charge may apply</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Product Use & Care */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaGem className="icon care-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">4. Product Use & Care</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Gold-polished silver:</strong> Avoid water, perfumes, chemicals
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    Store in <strong>dry, soft pouch</strong> when not in use
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    No guarantee for <strong>polish durability</strong>
                                </li>
                            </ul>
                            <div className="alert alert-secondary mt-2 compact-alert">
                                Proper care extends jewellery life. Ask for maintenance tips.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Limitation of Liability */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaExclamationTriangle className="icon liability-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">5. Limitation of Liability</h2>
                            <div className="p-2 bg-light rounded">
                                <p className="mb-1 compact-text">
                                    <strong>{companyName}</strong> is <strong>not liable</strong> for:
                                </p>
                                <ul className="mt-1 mb-0 compact-list">
                                    <li>Shipping delays, loss, or damages</li>
                                    <li>Force majeure events</li>
                                    <li>Customer misuse or improper care</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Intellectual Property */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaCopyright className="icon ip-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">6. Intellectual Property</h2>
                            <div className="p-2 bg-light rounded">
                                <p className="mb-1 compact-text">
                                    All content is exclusive property of <strong>{companyName}</strong>:
                                </p>
                                <ul className="mt-1 mb-0 compact-list">
                                    <li>No copying or distribution without consent</li>
                                    <li>No commercial use</li>
                                    <li>No modifications allowed</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 7. Governing Law */}
            <div className="card policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaBalanceScale className="icon law-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">7. Governing Law</h2>
                            <div className="p-2 bg-light rounded">
                                <p className="mb-1 compact-text">
                                    Governed by <strong>Indian laws</strong>
                                </p>
                                <p className="mb-0 compact-text">
                                    Jurisdiction: Courts in <strong>Madurai, Tamil Nadu</strong>
                                </p>
                            </div>
                            <div className="alert alert-info mt-2 compact-alert">
                                Contact us for any queries before ordering.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          
           
        </div>
    );
};

export default TermsConditions;