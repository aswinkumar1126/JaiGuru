import React from 'react';
import { FaTruck, FaClock, FaMapMarkerAlt, FaBox, FaRupeeSign, FaCheck } from 'react-icons/fa';
import './DeliveryShippingPolicy.css';

const DeliveryShippingPolicy = () => {
    return (
        <div className="container py-5 delivery-shipping-policy">
            <h1 className="text-center mb-5 main-heading">Delivery & Shipping Policy</h1>

            {/* Shipping Coverage */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaMapMarkerAlt className="icon coverage-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Shipping Coverage</h2>
                            <p className="card-text">
                                We currently offer delivery services across all locations in India.
                                <span className="text-muted"> We do not support international shipping at this time.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Processing Time */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaClock className="icon processing-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Processing Time</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <FaCheck className="me-2 text-success" />
                                    Orders are usually processed within 1–3 business days of payment confirmation.
                                </li>
                                <li className="list-group-item">
                                    <FaCheck className="me-2 text-success" />
                                    For custom-made or bulk orders, the processing time may extend to 5–7 business days.
                                </li>
                                <li className="list-group-item">
                                    <FaCheck className="me-2 text-success" />
                                    Orders are processed only on business days (Monday–Saturday), excluding public holidays.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Partners */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaTruck className="icon partners-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Shipping Partners</h2>
                            <p className="card-text mb-3">
                                We partner with leading and reliable courier services to ensure safe and timely delivery:
                            </p>
                            <div className="d-flex flex-wrap align-items-center gap-4 partner-logos">
                                <img src="/images/delhivery-logo.png" alt="Delhivery" className="partner-logo" />
                                <img src="/images/blue-dart-logo.png" alt="Blue Dart" className="partner-logo" />
                                <img src="/images/dtdc-logo.png" alt="DTDC" className="partner-logo" />
                                <img src="/images/india-post-logo.png" alt="India Post" className="partner-logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Charges */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaRupeeSign className="icon charges-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Shipping Charges</h2>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="p-3 mb-3 bg-light rounded">
                                        <h5 className="text-success">Free Shipping</h5>
                                        <p className="mb-0">On all orders above ₹2,000</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 mb-3 bg-light rounded">
                                        <h5>Standard Shipping</h5>
                                        <p className="mb-0">Flat ₹99 charge on orders below ₹2,000</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Time */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaClock className="icon delivery-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Delivery Time</h2>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="p-3 h-100 bg-info bg-opacity-10 rounded">
                                        <h5>Metro Cities</h5>
                                        <p className="mb-0">2–5 business days</p>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="p-3 h-100 bg-warning bg-opacity-10 rounded">
                                        <h5>Tier 2 & Rural Areas</h5>
                                        <p className="mb-0">5–8 business days</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted mb-0">
                                <small>Delivery times may vary based on location and courier partner availability.</small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracking */}
            <div className="card mb-4 policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaBox className="icon tracking-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Tracking Your Order</h2>
                            <p className="card-text">
                                After dispatch, you will receive a tracking number and courier partner details via SMS/email.
                                You can use this to track the shipment in real-time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Packaging */}
            <div className="card policy-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-wrapper me-4">
                            <FaBox className="icon packaging-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-title">Packaging</h2>
                            <p className="card-text">
                                Each product is securely packed using tamper-evident, water-resistant, and cushioned packaging
                                to ensure it reaches you in pristine condition.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryShippingPolicy;