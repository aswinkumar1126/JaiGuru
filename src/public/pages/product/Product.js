import React from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import Error from "../../components/error/Error";
import ProductCard from "../../components/productCard/ProductCard";
import { useCart } from "../../hook/cart/useCartQuery"; // ✅ Import hook

function Product({ products = [], loading, error }) {
    const navigate = useNavigate();
    const { addToCartHandler } = useCart(); // ✅ Get addToCart function

    if (error) {
        return <Error error={error} />;
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
        <div className="product-container">
            <div className="page-header">
                <h2 className="title animate-char">Our Premium Collection</h2>
                <p className="subtitle animate-subtitle">
                    Discover quality products for your needs
                </p>
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
                            onAddToCart={() => handleAddToCart(product)} // ✅ Use handler here
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Product;
