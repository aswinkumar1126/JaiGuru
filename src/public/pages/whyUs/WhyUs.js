import React from 'react';
import { useCompany } from '../../context/authContext/companyName/CompanyContext';
import './WhyUs.css';

function WhyUs() {
    const { companyName } = useCompany();

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
                    <h1>Why Choose <span className="highlight">{companyName}</span>?</h1>
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
                        At {companyName}, we take pride in our legacy of trust, elegance, and excellence.
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
                    <h2>Experience the {companyName} Difference</h2>
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
                            <h3>Tiruvallur Showroom</h3>
                            <address>
                                712, TNHB, Kakkalur Bypass Road<br />
                                Tiruvallur - 602001
                            </address>
                        </div>

                        <div className="address-card">
                            <h3>Tiruttani Showroom</h3>
                            <address>
                                321/322 Ma Po Si Salai<br />
                                Tiruttani
                            </address>
                        </div>

                        <div className="address-card">
                            <h3>Jn Road Showroom</h3>
                            <address>
                                10, Jn Road, Opposite to Tiruvallur Municipality<br />
                                Tiruvallur - 602001<br />
                                Mobile: 8220771862
                            </address>
                        </div>
                    </div>

                    <div className="contact-info">
                        <h3>Contact Us</h3>
                        <div className="contact-numbers">
                            <a href="tel:9600972227">96009 72227</a>
                            <a href="tel:8220771862">82207 71862</a>
                            <a href="tel:9169161469">91691 61469</a>
                        </div>
                    </div>

                    <p className="note">* Shop images and virtual tour coming soon</p>
                </div>
            </section>
        </div>
    );
}

export default WhyUs;