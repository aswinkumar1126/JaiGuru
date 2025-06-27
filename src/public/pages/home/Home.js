import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Banner from "../banner/Banner";
import { useBannersQuery } from "../../../admin/hooks/banners/useBannersQuery";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import Error from "../../components/error/Error";
import { useVideos } from "../../hook/video/useVideoQuery";
import Video from "../video/video";
import { useProductsQuery } from "../../hook/product/useProductsQuery";
import Product from "../../pages/product/Product";
import './Home.css';
import CategorySection from "../category/CategorySection";
import ProtectedRecentlyViewedWrapper from "../recentlyViewed/ProtectedRecentlyViewedWrapper";
import RatesPage from "../metalRates/metalRates";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            when: "beforeChildren"
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10
        }
    }
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
};

function Home() {
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [videoRef, videoInView] = useInView({ threshold: 0.3, triggerOnce: true });
    const [productsRef, productsInView] = useInView({ threshold: 0.2, triggerOnce: true });
    const [key, setKey] = useState(0);

    const {
        data: bannersData,
        isLoading: bannersLoading,
        isError: bannersError,
    } = useBannersQuery();

    const {
        data: videoData,
        isLoading: videoLoading,
        isError: videoError,
    } = useVideos();

    const {
        data: productData,
        isLoading: productsLoading,
        isError: productsError,
    } = useProductsQuery();

    useEffect(() => {
        setIsInitialLoad(true);
        const timer = setTimeout(() => {
            setIsInitialLoad(false);
        }, 100);
        return () => clearTimeout(timer);
    }, [key]);

    useEffect(() => {
        const handleRouteChange = () => setKey(prev => prev + 1);
        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);

    const bannerData = bannersData?.data || [];
    const videosData = (videoData?.data || []).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    const products = productData || [];
    const topTenProducts = products.slice(0, 10);
    const firstVideoUrl = videosData.length > 0
        ? `https://app.bmgjewellers.com${videosData[0].video_path}`
        : null;

    if (bannersLoading || videoLoading || productsLoading)
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <SkeletonLoader count={6} />
            </motion.div>
        );

    if (bannersError || videoError || productsError)
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="error-container"
            >
                <Error
                    error={bannersError || videoError || productsError}
                    onRetry={() => window.location.reload()}
                />
            </motion.div>
        );

    return (
        <motion.div
            key={key}
            className="home-section"
            initial="hidden"
            animate={isInitialLoad ? "hidden" : "visible"}
            variants={containerVariants}
        >
            <motion.div variants={fadeIn}>
                <Banner images={bannerData} loading={bannersLoading} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <RatesPage />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px 0px -100px 0px" }}
                transition={{
                    duration: 0.6,
                    type: "spring",
                    damping: 10
                }}
            >
                <CategorySection />
            </motion.div>

            {/* Updated Products Section with responsive fixes */}
            <motion.div
                ref={productsRef}
                initial={{ opacity: 1, y: 20 }}
                animate={productsInView ? "visible" : "hidden"}
                variants={{
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            when: "beforeChildren",
                            staggerChildren: 0.1
                        }
                    },
                    hidden: { opacity: 1, y: 20 }
                }}
                className="products-section"
            >
                <div className="products-grid">
                    <Product
                        products={topTenProducts}
                        loading={productsLoading}
                        error={productsError}
                    />
                </div>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <ProtectedRecentlyViewedWrapper />
            </motion.div>

            {firstVideoUrl && (
                <motion.div
                    ref={videoRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={videoInView ? {
                        opacity: 1,
                        scale: 1,
                        transition: {
                            type: "spring",
                            stiffness: 100,
                            damping: 10
                        }
                    } : {}}
                >
                    <Video
                        videoUrl={firstVideoUrl}
                        loading={videoLoading}
                        error={videoError}
                        shouldPlay={videoInView}
                    />
                </motion.div>
            )}
        </motion.div>
    );
}

export default Home;