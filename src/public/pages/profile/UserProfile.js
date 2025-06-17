import React, { useEffect, useState } from 'react';
import { useCurrentProfile } from '../../hook/userProfile/useUserProfileQuery';
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import './UserProfile.css';
import SkeletonLoader from '../../components/loader/SkeletonLoader';
import Error from '../../components/error/Error';

const UserProfile = () => {
    const { data: user, isLoading, error, refetch } = useCurrentProfile();
    const [activeTab, setActiveTab] = useState('profile');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

   

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isLoading) return (
        <div className="user-profile-wrapper">
            <SkeletonLoader
                count={5}
                height={100}
                className="profile-skeleton"
                style={{ maxWidth: '1200px', margin: '0 auto' }}
            />
        </div>
    );

    if (error || !user) return (
        <div className="user-profile-wrapper">
            <Error
                message="Failed to load profile"
                description="We couldn't load your profile information. Please try again."
                onRetry={refetch}
            />
        </div>
    );

    return (
        <div className="user-profile-container">
            {/* Mobile Navigation */}
            <header className={`mobile-header ${isScrolled ? 'scrolled' : ''}`}>
                <button
                    variant="icon"
                    className="menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
                <h1>My Account</h1>
                <div className="mobile-user-avatar">
                    {user.username?.charAt(0).toUpperCase()}
                </div>
            </header>

            {/* Sidebar Navigation */}
            <aside className={`profile-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="user-card">
                    <div className="user-avatar">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                        <h3>{user.username}</h3>
                        <p>{user.email}</p>
                    </div>
                </div>

                <nav className="profile-navigation">
                    <button
                        variant="text"
                        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('profile');
                            setMobileMenuOpen(false);
                        }}
                        startIcon={<FiUser className="nav-icon" />}
                    >
                        Profile
                    </button>

                    <button
                        variant="text"
                        className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('orders');
                            setMobileMenuOpen(false);
                        }}
                        startIcon={<FiShoppingBag className="nav-icon" />}
                    >
                        My Orders
                    </button>

                    <button
                        variant="text"
                        className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('saved');
                            setMobileMenuOpen(false);
                        }}
                        startIcon={<FiHeart className="nav-icon" />}
                    >
                        Saved Items
                    </button>

                    <button
                        variant="text"
                        className={`nav-item ${activeTab === 'address' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('address');
                            setMobileMenuOpen(false);
                        }}
                        startIcon={<FiMapPin className="nav-icon" />}
                    >
                        Addresses
                    </button>

                    <button
                        variant="text"
                        className="nav-item logout"
                        startIcon={<FiLogOut className="nav-icon" />}
                    >
                        Log Out
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="profile-content">
                <div className="content-container">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <section className="profile-section">
                            <div className="section-header">
                                <h2>Personal Information</h2>
                                <button variant="outlined">Edit Profile</button>
                            </div>

                            <div className="info-grid">
                                <div className="info-card">
                                    <h3>Basic Information</h3>
                                    <div className="info-row">
                                        <span className="info-label">Full Name</span>
                                        <span className="info-value">{user.username || 'Not provided'}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Email</span>
                                        <span className="info-value">{user.email}</span>
                                    </div>
                                </div>

                                <div className="info-card">
                                    <h3>Contact Details</h3>
                                    <div className="info-row">
                                        <span className="info-label">Mobile Number</span>
                                        <span className="info-value">{user.contactNumber || 'Not provided'}</span>
                                    </div>
                                </div>

                                <div className="info-card">
                                    <h3>Account Status</h3>
                                    <div className="info-row">
                                        <span className="info-label">Status</span>
                                        <span className={`info-value status ${user.status?.toLowerCase()}`}>
                                            {user.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <section className="profile-section">
                            <div className="section-header">
                                <h2>Order History</h2>
                                <div className="filter-control">
                                    <select className="filter-select">
                                        <option>Last 30 Days</option>
                                        <option>Past 6 Months</option>
                                        <option>2023</option>
                                        <option>2022</option>
                                    </select>
                                </div>
                            </div>

                            <div className="empty-state">
                                <img src="/images/no-orders.svg" alt="No orders" />
                                <h3>No Orders Yet</h3>
                                <p>You haven't placed any orders with us yet.</p>
                                <button variant="contained">Browse Products</button>
                            </div>
                        </section>
                    )}

                    {/* Saved Items Tab */}
                    {activeTab === 'saved' && (
                        <section className="profile-section">
                            <div className="section-header">
                                <h2>Saved Items</h2>
                            </div>

                            <div className="empty-state">
                                <img src="/images/wishlist-empty.svg" alt="No saved items" />
                                <h3>Your Wishlist is Empty</h3>
                                <p>Save items you like to see them here.</p>
                                <button variant="contained">Start Shopping</button>
                            </div>
                        </section>
                    )}

                    {/* Addresses Tab */}
                    {activeTab === 'address' && (
                        <section className="profile-section">
                            <div className="section-header">
                                <h2>Saved Addresses</h2>
                                <button variant="outlined" startIcon={<FiMapPin />}>
                                    Add New Address
                                </button>
                            </div>

                            <div className="empty-state">
                                <img src="/images/no-address.svg" alt="No addresses" />
                                <h3>No Saved Addresses</h3>
                                <p>Add addresses for faster checkout.</p>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserProfile;