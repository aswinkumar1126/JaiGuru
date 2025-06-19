import React, { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useCurrentProfile } from '../../../hook/userProfile/useUserProfileQuery';
import SkeletonLoader from '../../../components/loader/SkeletonLoader';
import Error from '../../../components/error/Error';
import ProfileSidebar from '../profileSidebar/ProfileSidebar';
import ProfileContent from '../profileContent/ProfileContent';
import './UserProfile.css';

const UserProfile = () => {
    const { data: user, isLoading, error, refetch } = useCurrentProfile();
    const [activeTab, setActiveTab] = useState('profile');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const checkViewport = () => {
            const mobile = window.innerWidth < 992;
            setIsMobileView(mobile);
            if (!mobile) setMobileMenuOpen(true);
        };

        checkViewport();
        window.addEventListener('resize', checkViewport);
        return () => window.removeEventListener('resize', checkViewport);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.classList.add('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-open');
        }
        return () => document.body.classList.remove('sidebar-open');
    }, [mobileMenuOpen]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (isMobileView) setMobileMenuOpen(false);
    };

    const toggleMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    if (isLoading) return <SkeletonLoader count={5} height={100} className="profile-skeleton" />;
    if (error || !user) return <Error message="Failed to load profile" onRetry={refetch} />;

    return (
        <div className="user-profile-container">
            {isMobileView && (
                <button
                    className="hamburger-toggle"
                    onClick={toggleMenu}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                    {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            )}

            {isMobileView && mobileMenuOpen && (
                <div className="overlay active" onClick={toggleMenu} aria-hidden="true" />
            )}

            <ProfileSidebar
                user={user}
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                onLogout={() => console.log('Logout logic here')}
                mobileMenuOpen={isMobileView ? mobileMenuOpen : true}
                onClose={toggleMenu}  // Changed from setMobileMenuOpen to onClose
            />

            <main className="profile-content">
                <div className="content-container">
                    <ProfileContent activeTab={activeTab} user={user} />
                </div>
            </main>
        </div>
    );
};

export default UserProfile;