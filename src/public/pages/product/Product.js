import React from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import Error from "../../components/error/Error";
import ProductCard from "../../components/productCard/ProductCard";
import { useCart } from "../../hook/cart/useCartQuery"; // ✅ Import hook
import Button from '../../components/button/Button';

function Product({ products = [], loading, error }) {
    const user=localStorage.getItem('user');
    //console.log("user",user);
    const navigate = useNavigate();
    const { addToCartHandler } = useCart(); // ✅ Get addToCart function

    if (error) {
        return <Error error={error} />;
    }

    // console.log(products);
    const handleAddToCart = (product) => {
        if (user===null) {
            localStorage.setItem(
                "redirectAfterLogin",
                JSON.stringify({
                    path: window.location.pathname
                })
            );
            navigate("/login");
            return;
        }

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
            <div className="see-more-wrapper">
                <Button
                    label="See More Products"
                    onClick={() => navigate("/products")}
                    variant="primary"
                    size="medium"
                    className="see-more-btn"
                />
            </div>
        </div>
    );
}

export default Product;
