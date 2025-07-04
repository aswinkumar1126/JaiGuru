import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";
import { useMediaQuery } from "react-responsive";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import Error from "../../components/error/Error";
import ProductCard from "../../components/productCard/ProductCard";
import MobileProductCard from "../../components/productCard/MobileProductCard";
import Button from "../../components/button/Button";
import { useCart } from "../../hook/cart/useCartQuery";
import { useTrendingProducts } from "../../hook/products/useTrendingProducts";
import "./ProductSectionPage.css";

function TrendingProductsPage() {
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
    } = useTrendingProducts();

    // Responsive settings
    const productsPerPage = isMobile ? 2 : 4;
    const totalProducts = products.length;

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
        return products.slice(currentIndex, endIndex);
    }, [currentIndex, productsPerPage, totalProducts, products]);

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
                        <FiTrendingUp className="header-icon" />
                        <h2 className="section-title">Trending Now</h2>
                        {!isLoading && products.length > 0 && (
                            <span className="items-count-badge">
                                {products.length} {products.length === 1 ? 'item' : 'items'}
                            </span>
                        )}
                    </div>
                    <p className="section-subtitle">
                        Our most popular jewelry this season
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
                    ) : products.length > 0 ? (
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
                                            key={`mobile-${product.SNO ?? Math.random()}`}
                                            product={product}
                                            onQuickView={() => navigate(`/product/${product.SNO}`)}
                                            onAddToCart={() => handleAddToCart(product)}
                                            isTrending={true}
                                        />
                                    ) : (
                                        <ProductCard
                                            key={`desktop-${product.SNO ?? Math.random()}`}
                                            product={product}
                                            onQuickView={() => navigate(`/product/${product.SNO}`)}
                                            onAddToCart={() => handleAddToCart(product)}
                                            isTrending={true}
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
                                    alt="No trending products"
                                    className="empty-state-image"
                                />
                                <h3 className="empty-state-title">No Trending Products</h3>
                                <p className="empty-state-message">
                                    Discover our collections to see what's popular
                                </p>
                                <Button
                                    label="Explore Collections"
                                    onClick={() => navigate('/collections')}
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

export default TrendingProductsPage;