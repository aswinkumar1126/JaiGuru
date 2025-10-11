import React from 'react';
import { FaTruck, FaClock, FaMapMarkerAlt, FaBox, FaRupeeSign, FaCheck } from 'react-icons/fa';
import { useCompany } from '../../context/authContext/companyName/CompanyContext';
import './DeliveryShippingPolicy.css';
import deliverImage from '../../assets/images/delivery/delivery-logo.svg';
import delivery2 from '../../assets/images/delivery/blue dart.png';
import delivery3 from '../../assets/images/delivery/dhl-express.svg';
import delivery4 from '../../assets/images/delivery/india-post.png';

const DeliveryShippingPolicy = () => {
    const { companyName } = useCompany();

    return (
        <div className="container py-4 delivery-shipping-policy">
            <h1 className="text-center mb-4 main-heading">Delivery & Shipping Policy</h1>

            {/* Shipping Coverage */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaMapMarkerAlt className="icon coverage-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Shipping Coverage</h2>
                            <p className="card-text compact-text">
                                We deliver across <strong>all locations in India</strong>.
                                <span className="text-muted"> International shipping not available.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Processing Time */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaClock className="icon processing-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Processing Time</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item compact-item">
                                    <FaCheck className="me-2 text-success" />
                                    Processed in <strong>1–3 business days</strong> after payment
                                </li>
                                <li className="list-group-item compact-item">
                                    <FaCheck className="me-2 text-success" />
                                    Custom orders: <strong>5–7 business days</strong>
                                </li>
                                <li className="list-group-item compact-item">
                                    <FaCheck className="me-2 text-success" />
                                    Processed Monday–Saturday, excluding holidays
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Partners */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaTruck className="icon partners-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Shipping Partners</h2>
                            <p className="card-text mb-2 compact-text">
                                Trusted courier partners for safe, timely delivery:
                            </p>
                            <div className="d-flex flex-wrap align-items-center gap-3 partner-logos">
                                <img src={deliverImage} alt="Delivery" className="partner-logo" />
                                <img src={delivery2} alt="Blue Dart" className="partner-logo" />
                                <img src={delivery3} alt="DHL Express" className="partner-logo" />
                                <img src={delivery4} alt="India Post" className="partner-logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Charges */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaRupeeSign className="icon charges-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Shipping Charges</h2>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-light rounded">
                                        <h6 className="text-success fw-bold">Free Shipping</h6>
                                        <p className="mb-0 compact-text">Orders above ₹2,000</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-light rounded">
                                        <h6 className="fw-bold">Standard Shipping</h6>
                                        <p className="mb-0 compact-text">Flat ₹99 below ₹2,000</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Time */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaClock className="icon delivery-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Delivery Time</h2>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-info bg-opacity-10 rounded">
                                        <h6 className="fw-bold">Metro Cities</h6>
                                        <p className="mb-0 compact-text">2–5 business days</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-2 h-100 bg-warning bg-opacity-10 rounded">
                                        <h6 className="fw-bold">Tier 2 & Rural</h6>
                                        <p className="mb-0 compact-text">5–8 business days</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted mt-2 compact-text">
                                Times may vary based on location and courier availability.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracking */}
            <div className="card mb-3 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaBox className="icon tracking-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Order Tracking</h2>
                            <p className="card-text compact-text">
                                After dispatch, receive tracking details via SMS/email for real-time shipment monitoring.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Packaging */}
            <div className="card policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-3">
                            <FaBox className="icon packaging-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Packaging</h2>
                            <p className="card-text compact-text">
                                Products securely packed with tamper-evident, water-resistant, cushioned packaging for pristine delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryShippingPolicy;