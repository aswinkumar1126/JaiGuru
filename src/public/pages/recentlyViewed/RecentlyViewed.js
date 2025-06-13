// src/pages/recentlyViewed/RecentlyViewedPage.jsx
import React from 'react';
import { useRecentlyViewed } from '../../hook/recentlyViewed/useRecentlyViewedQuery';
import { useQueries } from '@tanstack/react-query';
import { getProductBySno } from '../../service/ProductService';
import SkeletonLoader from '../../components/loader/SkeletonLoader';
import Error from '../../components/error/Error';
import ProductCard from '../../components/productCard/ProductCard';
import './RecentlyViewedPage.css';
import { useNavigate } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';
import { useCart } from '../../hook/cart/useCartQuery';

const RecentlyViewedPage = () => {
    const navigate = useNavigate();
    const {
        data,
        isLoading: isSnoLoading,
        isError,
        error,
        refetch
    } = useRecentlyViewed();
    const { addToCartHandler } = useCart();

    const snoArray = data?.data || [];

    const productQueries = useQueries({
        queries: snoArray.map((sno) => ({
            queryKey: ['singleProduct', sno],
            queryFn: () => getProductBySno(sno),
            enabled: !!sno && !isSnoLoading,
            staleTime: 1000 * 60 * 30, // 30 minutes cache
        })),
    });
   

    const isLoading = isSnoLoading || productQueries.some((q) => q.isLoading);
    const isErrorState = isError || productQueries.some((q) => q.isError);
    const products = productQueries
        .filter(q => q.isSuccess && q.data)
        .map(q => q.data);

    if (isLoading) {
        return (
            <div className="recently-viewed-container">
                <SkeletonLoader
                    count={6}
                    height={320}
                    className="product-grid"
                />
            </div>
        );
    }

    if (isErrorState) {
        return (
            <Error
                message="Failed to load recently viewed items"
                onRetry={refetch}
            />
        );
    }
    const handleAddToCart = (product) => {
        console.log("🛒 Sending to addToCartHandler:", product);

        addToCartHandler({
            itemTagSno: product.SNO,             // corresponds to `SNO`
            itemId: product.ITEMID,              // `ITEMID`
            subItemId: product.SubItemId,        // `SubItemId` already correctly cased
            tagNo: product.TAGNO,                // `TAGNO`
            grsWt: parseFloat(product.GRSWT),    // convert string to number
            netWt: parseFloat(product.NETWT),
            stnWt: 0,                            // not present in your data, set to default
            stnAmount: parseFloat(product.StoneAmount || 0),
            amount: parseFloat(product.GrandTotal || 0),
            purity: parseFloat(product.PURITY),
            quantity: 1,
        });
    };

    return (
        <div className="recently-viewed-container">
            <header className="recently-viewed-header">
                <div className="header-content">
                    <FiClock className="header-icon" />
                    <h1>Recently Viewed</h1>
                    {products.length > 0 && (
                        <span className="product-count">{products.length} items</span>
                    )}
                </div>
                <p className="header-subtitle">
                    Your browsing history at a glance
                </p>
            </header>

            {products.length === 0 ? (
                <div className="empty-state">
                    <img
                        src="/images/no-items.svg"
                        alt="No recently viewed items"
                        className="empty-image"
                    />
                    <h2>Your recently viewed is empty</h2>
                    <p>Browse our collection and items will appear here</p>
                    <button
                        className="browse-button"
                        onClick={() => navigate('/products')}
                    >
                        Browse Products
                    </button>
                </div>
            ) : (
                <>
                    <div className="product-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product.SNO}
                                product={product}
                                onQuickView={() => navigate(`/product/${product.SNO}`)}
                                onAddToCart={() => handleAddToCart(product)}
                            />
                        ))}
                    </div>
                    <div className="recently-viewed-actions">
                        <button
                            className="clear-history-button"
                            onClick={() => console.log('Clear history')}
                        >
                            Clear History
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default RecentlyViewedPage;