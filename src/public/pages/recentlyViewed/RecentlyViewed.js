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
import { motion, AnimatePresence } from 'framer-motion';

const RecentlyViewedPage = () => {
    const navigate = useNavigate();
    const {
        data,
        isLoading: isSnoLoading,
    } = useRecentlyViewed();
    // const { mutate: clearRecentlyViewed } = useClearRecentlyViewed();
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

    const isLoading = isSnoLoading || productQueries.every((q) => q.isLoading);
    const isAllFailed = productQueries.every((q) => q.isError);

    const products = productQueries
        .filter(q => q.isSuccess && q.data)
        .map(q => q.data);

    const handleAddToCart = (product) => {
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

    // const handleClearHistory = () => {
    //     clearRecentlyViewed(null, {
    //         onSuccess: () => console.log('Recently viewed history cleared'),
    //         onError: (error) => console.error('Failed to clear history:', error),
    //     });
    // };

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

    if (isAllFailed) {
        return <Error message="No recently viewed items found" />;
    }

    const gridVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
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
                    <motion.div
                        className="product-grid"
                        initial="hidden"
                        animate="visible"
                        variants={gridVariants}
                    >
                        <AnimatePresence>
                            {products.map((product) => (
                                <motion.div
                                    key={product.SNO}
                                    variants={itemVariants}
                                    layout
                                >
                                    <ProductCard
                                        product={product}
                                        onQuickView={() => navigate(`/product/${product.SNO}`)}
                                        onAddToCart={() => handleAddToCart(product)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                    {/* <div className="recently-viewed-actions">
                        <button
                            className="clear-history-button"
                            onClick={handleClearHistory}
                        >
                            Clear History
                        </button>
                    </div> */}
                </>
            )}
        </div>
    );
};

export default RecentlyViewedPage;