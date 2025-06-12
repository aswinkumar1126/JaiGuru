// SkeletonLoader.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Ensure to import the default styles

// Custom styled Skeleton Loader component
const SkeletonLoader = ({ count = 5, width = '100%', height = 20, className = '', shape = 'rectangular' }) => {
    return (
        <div className={`skeleton-loader ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton
                    key={index}
                    width={width}
                    height={height}
                    className={`skeleton-item ${shape}`}
                    duration={1.5} // Animation duration in seconds
                />
            ))}
        </div>
    );
};

export default SkeletonLoader;
