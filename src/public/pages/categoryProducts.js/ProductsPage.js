import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useItemFilter } from '../../hook/category/useCategoryQuery';
import ProductCard from '../../components/productCard/ProductCard';
import MobileProductCard from '../../components/productCard/MobileProductCard';
import LoadingSpinner from '../../components/loader/SkeletonLoader';
import ErrorMessage from '../../components/error/Error';
import './ProductsPage.css';

const ProductsPage = () => {
    const { itemName } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get('page')) || 1;

    // State for tracking screen size
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Get parameters from both URL and state
    const { state } = location;
    const itemId = state?.itemId;
    const metalType = state?.metal;
    const fullItemName = state?.itemName || itemName.replace(/-/g, ' ');

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { data: products, isLoading, isError, error, isPreviousData } = useItemFilter({
        itemId,
        itemName: fullItemName,
        metal: metalType,
        page,
        pageSize: 20
    });

    const handlePageChange = (newPage) => {
        if (!isPreviousData) {
            searchParams.set('page', newPage);
            navigate({ search: searchParams.toString() }, { replace: true });
        }
    };

    const handleQuickView = (productSno) => {
        navigate(`/product/${productSno}`);
    };

    if (isLoading) {
        return (
            <div className="products-loading-container">
                <LoadingSpinner />
                <p>Loading products...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <ErrorMessage
                message={error.message || "Failed to load products"}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="products-page-container">
            <h1 className="products-page-title">
                {fullItemName.toUpperCase()}
            </h1>

            <div className="products-filters">
                <div className="products-count">
                    {products?.length > 0 ? `${products.length} items found` : 'No items found'}
                </div>
            </div>

            {products?.length > 0 ? (
                <div className={`products-grid ${isMobile ? 'mobile-view' : 'desktop-view'}`}>
                    {products.map(product => {
                        const productProps = {
                            key: product.TAGNO,
                            product: {
                                ...product,
                                isNew: product.isNew || false,
                                discount: product.discount || 0
                            },
                            showSubItemName: true, // 👈 tell the card to show subitem
                            onQuickView: () => handleQuickView(product.SNO)
                        };

                        return isMobile ? (
                            <MobileProductCard {...productProps} />
                        ) : (
                            <ProductCard {...productProps} />
                        );
                    })}
                </div>
            ) : (
                <div className="no-products-message">
                    <p>No products found for this category.</p>
                </div>
            )}

        </div>
    );
};

export default ProductsPage;