import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Error from "../../components/error/Error";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import Button from "../../components/button/Button";
import { useSingleProductQuery } from "../../hook/product/useSingleProductQuery";
import './ProductDetails.css';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCart } from "../../hook/cart/useCartQuery";



const ProductDetails = () => {
    const { sno } = useParams();
    const { data: productDetail, isLoading, isError, error } = useSingleProductQuery(sno);

    const { addToCartHandler } = useCart();

    console.log(productDetail);

    const [zoomStyle, setZoomStyle] = useState({});
    const [showZoom, setShowZoom] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [expandedSpecs, setExpandedSpecs] = useState(false);
    const imgRef = useRef(null);
    const zoomRef = useRef(null);
    const thumbnailContainerRef = useRef(null);

    const baseUrl = "https://app.bmgjewellers.com";
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        try {
            const parsedImages = JSON.parse(productDetail?.ImagePath || "[]");
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                setImageUrls(parsedImages);
            } else {
                setImageUrls(["/fallback.jpg"]); // 👈 fallback if empty
            }
        } catch (err) {
            console.error("Invalid image path format:", err);
            setImageUrls(["/fallback.jpg"]); // 👈 fallback if parsing fails
        }
    }, [productDetail]);
    

    const mainImage = imageUrls.length > 0 ? baseUrl + imageUrls[activeImageIndex] : "";

    const handleMouseMove = (e) => {
        if (!imgRef.current || !zoomRef.current) return;

        const container = imgRef.current;
        const { left, top, width, height } = container.getBoundingClientRect();

        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        const zoomLeft = left + width + 20;
        const zoomTop = top;

        setZoomStyle({
            backgroundImage: `url(${mainImage})`,
            backgroundPosition: `${x}% ${y}%`,
            backgroundSize: `${width * 2}px ${height * 2}px`,
            left: `${zoomLeft}px`,
            top: `${zoomTop}px`
        });
    };

    const handleThumbnailScroll = (direction) => {
        if (thumbnailContainerRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            thumbnailContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleThumbnailClick = (index) => {
        setActiveImageIndex(index);
        // Scroll the clicked thumbnail into view
        if (thumbnailContainerRef.current) {
            const thumbnails = thumbnailContainerRef.current.children;
            if (thumbnails[index]) {
                thumbnails[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    };
    const handleAddToCart = () => {
        addToCartHandler({
            itemTagSno: productDetail.SNO,
            itemId: productDetail.ITEMID,
            subItemId: productDetail.SubItemId,
            tagNo: productDetail.TAGNO,
            grsWt: parseFloat(productDetail.GRSWT || 0),
            netWt: parseFloat(productDetail.NETWT || 0),
            stnWt: 0,
            stnAmount: parseFloat(productDetail.StoneAmount || 0),
            amount: parseFloat(productDetail.GrandTotal || 0),
            purity: parseFloat(productDetail.PURITY || 0),
            quantity: 1,
        });
    };
    

    const toggleSpecs = () => {
        setExpandedSpecs(!expandedSpecs);
    };

    if (isError) return <Error error={error} />;
    if (isLoading || !productDetail) return <SkeletonLoader count={1} type="details" />;

    const specificationGroups = {
        "Basic Details": [
            { label: "Item Name", value: productDetail.ITEMNAME },
            { label: "Tag No", value: productDetail.TAGNO },
            { label: "Purity", value: `${productDetail.PURITY}%` },
            { label: "Metal Type", value: productDetail.METALID },
        ],
        "Weight Details": [
            { label: "Weight", value: `${productDetail.NETWT} g` },
            { label: "Gross Weight", value: `${productDetail.GRSWT} g` },
            { label: "Wastage", value: productDetail.Wastage },
        ],
        "Pricing Details": [
            { label: "Making Charges", value: `₹${productDetail.MC}` },
            { label: "Stone Amount", value: `₹${productDetail.StoneAmount}` },
            { label: "Misc Amount", value: `₹${productDetail.MiscAmount}` },
            { label: "GST %", value: `${productDetail.GSTPer}%` },
            { label: "GST Amount", value: `₹${productDetail.GSTAmount}` },
            { label: "Gross Amount", value: `₹${productDetail.GrossAmount}` },
            { label: "Grand Total", value: `₹${productDetail.GrandTotal}` },
        ],
        "Other Details": [
            { label: "Subitem", value: productDetail.SUBITEM === 'Y' ? 'Yes' : 'No' },
            { label: "Studded Stone", value: productDetail.STUDDEDSTONE === 'Y' ? 'Yes' : 'No' },
            { label: "Stone Unit", value: productDetail.STONEUNIT },
        ]
    };

    return (
        <div className="product-details-container">
            <div className="product-details-wrapper">
                <div className="product-image-section">
                    <div
                        className="image-container"
                        onMouseEnter={() => setShowZoom(true)}
                        onMouseLeave={() => setShowZoom(false)}
                        onMouseMove={handleMouseMove}
                        ref={imgRef}
                    >
                        <img
                            src={mainImage}
                            alt={productDetail.ITEMNAME || productDetail.productName}
                            className="main-product-image"
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = '/fallback.jpg';
                                e.target.alt = 'Product image not available';
                            }}
                        />
                    </div>

                    {imageUrls.length > 1 && (
                        <div className="thumbnail-gallery-container">
                            {imageUrls.length > 4 && (
                                <button
                                    className="thumbnail-nav-button left"
                                    onClick={() => handleThumbnailScroll('left')}
                                    aria-label="Scroll thumbnails left"
                                >
                                    <FiChevronLeft size={20} />
                                </button>
                            )}

                            <div className="image-thumbnails" ref={thumbnailContainerRef}>
                                {imageUrls.map((url, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                                        onClick={() => handleThumbnailClick(index)}
                                        aria-label={`View image ${index + 1}`}
                                    >
                                        <img
                                            src={baseUrl + url}
                                            alt={`Thumbnail ${index + 1}`}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-thumbnail.jpg';
                                                e.target.alt = 'Thumbnail not available';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>

                            {imageUrls.length > 4 && (
                                <button
                                    className="thumbnail-nav-button right"
                                    onClick={() => handleThumbnailScroll('right')}
                                    aria-label="Scroll thumbnails right"
                                >
                                    <FiChevronRight size={20} />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="product-actions">
                        <Button
                            className="add-to-cart-btn"
                            label="Add to Cart"
                            icon={<i className="fas fa-shopping-cart"></i>}
                            onClick={handleAddToCart}
                        />
                        <Button
                            className="buy-now-btn"
                            label="Buy Now"
                            primary
                            icon={<i className="fas fa-bolt"></i>}
                        />
                    </div>
                </div>
                <div className="product-info-section">
                    <div className="product-header">
                        <h1 className="product-title">{productDetail.ITEMNAME || productDetail.productName}</h1>

                        <div className="product-meta">
                            <div className="price-section">
                                <span className="current-price">₹{productDetail.GrandTotal || productDetail.productPrice}</span>
                                {productDetail.originalPrice && (
                                    <span className="original-price">₹{productDetail.originalPrice}</span>
                                )}
                                {productDetail.discountPercentage && (
                                    <span className="discount">{productDetail.discountPercentage}% off</span>
                                )}
                            </div>

                            {(productDetail.rating || productDetail.reviewCount) && (
                                <div className="rating-section">
                                    {productDetail.rating && (
                                        <div className="rating-badge">
                                            {productDetail.rating} <i className="fas fa-star"></i>
                                        </div>
                                    )}
                                    {productDetail.reviewCount && (
                                        <span className="rating-count">
                                            {productDetail.reviewCount} Ratings & Reviews
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {showZoom && (
                        <div
                            className="zoom-preview"
                            ref={zoomRef}
                            style={zoomStyle}
                            aria-hidden="true"
                        />
                    )}

                    <div className="product-details-accordion">
                        <div className="specifications">
                            <div
                                className="specs-header"
                                onClick={toggleSpecs}
                                role="button"
                                tabIndex="0"
                                aria-expanded={expandedSpecs}
                            >
                                <h3>Specifications</h3>
                                <span className="toggle-icon">
                                    {expandedSpecs ? (
                                        <i className="fas fa-minus"></i>
                                    ) : (
                                        <i className="fas fa-plus"></i>
                                    )}
                                </span>
                            </div>

                            {expandedSpecs && (
                                <div className="specs-content">
                                    {Object.entries(specificationGroups).map(([groupName, specs]) => (
                                        <div key={groupName} className="spec-group">
                                            <h4 className="spec-group-title">{groupName}</h4>
                                            <div className="spec-grid">
                                                {specs.map((spec, index) => (
                                                    <React.Fragment key={index}>
                                                        <div className="spec-label">{spec.label}</div>
                                                        <div className="spec-value">{spec.value}</div>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{productDetail.Description || "No description available"}</p>
                        </div>

                        <div className="additional-details">
                            <h3>Additional Information</h3>
                            <div className="additional-grid">
                                <div className="additional-item">
                                    <span className="detail-label">Subitem Name:</span>
                                    <span className="detail-value">{productDetail.SUBITEMNAME || '-'}</span>
                                </div>
                                <div className="additional-item">
                                    <span className="detail-label">Category Code:</span>
                                    <span className="detail-value">{productDetail.CATCODE || '-'}</span>
                                </div>
                                <div className="additional-item">
                                    <span className="detail-label">Item ID:</span>
                                    <span className="detail-value">{productDetail.ITEMID || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;