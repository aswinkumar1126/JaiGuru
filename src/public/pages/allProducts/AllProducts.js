import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import "./AllProducts.css";
import ProductCard from "../../components/productCard/ProductCard";
import { usePaginatedProductsQuery } from "../../hook/product/usePaginatedProductsQuery";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import Error from "../../components/error/Error";
import { useCart } from "../../hook/cart/useCartQuery";
import CategorySection from "../category/CategorySection";

function Products() {
    const navigate = useNavigate();
    const location = useLocation(); // 👈 to detect URL change
    const [searchParams] = useSearchParams();
    const metalId = searchParams.get("metalId") || "";

    const [page, setPage] = useState(1);
    const [allProducts, setAllProducts] = useState([]);
    const [initialLimit, setInitialLimit] = useState(true); // always true initially

    const { data, isLoading, isError, isFetching } = usePaginatedProductsQuery(metalId, page);
    const { addToCartHandler } = useCart();

    // 🧠 Reset state when metalId or route changes
    useEffect(() => {
        setAllProducts([]);
        setPage(1);
        setInitialLimit(true);
    }, [metalId, location.pathname]);

    // ✅ Load paginated data
    useEffect(() => {
        if (Array.isArray(data)) {
            setAllProducts((prev) => [...prev, ...data]);
        } else if (Array.isArray(data?.content)) {
            setAllProducts((prev) => [...prev, ...data.content]);
        }
    }, [data]);


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

    const visibleProducts = initialLimit ? allProducts.slice(0, 20) : allProducts;

    const handleLoadMore = () => {
        if (initialLimit) {
            setInitialLimit(false); // show full current page
        } else {
            setPage((prev) => prev + 1); // fetch next page
        }
    };

    const hasMore = Array.isArray(data?.content)
        ? page < data.totalPages
        : (data?.length === 50); // fallback if content is plain array

    if (isLoading && page === 1) return <SkeletonLoader />;
    if (isError) return <Error />;

    return (

        <>
            <CategorySection />
        <div className="product-page">

           
            <div className="page-header">
                <h2 className="title animate-char">Our Premium Collection</h2>
                <p className="subtitle animate-subtitle">Discover quality products for your needs</p>
            </div>

            <div className="product-grid">
                {visibleProducts.map((product) => (
                    <ProductCard
                        key={product.SNO}
                        product={product}
                        onQuickView={() => navigate(`/product/${product.SNO}`)}
                        onAddToCart={() => handleAddToCart(product)}
                    />
                ))}
            </div>

            {(hasMore || initialLimit) && (
                <div className="see-all-wrapper">
                    <button className="see-all-btn" onClick={handleLoadMore} disabled={isFetching}>
                        {initialLimit ? "See More Products" : "Load More"}
                    </button>
                </div>
            )}
        </div>
        </>
    );
}

export default Products;
