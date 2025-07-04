import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import Error from "../../components/error/Error";
import ProductCard from "../../components/productCard/ProductCard";
import MobileProductCard from "../../components/productCard/MobileProductCard";
import Button from "../../components/button/Button";
import { useCart } from "../../hook/cart/useCartQuery";
import { useRecentlyViewed } from "../../hook/recentlyViewed/useRecentlyViewedQuery";
import { useQueries } from "@tanstack/react-query";
import { getProductBySno } from "../../service/ProductService";
import "./RecentlyViewedPage.css";

const RecentlyViewedPage = () => {
    const navigate = useNavigate();
    const { addToCartHandler } = useCart();
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showArrows, setShowArrows] = useState(false);

    // Window size tracking
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowSize.width <= 768;
    const productsPerPage = isMobile ? 2 : 4;

    // Data fetching with optimized caching
    const {
        data: recentlyViewedData,
        isLoading: isSnoLoading,
        isError: isSnoError,
        error: snoError
    } = useRecentlyViewed();

    const snoArray = recentlyViewedData?.data || [];

    const productQueries = useQueries({
        queries: snoArray.map((sno) => ({
            queryKey: ['product', sno],
            queryFn: () => getProductBySno(sno),
            staleTime: 1000 * 60 * 30, // 30 minutes
            enabled: !!sno,
        })),
    });

    // Memoized products data
    const products = productQueries
        .filter(q => q.isSuccess && q.data)
        .map(q => q.data);

    const totalProducts = products.length;
    const maxIndex = Math.max(0, totalProducts - productsPerPage);

    // Navigation handlers
    const handlePrev = useCallback(() => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    }, []);

    const handleNext = useCallback(() => {
        setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    }, [maxIndex]);

    // Reset index when products change or on mobile resize
    useEffect(() => {
        if (currentIndex > maxIndex) {
            setCurrentIndex(maxIndex);
        }
    }, [maxIndex, currentIndex]);

    const handleAddToCart = useCallback((product) => {
        const user = localStorage.getItem("user");
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
            grsWt: parseFloat(product.GRSWT || 0),
            netWt: parseFloat(product.NETWT || 0),
            stnWt: 0,
            stnAmount: parseFloat(product.StoneAmount || 0),
            amount: parseFloat(product.GrandTotal || 0),
            purity: parseFloat(product.PURITY || 916),
            quantity: 1,
        });
    }, [navigate, addToCartHandler]);

    // Visible products calculation
    const visibleProducts = products.slice(currentIndex, currentIndex + productsPerPage);

    if (isSnoError) {
        return <Error message={snoError.message} />;
    }

    const isLoading = isSnoLoading || (productQueries.some(q => q.isLoading) && products.length === 0);

    return (
        <section className="rv-section">
            <div className="rv-container">
                <header className="rv-header">
                    <div className="rv-header-title-wrapper">
                        <FiClock className="rv-header-icon" />
                        <h2 className="rv-title">Recently Viewed</h2>
                        {!isLoading && products.length > 0 && (
                            <span className="rv-items-count">
                                {products.length} {products.length === 1 ? 'item' : 'items'}
                            </span>
                        )}
                    </div>
                    <p className="rv-subtitle">
                        Your personal jewelry browsing history
                    </p>
                </header>

                <div
                    className="rv-carousel-container"
                    onMouseEnter={() => !isMobile && setShowArrows(true)}
                    onMouseLeave={() => !isMobile && setShowArrows(false)}
                >
                    {isLoading ? (
                        <div className="rv-products-grid rv-loading">
                            {[...Array(productsPerPage)].map((_, i) => (
                                <SkeletonLoader key={`skeleton-${i}`} height={320} />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            {!isMobile && showArrows && totalProducts > productsPerPage && (
                                <>
                                    <button
                                        className={`rv-carousel-arrow rv-left-arrow ${currentIndex === 0 ? 'disabled' : ''}`}
                                        onClick={handlePrev}
                                        disabled={currentIndex === 0}
                                        aria-label="Previous items"
                                    >
                                        <FaArrowLeft />
                                    </button>
                                    <button
                                        className={`rv-carousel-arrow rv-right-arrow ${currentIndex >= maxIndex ? 'disabled' : ''}`}
                                        onClick={handleNext}
                                        disabled={currentIndex >= maxIndex}
                                        aria-label="Next items"
                                    >
                                        <FaArrowRight />
                                    </button>
                                </>
                            )}

                            <div className="rv-products-grid">
                                {visibleProducts.map((product) =>
                                    isMobile ? (
                                        <MobileProductCard
                                            key={`mobile-${product.SNO ?? Math.random()}`}
                                            product={product}
                                            onQuickView={() => navigate(`/product/${product.SNO}`)}
                                            onAddToCart={() => handleAddToCart(product)}
                                        />
                                    ) : (
                                        <ProductCard
                                            key={`desktop-${product.SNO ?? Math.random()}`}
                                            product={product}
                                            onQuickView={() => navigate(`/product/${product.SNO}`)}
                                            onAddToCart={() => handleAddToCart(product)}
                                        />
                                    )
                                )}
                            </div>

                            {isMobile && totalProducts > productsPerPage && (
                                <div className="rv-mobile-indicators">
                                    <button
                                        className={`rv-nav-button rv-prev ${currentIndex === 0 ? 'disabled' : ''}`}
                                        onClick={handlePrev}
                                        disabled={currentIndex === 0}
                                    >
                                        <FaArrowLeft />
                                    </button>
                                    <div className="rv-dots-container">
                                        {Array.from({
                                            length: Math.ceil(totalProducts / productsPerPage)
                                        }).map((_, i) => (
                                            <button
                                                key={`dot-${i}`}
                                                className={`rv-dot ${i === Math.floor(currentIndex / productsPerPage) ? 'active' : ''}`}
                                                onClick={() => setCurrentIndex(i * productsPerPage)}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        className={`rv-nav-button rv-next ${currentIndex >= maxIndex ? 'disabled' : ''}`}
                                        onClick={handleNext}
                                        disabled={currentIndex >= maxIndex}
                                    >
                                        <FaArrowRight />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rv-empty-state">
                            <div className="rv-empty-content">
                                <img
                                    src="/images/no-items.svg"
                                    alt="No recently viewed items"
                                    className="rv-empty-image"
                                />
                                <h3 className="rv-empty-title">No Recently Viewed Items</h3>
                                <p className="rv-empty-message">
                                    Items you view will appear here for easy access
                                </p>
                                <Button
                                    label="Browse Collection"
                                    onClick={() => navigate('/products')}
                                    variant="primary"
                                    size="medium"
                                    className="rv-empty-button"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
export default RecentlyViewedPage;