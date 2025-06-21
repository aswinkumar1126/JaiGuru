import React from 'react';
import {
    FaShieldAlt,
    FaDatabase,
    FaChartLine,
    FaShareAlt,
    FaLock,
    FaCookieBite
} from 'react-icons/fa';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="container py-5 privacy-policy">
            <h1 className="text-center mb-5 main-heading">Privacy Policy</h1>

            {/* 1. Introduction */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaShieldAlt className="icon intro-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">1. Introduction</h2>
                            <p className="card-text">
                                Your privacy is extremely important to us. This policy outlines how we collect, use, and safeguard your information when you use our website or services.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Data Collected */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaDatabase className="icon data-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">2. Data Collected</h2>
                            <p className="card-text mb-3">
                                We collect the following personal information:
                            </p>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Name</strong> and contact details
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Email address</strong> and <strong>phone number</strong>
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Shipping and billing address</strong>
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Payment details</strong> (processed securely through third-party gateways)
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Device and browser information</strong> (via cookies)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. How We Use Your Data */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaChartLine className="icon usage-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">3. How We Use Your Data</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    To <strong>process orders</strong> and payments
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    To communicate <strong>order updates, offers, and support</strong>
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    To <strong>improve our website</strong> and customer experience
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    For <strong>internal analytics</strong> and reporting
                                </li>
                            </ul>
                            <div className="alert alert-info mt-3">
                                We only process data necessary for providing our services to you.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Data Sharing */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaShareAlt className="icon sharing-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">4. Data Sharing</h2>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="p-3 h-100 bg-danger bg-opacity-10 rounded">
                                        <h5>We Do Not</h5>
                                        <ul className="mb-0 ps-3">
                                            <li>Sell or rent your personal data</li>
                                            <li>Share with marketing companies</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="p-3 h-100 bg-success bg-opacity-10 rounded">
                                        <h5>We May Share With</h5>
                                        <ul className="mb-0 ps-3">
                                            <li>Courier services for delivery</li>
                                            <li>Payment gateways for processing</li>
                                            <li>Legal authorities when required</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted mt-2">
                                <small>All third parties are contractually obligated to protect your data.</small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Security Measures */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaLock className="icon security-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">5. Security Measures</h2>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="p-3 mb-3 bg-light rounded">
                                        <h5>Encryption</h5>
                                        <p className="mb-0">
                                            All transactions use <strong>SSL (Secure Socket Layer)</strong> technology
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 mb-3 bg-light rounded">
                                        <h5>Data Storage</h5>
                                        <p className="mb-0">
                                            Information stored on <strong>secure servers</strong> with regular monitoring
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-warning mt-2">
                                While we implement strong security, no internet transmission is 100% secure
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Cookies */}
            <div className="card policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaCookieBite className="icon cookie-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">6. Cookies</h2>
                            <p className="card-text mb-3">
                                Our website uses cookies for:
                            </p>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <div className="p-3 h-100 bg-info bg-opacity-10 rounded text-center">
                                        <h5>Performance</h5>
                                        <p className="mb-0">Site functionality</p>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="p-3 h-100 bg-info bg-opacity-10 rounded text-center">
                                        <h5>Analytics</h5>
                                        <p className="mb-0">Visitor statistics</p>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="p-3 h-100 bg-info bg-opacity-10 rounded text-center">
                                        <h5>Personalization</h5>
                                        <p className="mb-0">User preferences</p>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-light mt-3">
                                You can <strong>disable cookies</strong> in your browser settings, but some site features may not work properly
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Policy Update Notice */}
            <div className="alert alert-secondary mt-4">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()} - We may update this policy periodically
            </div>
        </div>
    );
};

export default PrivacyPolicy;