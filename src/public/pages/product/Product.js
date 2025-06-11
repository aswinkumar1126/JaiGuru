import React from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import Error from "../../components/error/Error";
import ProductCard from "../../components/productCard/ProductCard";

function Product({ products = [], loading, error }) {
    const navigate = useNavigate();

    if (error) {
        return <Error error={error} />;
    }

    console.log(products);

    return (
        <div className="product-container">
            <div className="page-header" >
                <h2 className="title animate-char">Our Premium Collection</h2>
                <p className="subtitle animate-subtitle">Discover quality products for your needs</p>
            </div>

            <div className="product-grid">
                {loading ? (
                    <SkeletonLoader count={6} />
                ) : (
                    (products ?? []).map((product) => (
                        <ProductCard
                            key={product.SNO}
                            product={product}
                            onQuickView={() => navigate(`/product/${product.SNO}`)}
                            onAddToCart={() => navigate(`/product/${product.id}`)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Product;
