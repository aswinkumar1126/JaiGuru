import React from 'react';
import './WhyUs.css';

function WhyUs() {
    const points = [
        { icon: '💎', title: 'Purity Guaranteed', desc: 'Only BIS Hallmarked and certified jewellery.' },
        { icon: '📜', title: 'Certified Jewellery', desc: 'Every piece comes with authenticity certification.' },
        { icon: '🛡️', title: 'Lifetime Buyback Policy', desc: 'We offer a transparent and reliable buyback policy.' },
        { icon: '🤝', title: 'Transparent Pricing', desc: 'Fair rates with no hidden charges.' },
        { icon: '🧑‍🔧', title: 'Skilled Craftsmanship', desc: 'Our artisans bring decades of mastery to every design.' },
        { icon: '📦', title: 'Pan-India Delivery', desc: 'Trusted shipping services across India.' }
    ];

    return (
        <div className="whyus-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Why Choose <span className="highlight">BMG Jewellers</span>?</h1>
                    <p className="subtitle">Crafting trust with every sparkle since 1985</p>
                    <div className="divider"></div>
                </div>
            </section>

            {/* Core Highlights */}
            <section className="reasons-section">
                <div className="section-header">
                    <h2>Our Commitment to Excellence</h2>
                    <p>What sets us apart in the world of fine jewellery</p>
                </div>
                <div className="reasons-grid">
                    {points.map((point, index) => (
                        <div key={index} className="reason-card">
                            <div className="icon-circle">{point.icon}</div>
                            <h3>{point.title}</h3>
                            <p>{point.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Legacy Section */}
            <section className="legacy-section">
                <div className="legacy-content">
                    <h2>Our Legacy of Trust</h2>
                    <div className="divider"></div>
                    <p>
                        At BMG Jewellers, we take pride in our legacy of trust, elegance, and excellence.
                        From our humble beginnings in Madurai, we've grown into a name synonymous with
                        purity and craftsmanship. Our skilled artisans and customer-first philosophy have
                        made us one of the most beloved jewellers in Tamil Nadu.
                    </p>
                    <div className="stats-container">
                        <div className="stat-item">
                            <div className="stat-number">35+</div>
                            <div className="stat-label">Years in Business</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">50,000+</div>
                            <div className="stat-label">Happy Customers</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">100%</div>
                            <div className="stat-label">BIS Certified</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Experience the BMG Difference</h2>
                    <p>Discover our exquisite collection crafted with passion and precision</p>
                    <button className="cta-button" onClick={() => window.location.href = '/products'}>
                        Explore Our Collections
                        <span className="arrow">→</span>
                    </button>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="contact-content">
                    <h2>Visit Our Stores</h2>
                    <div className="divider"></div>

                    <div className="address-container">
                        <div className="address-card">
                            <h3>Registered Office</h3>
                            <address>
                                M/s. BMG Jewellers Private Limited<br />
                                No. 54, Vaithyanathapuram<br />
                                Thathaneri, Madurai - 625018
                            </address>
                        </div>

                        <div className="address-card">
                            <h3>Showroom Address</h3>
                            <address>
                                M/s. BMG Jewellers Private Limited<br />
                                160, Melamasi Street<br />
                                Madurai - 625001
                            </address>
                        </div>
                    </div>

                    <div className="contact-info">
                        <h3>Contact Us</h3>
                        <div className="contact-numbers">
                            <a href="tel:7094670946">70946 70946</a>
                            <a href="tel:8608596085">86085 96085</a>
                            <a href="tel:8682996829">86829 96829</a>
                        </div>
                        <a href="mailto:info@bmgjewellers.com" className="email-link">info@bmgjewellers.com</a>
                    </div>

                    <p className="note">* Shop images and virtual tour coming soon</p>
                </div>
            </section>
        </div>
    );
}

export default WhyUs;