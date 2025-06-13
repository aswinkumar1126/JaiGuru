// SkeletonLoader.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './SkeletonLoader.css'; // Custom CSS for layout

const SkeletonLoader = ({ count = 6, width = '100%', height = 300, className = '', shape = 'card' }) => {
    return (
        <div className={`skeleton-loader-grid ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className={`skeleton-card ${shape}`}>
                    <Skeleton width="100%" height={height} />
                    <div style={{ padding: '10px 0' }}>
                        <Skeleton width="80%" height={20} />
                        <Skeleton width="60%" height={20} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
