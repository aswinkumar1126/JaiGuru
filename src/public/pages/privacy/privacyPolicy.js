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
import { useCompany } from '../../context/authContext/companyName/CompanyContext';

const PrivacyPolicy = () => {
    const { companyName } = useCompany();
    return (
        <div className="container py-4 privacy-policy">
            <h1 className="text-center mb-4 main-heading">Privacy Policy</h1>

            {/* 1. Introduction */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaShieldAlt className="icon intro-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">1. Introduction</h2>
                            <p className="card-text">
                                At <strong>{companyName}</strong>, we prioritize your privacy.
                                This policy details how we collect, use, and protect your information when you engage with our services.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Data Collected */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaDatabase className="icon data-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">2. Data Collected</h2>
                            <p className="card-text mb-2">
                                We collect essential information to deliver our services effectively:
                            </p>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Name</strong> and contact information
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Email address</strong> and <strong>phone number</strong>
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Service address</strong> and location details
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Payment information</strong> (securely processed via trusted gateways)
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Technical data</strong> (cookies and browser information)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. How We Use Your Data */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaChartLine className="icon usage-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">3. How We Use Your Data</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    To <strong>process service requests</strong> and transactions
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    For <strong>client communication</strong> and support
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    To <strong>enhance service delivery</strong> and user experience
                                </li>
                                <li className="list-group-item compact-item">
                                    <span className="badge bg-success me-2">✓</span>
                                    For <strong>business analytics</strong> and operational improvement
                                </li>
                            </ul>
                            <div className="alert alert-info mt-2 compact-alert">
                                We process only data essential for service provision.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Data Sharing */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaShareAlt className="icon sharing-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">4. Data Sharing</h2>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-danger bg-opacity-10 rounded">
                                        <h6 className="fw-bold">We Do Not</h6>
                                        <ul className="mb-0 ps-3 compact-list">
                                            <li>Sell or rent personal data</li>
                                            <li>Share with unauthorized third parties</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-success bg-opacity-10 rounded">
                                        <h6 className="fw-bold">We May Share With</h6>
                                        <ul className="mb-0 ps-3 compact-list">
                                            <li>Service providers for operational needs</li>
                                            <li>Payment processing partners</li>
                                            <li>Legal entities when required</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted mt-2 compact-text">
                                All partners are contractually bound to protect your data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Security Measures */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaLock className="icon security-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">5. Security Measures</h2>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <div className="p-2 mb-2 bg-light rounded">
                                        <h6 className="fw-bold">Encryption</h6>
                                        <p className="mb-0 compact-text">
                                            All data transmissions use <strong>SSL encryption</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-2 mb-2 bg-light rounded">
                                        <h6 className="fw-bold">Data Storage</h6>
                                        <p className="mb-0 compact-text">
                                            Information stored on <strong>secured servers</strong> with monitoring
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-warning mt-2 compact-alert">
                                While we implement robust security, no internet transmission is entirely risk-free.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Cookies */}
            <div className="card policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaCookieBite className="icon cookie-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">6. Cookies</h2>
                            <p className="card-text mb-2">
                                Our website utilizes cookies for:
                            </p>
                            <div className="row g-2">
                                <div className="col-md-4">
                                    <div className="p-2 h-100 bg-info bg-opacity-10 rounded text-center">
                                        <h6 className="fw-bold">Performance</h6>
                                        <p className="mb-0 compact-text">Site functionality</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-2 h-100 bg-info bg-opacity-10 rounded text-center">
                                        <h6 className="fw-bold">Analytics</h6>
                                        <p className="mb-0 compact-text">Visitor insights</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-2 h-100 bg-info bg-opacity-10 rounded text-center">
                                        <h6 className="fw-bold">Personalization</h6>
                                        <p className="mb-0 compact-text">User preferences</p>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-light mt-2 compact-alert">
                                You may <strong>disable cookies</strong> in browser settings, though some features may be limited.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        
        </div>
    );
};

export default PrivacyPolicy;