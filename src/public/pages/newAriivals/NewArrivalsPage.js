import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import { useMediaQuery } from "react-responsive";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import Error from "../../components/error/Error";
import ProductCard from "../../components/productCard/ProductCard";
import MobileProductCard from "../../components/productCard/MobileProductCard";
import Button from "../../components/button/Button";
import { useCart } from "../../hook/cart/useCartQuery";
import { useNewArrivals } from "../../hook/newArrivals/useNewArrivals";
import "./ProductSectionPage.css";

function NewArrivalsPage() {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showArrows, setShowArrows] = useState(false);
    const user = localStorage.getItem("user");
    const navigate = useNavigate();
    const { addToCartHandler } = useCart();
    const carouselRef = useRef(null);

    // Data fetching
    const {
        data: products = [],
        isLoading,
        isError,
        error,
        refetch
    } = useNewArrivals();
console.log(products);
    // Transform product data to match expected structure
    const transformedProducts = products.map(product => ({
        ...product,
        ITEMNAME: product.itemName,
        ITEMSNO:product.itemTag_Sno,
        ITEMID: product.itemId,
        SubItemId: product.subItemId,
        TAGNO: product.tagNo,
        GRSWT: product.grsWt,
        NETWT: product.netWt,
        PURITY: 916, // Default purity value (916 = 22k gold)
        StoneAmount: 0, // Default stone amount
        GrandTotal: product.rate * product.netWt, // Calculate total price
        imagePath: product.imagePath || '/images/product-placeholder.jpg' // Fallback image
    }));

    // Responsive settings
    const productsPerPage = isMobile ? 2 : 4;
    const totalProducts = transformedProducts.length;

    // Navigation handlers
    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) =>
            Math.min(prev + 1, totalProducts - productsPerPage)
        );
    }, [totalProducts, productsPerPage]);

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleNext(),
        onSwipedRight: () => handlePrev(),
        trackMouse: true,
        preventDefaultTouchmoveEvent: true,
    });

    const getVisibleProducts = useCallback(() => {
        const endIndex = Math.min(currentIndex + productsPerPage, totalProducts);
        return transformedProducts.slice(currentIndex, endIndex);
    }, [currentIndex, productsPerPage, totalProducts, transformedProducts]);

    const handleAddToCart = (product) => {
        if (!user) {
            localStorage.setItem(
                "redirectAfterLogin",
                JSON.stringify({ path: window.location.pathname })
            );
            navigate("/login");
            return;
        }

        addToCartHandler({
            itemTagSno: product.SNO,
            itemId: product.ITEMID,
            subItemId: product.SubItemId,
            tagNo: product.TAGNO,
            grsWt: parseFloat(product.GRSWT),
            netWt: parseFloat(product.NETWT),
            stnWt: 0,
            stnAmount: parseFloat(product.StoneAmount || 0),
            amount: parseFloat(product.GrandTotal || 0),
            purity: parseFloat(product.PURITY),
            quantity: 1,
        });
    };

    if (isError) {
        return <Error message={error.message} onRetry={refetch} />;
    }

    return (
        <section className="product-section">
            <div className="product-section-container">
                <header className="section-header">
                    <div className="header-title-wrapper">
                        <FiStar className="header-icon" />
                        <h2 className="section-title">New Arrivals</h2>
                        {!isLoading && transformedProducts.length > 0 && (
                            <span className="items-count-badge">
                                {transformedProducts.length} {transformedProducts.length === 1 ? 'item' : 'items'}
                            </span>
                        )}
                    </div>
                    <p className="section-subtitle">
                        Discover our latest jewelry collections
                    </p>
                </header>

                <div
                    className="carousel-container"
                    onMouseEnter={() => !isMobile && setShowArrows(true)}
                    onMouseLeave={() => !isMobile && setShowArrows(false)}
                    ref={carouselRef}
                    {...swipeHandlers}
                >
                    {isLoading ? (
                        <div className="products-grid loading">
                            {[...Array(productsPerPage)].map((_, i) => (
                                <SkeletonLoader key={`skeleton-${i}`} />
                            ))}
                        </div>
                    ) : transformedProducts.length > 0 ? (
                        <>
                            {!isMobile && showArrows && (
                                <>
                                    <button
                                        className={`carousel-arrow left-arrow ${currentIndex === 0 ? 'disabled' : ''}`}
                                        onClick={handlePrev}
                                        disabled={currentIndex === 0}
                                        aria-label="Previous items"
                                    >
                                        <FaArrowLeft />
                                    </button>
                                    <button
                                        className={`carousel-arrow right-arrow ${currentIndex >= totalProducts - productsPerPage ? 'disabled' : ''}`}
                                        onClick={handleNext}
                                        disabled={currentIndex >= totalProducts - productsPerPage}
                                        aria-label="Next items"
                                    >
                                        <FaArrowRight />
                                    </button>
                                </>
                            )}

                            <div className="products-grid">
                                {getVisibleProducts().map((product) => (
                                    isMobile ? (
                                        <MobileProductCard
                                            key={`mobile-${product.SNO}`}
                                            product={product}
                                            onQuickView={() => navigate(`/product/${encodeURIComponent(product.ITEMSNO)}`)}
                                            onAddToCart={() => handleAddToCart(product)}
                                            isNewArrival={true}
                                        />
                                    ) : (
                                        <ProductCard
                                            key={`desktop-${product.SNO}`}
                                            product={product}
                                                onQuickView={() => navigate(`/product/${encodeURIComponent(product.ITEMSNO)}`)}
                                            onAddToCart={() => handleAddToCart(product)}
                                            isNewArrival={true}
                                        />
                                    )
                                ))}
                            </div>

                            {isMobile && totalProducts > productsPerPage && (
                                <div className="mobile-carousel-indicators">
                                    <button
                                        className={`nav-button prev ${currentIndex === 0 ? 'disabled' : ''}`}
                                        onClick={handlePrev}
                                        disabled={currentIndex === 0}
                                    >
                                        <FaArrowLeft />
                                    </button>
                                    <div className="dots-container">
                                        {Array.from({
                                            length: Math.ceil(totalProducts / productsPerPage)
                                        }).map((_, i) => (
                                            <button
                                                key={i}
                                                className={`dot ${i === Math.floor(currentIndex / productsPerPage) ? 'active' : ''}`}
                                                onClick={() => setCurrentIndex(i * productsPerPage)}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        className={`nav-button next ${currentIndex >= totalProducts - productsPerPage ? 'disabled' : ''}`}
                                        onClick={handleNext}
                                        disabled={currentIndex >= totalProducts - productsPerPage}
                                    >
                                        <FaArrowRight />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-content">
                                <img
                                    src="/images/no-items.svg"
                                    alt="No new arrivals"
                                    className="empty-state-image"
                                />
                                <h3 className="empty-state-title">No New Arrivals Available</h3>
                                <p className="empty-state-message">
                                    Check back soon for our latest collections
                                </p>
                                <Button
                                    label="Browse All Products"
                                    onClick={() => navigate('/products')}
                                    variant="primary"
                                    size="medium"
                                    className="empty-state-button"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default NewArrivalsPage;