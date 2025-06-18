import React, { useEffect, useState } from 'react';
import { useCurrentProfile } from '../../hook/userProfile/useUserProfileQuery';
import SkeletonLoader from '../../components/loader/SkeletonLoader';
import Error from '../../components/error/Error';
import MobileHeader from './MobileHeader';
import ProfileSidebar from './ProfileSidebar';
import ProfileContent from './ProfileContent';
import './UserProfile.css';

const UserProfile = () => {
    const { data: user, isLoading, error, refetch } = useCurrentProfile();
    const [activeTab, setActiveTab] = useState('profile');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isLoading) return <SkeletonLoader count={5} height={100} className="profile-skeleton" />;
    if (error || !user) return <Error message="Failed to load profile" onRetry={refetch} />;

    return (
        <div className="user-profile-container">
            <MobileHeader
                isScrolled={isScrolled}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                username={user.username}
            />
            <ProfileSidebar
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setMobileMenuOpen={setMobileMenuOpen}
                onLogout={() => console.log('Logout logic here')}
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
