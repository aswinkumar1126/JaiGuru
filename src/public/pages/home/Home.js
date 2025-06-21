import React from "react";
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

function Home() {
    // Fetching banners data using custom React Query hook
    const {
        data: bannersData,
        isLoading: bannersLoading,
        isError: bannersError,
    } = useBannersQuery();

    // Fetching video list (sorted by latest)
    const {
        data: videoData,
        isLoading: videoLoading,
        isError: videoError,
    } = useVideos();

    // Fetching all product data
    const {
        data: productData,
        isLoading: productsLoading,
        isError: productsError,
    } = useProductsQuery();

    // Extract actual banner array from response
    const bannerData = bannersData?.data || [];

    // Sort videos by creation date (latest first)
    const videosData = (videoData?.data || []).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Extract top 10 products only
    const products = productData || [];
    const topTenProducts = products.slice(0, 10);

    // Get the latest video URL
    const firstVideoUrl =
        videosData.length > 0
            ? `https://app.bmgjewellers.com${videosData[0].video_path}`
            : null;

    // If any of the API calls are still loading
    if (bannersLoading || videoLoading || productsLoading)
        return <SkeletonLoader count={6} />;

    // If any of the API calls failed
    if (bannersError || videoError || productsError)
        return (
            <Error
                error={bannersError || videoError || productsError}
                onRetry={() => window.location.reload()}
            />
        );
        

    // Render the full home page layout
    return (
        <div className="home-section">
            {/* Banner Carousel */}
            <Banner images={bannerData} loading={bannersLoading} />

            {/* Static Category Icons Section */}
            <CategorySection />

            {/* Product List (Top 10 only) */}
            <Product
                products={topTenProducts}
                loading={productsLoading}
                error={productsError}
            />

            {/* Recently viewed section (protected via user auth) */}
            <ProtectedRecentlyViewedWrapper />

            {/* Render first video if available */}
            {firstVideoUrl && (
                <Video
                    videoUrl={firstVideoUrl}
                    loading={videoLoading}
                    error={videoError}
                />
            )}
        </div>
    );
}

export default Home;
