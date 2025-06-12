import React from "react";
import { useNavigate } from "react-router-dom";
import "./AllProducts.css";
import ProductCard from "../../components/productCard/ProductCard";
import { useProductsQuery } from "../../hook/product/useProductsQuery";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import Error from "../../components/error/Error";


function Products() {
    const navigate = useNavigate();


    const { data: products, isLoading, isError } = useProductsQuery();
    console.log(products);

    if (isLoading) return <SkeletonLoader>Loading...</SkeletonLoader>;
    if (isError) return <Error>Error fetching products</Error>;

    return (
        <div className="product-page">
            <div className="page-header">
                <h2 className="title animate-char">Our Premium Collection</h2>
                <p className="subtitle animate-subtitle">Discover quality products for your needs</p>
            </div>

            <div className="product-grid">

                {(products ?? []).map((product) => (
                    <ProductCard
                        key={product.SNO}
                        product={product}
                        onQuickView={() => navigate(`/product/${product.SNO}`)}
                        onAddToCart={() => navigate(`/product/${product.id}`)}
                    />
                )
                )}
            </div>
        </div>
    );
}

export default Products;
