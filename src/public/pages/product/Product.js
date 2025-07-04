import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import Error from "../../components/error/Error";
import ProductCard from "../../components/productCard/ProductCard";
import MobileProductCard from "../../components/productCard/MobileProductCard";
import Button from "../../components/button/Button";
import { useCart } from "../../hook/cart/useCartQuery";
import "./Product.css";

function Product({ products = [], loading, error }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1316);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showArrows, setShowArrows] = useState(false);
    const user = localStorage.getItem("user");
    const navigate = useNavigate();
    const { addToCartHandler } = useCart();
    const carouselRef = useRef(null);

    // Responsive product count
    const productsPerPage = isMobile ? 2 : 4;
    const totalProducts = products.length;

    // Handle screen size changes
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
            setCurrentIndex(0); // Reset index on resize to avoid overflow
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    // Auto-scroll carousel on desktop
    useEffect(() => {
        if (!isMobile && totalProducts > productsPerPage) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) =>
                    prev >= totalProducts - productsPerPage ? 0 : prev + 1
                );
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isMobile, totalProducts, productsPerPage]);

    // Swipe handlers
    const handlers = useSwipeable({
        onSwipedLeft: () => handleNext(),
        onSwipedRight: () => handlePrev(),
        trackMouse: true,
        preventDefaultTouchmoveEvent: true,
    });

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) =>
            prev === 0 ? totalProducts - productsPerPage : prev - 1
        );
    }, [totalProducts, productsPerPage]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) =>
            prev >= totalProducts - productsPerPage ? 0 : prev + 1
        );
    }, [totalProducts, productsPerPage]);

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

    if (error) {
        return (
            <Error
                error={error}
                retry={() => window.location.reload()}
                aria-label="Error loading products"
            />
        );
    }

    return (
        <section className="product-container" aria-label="Premium Product Collection">
            <header className="page-header">
                <h2 className="title animate-char">Our Premium Collection</h2>
            </header>

            <div
                className="product-carousel-wrapper"
                onMouseEnter={() => !isMobile && setShowArrows(true)}
                onMouseLeave={() => !isMobile && setShowArrows(false)}
                ref={carouselRef}
                {...handlers}
            >
                {loading ? (
                    <div className={`product-grid ${isMobile ? "mobile-view" : ""}`}>
                        {[...Array(productsPerPage)].map((_, i) => (
                            <SkeletonLoader
                                key={`skel-${i}`}
                                mobile={isMobile}
                                aria-hidden="true"
                            />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        {showArrows && !isMobile && (
                            <>
                                <button
                                    className="carousel-arrow left-arrow"
                                    onClick={handlePrev}
                                    aria-label="Previous product set"
                                    type="button"
                                >
                                    <FaArrowLeft aria-hidden="true" />
                                </button>
                                <button
                                    className="carousel-arrow right-arrow"
                                    onClick={handleNext}
                                    aria-label="Next product set"
                                    type="button"
                                >
                                    <FaArrowRight aria-hidden="true" />
                                </button>
                            </>
                        )}

                        <div
                            className={`product-grid ${isMobile ? "mobile-view" : ""}`}
                            role="region"
                            aria-label="Product carousel"
                        >
                            {getVisibleProducts().map((product) => (
                                isMobile ? (
                                    <MobileProductCard
                                        key={`mobile-${product.SNO}`}
                                        product={product}
                                        onQuickView={() => navigate(`/product/${product.SNO}`)}
                                        onAddToCart={() => handleAddToCart(product)}
                                        aria-label={`View ${product.name || "product"} details`}
                                    />
                                ) : (
                                    <ProductCard
                                        key={`desk-${product.SNO}`}
                                        product={product}
                                        onQuickView={() => navigate(`/product/${product.SNO}`)}
                                        onAddToCart={() => handleAddToCart(product)}
                                        aria-label={`View ${product.name || "product"} details`}
                                    />
                                )
                            ))}
                        </div>

                        {isMobile && totalProducts > productsPerPage && (
                            <div className="mobile-carousel-controls" role="navigation">
                                <button
                                    onClick={handlePrev}
                                    aria-label="Previous product set"
                                    type="button"
                                >
                                    <FaArrowLeft aria-hidden="true" />
                                </button>
                                <div className="carousel-dots">
                                    {Array.from({
                                        length: Math.ceil(totalProducts / productsPerPage),
                                    }).map((_, i) => (
                                        <button
                                            key={i}
                                            className={`dot ${i === Math.floor(currentIndex / productsPerPage)
                                                    ? "active"
                                                    : ""
                                                }`}
                                            onClick={() => setCurrentIndex(i * productsPerPage)}
                                            aria-label={`Go to product set ${i + 1}`}
                                            aria-current={
                                                i === Math.floor(currentIndex / productsPerPage)
                                                    ? "true"
                                                    : "false"
                                            }
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={handleNext}
                                    aria-label="Next product set"
                                    type="button"
                                >
                                    <FaArrowRight aria-hidden="true" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="no-products" role="alert">
                        No products available at this time
                    </div>
                )}
            </div>

            <div className="see-more-wrapper">
                <Button
                    label="Explore More Products"
                    onClick={() => navigate("/products")}
                    variant="primary"
                    size="large"
                    className="see-more-btn"
                    aria-label="View all products"
                />
            </div>
        </section>
    );
}

export default Product;