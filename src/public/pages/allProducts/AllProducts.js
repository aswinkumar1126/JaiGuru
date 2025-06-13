import React from "react";
import { useNavigate } from "react-router-dom";
import "./AllProducts.css";
import ProductCard from "../../components/productCard/ProductCard";
import { useProductsQuery } from "../../hook/product/useProductsQuery";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import Error from "../../components/error/Error";
import { useCart } from "../../hook/cart/useCartQuery"; // ✅

function Products() {
    const navigate = useNavigate();
    const { data: products, isLoading, isError } = useProductsQuery();
    const { addToCartHandler } = useCart(); // ✅

    if (isLoading) return <SkeletonLoader>Loading...</SkeletonLoader>;
    if (isError) return <Error>Error fetching products</Error>;

    const handleAddToCart = (product) => {
        console.log("🛒 Sending to addToCartHandler:", product);

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
                        onAddToCart={() => handleAddToCart(product)} // ✅
                    />
                ))}
            </div>
        </div>
    );
}

export default Products;
