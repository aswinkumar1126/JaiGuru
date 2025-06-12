import React from "react";
import { useCart } from "../../hook/cart/useCartQuery";

const CartPage = () => {
    const { cartItems, isLoading, updateCart, deleteCart, error } = useCart();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error.message || "Something went wrong"}</p>;


    const handleIncrease = (item) => {
        const updatedItem = {
            ...item,
            quantity: item.quantity + 1,
        };
        updateCart(updatedItem);
    };

    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            const updatedItem = {
                ...item,
                quantity: item.quantity - 1,
            };
            updateCart(updatedItem);
        }
    };

    return (
        <div>
            <h2>Your Cart</h2>

            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error.message || "Failed to load cart."}</p>
            ) : cartItems?.data?.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                cartItems.data.map((item) => (
                    <div key={item.sno} style={{ marginBottom: "1.5rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
                        <p><strong>Tag No:</strong> {item.itemTagSno}</p>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <button onClick={() => handleDecrease(item)}>-</button>
                            <p style={{ margin: 0 }}>{item.quantity} qty</p>
                            <button onClick={() => handleIncrease(item)}>+</button>
                        </div>

                        <button
                            onClick={() => deleteCart(item.sno)}
                            style={{
                                marginTop: "10px",
                                backgroundColor: "#dc3545",
                                color: "#fff",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer",
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ))
            )}

        </div>
    );
};

export default CartPage;
