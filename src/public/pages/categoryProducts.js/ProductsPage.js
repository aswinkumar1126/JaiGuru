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

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const { state } = location;
    const itemId = state?.itemId;
    const metalType = state?.metal;
    const fullItemName = state?.itemName || itemName.replace(/-/g, ' ');

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const {
        data: products,
        isLoading,
        isError,
        error,
        isPreviousData
    } = useItemFilter({
        itemId,
        itemName: fullItemName,
        metal: metalType,
        page,
        pageSize: 20
    });

    const handlePageChange = (newPage) => {
        if (!isPreviousData && newPage > 0) {
            searchParams.set('page', newPage);
            navigate({ search: searchParams.toString() }, { replace: true });
        }
    };

    const handleQuickView = (productSno) => {
        navigate(`/product/${productSno}`);
    };

    if (isLoading) {
        return (
            <div className="pp-loading-container">
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
        <div className="pp-container">
            <h1 className="pp-title">
                {fullItemName.toUpperCase()}
            </h1>

            <div className="pp-filters">
                <div className="pp-count">
                    {products?.length > 0 ? `${products.length} items found` : 'No items found'}
                </div>
            </div>

            {products?.length > 0 ? (
                <div className={`pp-grid ${isMobile ? 'pp-mobile-view' : 'pp-desktop-view'}`}>
                    {products.map(product => (
                        isMobile ? (
                            <MobileProductCard
                                key={product.TAGNO}
                                product={{
                                    ...product,
                                    isNew: product.isNew || false,
                                    discount: product.discount || 0
                                }}
                                showSubItemName={true}
                                onQuickView={() => handleQuickView(product.SNO)}
                            />
                        ) : (
                            <ProductCard
                                key={product.TAGNO}
                                product={{
                                    ...product,
                                    isNew: product.isNew || false,
                                    discount: product.discount || 0
                                }}
                                showSubItemName={true}
                                onQuickView={() => handleQuickView(product.SNO)}
                            />
                        )
                    ))}
                </div>
            ) : (
                <div className="pp-no-products">
                    <p>No products found for this category.</p>
                </div>
            )}

            {/* Fixed Pagination Controls */}
            {products && products.length > 0 && (
                <div className="pp-pagination">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1 || isPreviousData}
                        className="pp-pagination-button"
                    >
                        Previous
                    </button>
                    <span className="pp-page-number">Page {page}</span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={products.length < 20 || isPreviousData}
                        className="pp-pagination-button"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;