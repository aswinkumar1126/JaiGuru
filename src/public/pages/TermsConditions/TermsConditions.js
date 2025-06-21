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
import './TermsConditions.css';

const TermsConditions = () => {
    return (
        <div className="container py-5 terms-conditions">
            <h1 className="text-center mb-5 main-heading">Terms & Conditions</h1>

            {/* 1. Product Representation */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaImage className="icon product-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">1. Product Representation</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Images are for reference only.</strong> Minor variations in color or finish may occur due to lighting or screen settings.
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    All products are <strong>handcrafted</strong>, so slight irregularities are natural and part of their charm.
                                </li>
                            </ul>
                            <div className="alert alert-info mt-3">
                                For exact details, please check product descriptions or contact us before ordering.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Pricing */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaTag className="icon price-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">2. Pricing</h2>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="p-3 h-100 bg-light rounded">
                                        <h5>Currency & Taxes</h5>
                                        <p className="mb-0">
                                            All prices are in <strong>INR</strong> and inclusive of <strong>GST</strong> unless specified
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="p-3 h-100 bg-light rounded">
                                        <h5>Price Changes</h5>
                                        <p className="mb-0">
                                            Prices and offers may change <strong>without prior notice</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-warning mt-2">
                                The final amount charged will be the price displayed at checkout.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Payments */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaCreditCard className="icon payment-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">3. Payments</h2>
                            <p className="card-text mb-3">
                                We accept the following modes of payment:
                            </p>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="p-3 mb-3 bg-success bg-opacity-10 rounded">
                                        <h5>Online Payments</h5>
                                        <ul className="mb-0 ps-3">
                                            <li>UPI</li>
                                            <li>Debit/Credit Cards</li>
                                            <li>Net Banking</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 mb-3 bg-info bg-opacity-10 rounded">
                                        <h5>Cash on Delivery</h5>
                                        <ul className="mb-0 ps-3">
                                            <li>Available for select pin codes</li>
                                            <li>Extra ₹50 COD charge may apply</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Product Use & Care */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaGem className="icon care-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">4. Product Use & Care</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Gold-polished silver jewellery</strong> requires gentle handling. Avoid water, perfumes, and chemicals.
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    Store in a <strong>dry, soft pouch</strong> when not in use.
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    No guarantee is given for the <strong>durability of polish</strong>, as it depends on usage and care.
                                </li>
                            </ul>
                            <div className="alert alert-secondary mt-3">
                                Proper care can extend the life of your jewellery. Ask us for maintenance tips!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Limitation of Liability */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaExclamationTriangle className="icon liability-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">5. Limitation of Liability</h2>
                            <div className="p-3 bg-light rounded">
                                <p className="mb-0">
                                    We are <strong>not liable</strong> for:
                                </p>
                                <ul className="mt-2 mb-0">
                                    <li>Delays, loss, or damages caused during shipping</li>
                                    <li>Force majeure events (natural disasters, strikes, etc.)</li>
                                    <li>Customer misuse or improper care of products</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Intellectual Property */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaCopyright className="icon ip-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">6. Intellectual Property</h2>
                            <div className="p-3 bg-light rounded">
                                <p className="mb-0">
                                    All content including <strong>images, logos, text, and product designs</strong> are the exclusive property of our showroom. No content may be:
                                </p>
                                <ul className="mt-2 mb-0">
                                    <li>Copied, reproduced, or distributed without written consent</li>
                                    <li>Used for commercial purposes</li>
                                    <li>Modified or altered in any way</li>
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
                        <div className="icon-wrapper me-4">
                            <FaBalanceScale className="icon law-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">7. Governing Law</h2>
                            <div className="p-3 bg-light rounded">
                                <p className="mb-0">
                                    These terms are governed by and construed in accordance with the <strong>laws of India</strong>.
                                </p>
                                <p className="mt-2 mb-0">
                                    Any disputes shall be subject to the <strong>exclusive jurisdiction</strong> of courts in <strong>Madurai, Tamil Nadu</strong>.
                                </p>
                            </div>
                            <div className="alert alert-info mt-3">
                                For any queries regarding these terms, please contact us before placing your order.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Last Updated */}
            <div className="alert alert-secondary mt-4 text-center">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
        </div>
    );
};

export default TermsConditions;