import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.css";

/**
 * Professional Image Slider Component with responsive design,
 * accessibility features, and multiple state handling.
 */
function Banner({ images, loading, error }) {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 700,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        pauseOnHover: true,
        cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
        adaptiveHeight: true,
        accessibility: true,
        draggable: true,
        swipeToSlide: true,
        touchThreshold: 10,
        
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "/fallback-image.jpg";
        e.target.alt = "Fallback content image";
    };

    const baseUrl ="https://app.bmgjewellers.com/";
    const renderSlideContent = (img, index) => {
        const imgSrc = img?.image_path ? `${baseUrl}${img.image_path}` : img?.image || img;
        const altText = img?.alt || img?.title || `Slide ${index + 1}`;

        return (
            <div key={index} className="slide">
                <figure className="slide-figure">
                    <div className="image-wrapper">
                        <img
                            src={imgSrc}
                            alt={altText}
                            className="slide-image"
                            onError={handleImageError}
                            loading={index > 0 ? "lazy" : "eager"}
                            decoding="async"
                        />
                    </div>
                    {(img.title || img.description) && (
                        <figcaption className="slide-caption">
                            {img.title && <h3 className="slide-title">{img.title}</h3>}
                            {img.description && <p className="slide-description">{img.description}</p>}
                        </figcaption>
                    )}
                </figure>
            </div>
        );
    };
    

    return (
        <section
            className="slider-container"
            aria-label="Image carousel"
            aria-live="polite"
        >
            {error ? (
                <ErrorState error={error} />
            ) : loading ? (
                <LoadingState />
            ) : images.length > 0 ? (
                <Slider {...sliderSettings} className="main-slider">
                    {images.map(renderSlideContent)}
                </Slider>
            ) : (
                <EmptyState />
            )}
        </section>
    );
}

// Sub-components for better organization
const ErrorState = ({ error }) => (
    <div className="error-state" role="alert">
        <div className="error-content">
            <svg className="error-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <h3 className="error-title">Unable to Load Images</h3>
            <p className="error-message">{error}</p>
            <button
                className="retry-button"
                onClick={() => window.location.reload()}
                aria-label="Retry loading images"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="retry-icon">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor" />
                </svg>
                Try Again
            </button>
        </div>
    </div>
);

const LoadingState = () => (
    <div className="loading-state" aria-busy="true" aria-label="Loading images">
        <Skeleton height={400} className="skeleton-image" />
        <div className="skeleton-dots">
            {[...Array(3)].map((_, i) => (
                <Skeleton key={i} height={12} width={12} circle />
            ))}
        </div>
    </div>
);

const EmptyState = () => (
    <div className="empty-state">
        <svg className="empty-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 12h2v5H7zm4-7h2v12h-2zm4 4h2v8h-2z" />
        </svg>
        <h3 className="empty-title">No Images Available</h3>
        <p className="empty-message">Please check back later or upload new images</p>
    </div>
);

const NextArrow = ({ className, style, onClick }) => (
    <button
        className={`${className} custom-arrow`}
        style={{ ...style }}
        onClick={onClick}
        aria-label="Next slide"
    >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </button>
);

const PrevArrow = ({ className, style, onClick }) => (
    <button
        className={`${className} custom-arrow`}
        style={{ ...style }}
        onClick={onClick}
        aria-label="Previous slide"
    >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </button>
);

Banner.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                image: PropTypes.string,
                bannerImagePath: PropTypes.string,
                alt: PropTypes.string,
                title: PropTypes.string,
                description: PropTypes.string,
                link: PropTypes.string,
            })
        ])
    ),
    loading: PropTypes.bool,
    error: PropTypes.string,
};

Banner.defaultProps = {
    images: [],
    loading: false,
    error: null,
};

export default Banner;