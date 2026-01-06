import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
    type?: 'card' | 'text' | 'circle' | 'rectangle';
    count?: number;
    height?: string;
    width?: string;
    className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    type = 'card',
    count = 1,
    height = '100%',
    width = '100%',
    className = ''
}) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return (
                    <div className={`skeleton-card ${className}`}>
                        <div className="skeleton-image shimmer"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-title shimmer"></div>
                            <div className="skeleton-text shimmer"></div>
                            <div className="skeleton-text shimmer short"></div>
                        </div>
                    </div>
                );

            case 'circle':
                return (
                    <div
                        className={`skeleton-circle shimmer ${className}`}
                        style={{ width, height }}
                    ></div>
                );

            case 'rectangle':
                return (
                    <div
                        className={`skeleton-rectangle shimmer ${className}`}
                        style={{ width, height }}
                    ></div>
                );

            case 'text':
                return (
                    <div
                        className={`skeleton-text shimmer ${className}`}
                        style={{ width, height }}
                    ></div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <React.Fragment key={index}>
                    {renderSkeleton()}
                </React.Fragment>
            ))}
        </>
    );
};

// مكون خاص لبطاقات الخدمات
export const ServiceCardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
    return (
        <div className="services-skeleton-grid">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="service-skeleton-card">
                    <div className="skeleton-icon shimmer"></div>
                    <div className="skeleton-title shimmer"></div>
                    <div className="skeleton-description">
                        <div className="skeleton-text shimmer"></div>
                        <div className="skeleton-text shimmer"></div>
                        <div className="skeleton-text shimmer short"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// مكون خاص لبطاقات المشاريع
export const ProjectCardSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
    return (
        <div className="projects-skeleton-grid">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="project-skeleton-card">
                    <div className="skeleton-project-image shimmer"></div>
                    <div className="skeleton-project-content">
                        <div className="skeleton-title shimmer"></div>
                        <div className="skeleton-text shimmer"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
