import React, { useEffect, useState } from "react";
import { useSingleProductQuery } from "../../../hook/product/useSingleProductQuery";
import SkeletonLoader from "../../../components/loader/SkeletonLoader";


const CartItem = ({ item, isSelected, onSelectToggle, onRemove, onProductDataReady }) => {
    const { data: product, isLoading } = useSingleProductQuery(item.itemTagSno);
    const baseUrl = "https://jaigurujewellers.com";
    const [hasSentProductData, setHasSentProductData] = useState(false);

    useEffect(() => {
        if (!hasSentProductData && product && item?.itemTagSno) {
            onProductDataReady(item.itemTagSno, product);
            setHasSentProductData(true);
        }
    }, [product, item?.itemTagSno, hasSentProductData]);

    if (isLoading) return <SkeletonLoader />;

    let imageUrls = [];
    try {
        imageUrls = JSON.parse(product?.ImagePath || "[]");
    } catch (err) {
        console.error("Error parsing ImagePath", err);
    }

    const firstImage = imageUrls.length > 0 ? baseUrl + imageUrls[0] : "/images/placeholder.png";

    return (
        <div className="cart-item" role="listitem">
            <div className="cart-item-image-container">
                <img
                    src={firstImage}
                    alt={product?.ITEMNAME || "Jewellery item"}
                    className="cart-item-img"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = "/fallback.jpg";
                        e.target.alt = "Image not available";
                    }}
                />
            </div>
            <div className="cart-item-details">

                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectToggle(item.itemTagSno)}
                    aria-label={`Select ${product?.ITEMNAME || "item"}`}
                    className="cart-item-checkbox"
                />
                <h4 className="cart-item-title">{product?.ITEMNAME || "Jewellery Item"}</h4>

                <p className="cart-item-tag"><strong>Tag No:</strong> {item.tagNo}</p>
                <p className="cart-item-weight">Weight: {product?.NETWT || item.netWt || "N/A"}g</p>
                <p className="cart-item-price">
                    ₹{product?.GrandTotal
                        ? Number(product.GrandTotal).toFixed(2)
                        : (item.amount || 0).toFixed(2)}
                </p>

                <div className="cart-item-options">
                    <button
                        className="remove-btn"
                        onClick={() => onRemove(item.sno)}
                        aria-label={`Remove ${product?.ITEMNAME || "item"} from cart`}
                    >
                        REMOVE
                    </button>
                    <button
                        className="save-btn"
                        onClick={() => alert("Feature coming soon")}
                        aria-label={`Save ${product?.ITEMNAME || "item"} for later`}
                    >
                        SAVE FOR LATER
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;