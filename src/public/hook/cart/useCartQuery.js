import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
} from "../../service/cartService";

export const useCart = () => {
    const queryClient = useQueryClient();

    // Always get the latest values from localStorage
    const token = localStorage.getItem("user_token");

    const {
        data: cartItems = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["cart"],
        queryFn: fetchCart,
        enabled: !!token, // Only fetch if logged in
        staleTime: 1000 * 60 * 5, // 5 mins
    });

    // ✅ Mutation for adding item
    const addItem = useMutation({
        mutationFn: addToCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (err) => {
            console.error("❌ Add to cart failed:", err);
            alert("Failed to add item to cart.");
        },
    });

    // ✅ Mutation for updating item
    const updateItem = useMutation({
        mutationFn: updateCartItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (err) => {
            console.error("❌ Update cart failed:", err);
            alert("Failed to update cart item.");
        },
    });

    // ✅ Mutation for deleting item
    const deleteItem = useMutation({
        mutationFn: deleteCartItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (err) => {
            console.error("❌ Delete cart failed:", err);
            alert("Failed to delete item.");
        },
    });

    // ✅ Handler for checking and adding/updating cart
    const addToCartHandler = (newItem) => {
        // console.log("🛒 Add to Cart Handler Triggered:", newItem);

        const mobileNumber = localStorage.getItem("userMobileNumber");
        if (!mobileNumber) {
            alert("User mobile number not found. Please login again.");
            return;
        }

        const existingItem = Array.isArray(cartItems?.data)
            ? cartItems.data.find((item) => item.itemTagSno === newItem.itemTagSno)
            : null;

        if (existingItem) {
            updateItem.mutate({
                ...existingItem,
                quantity: existingItem.quantity + (newItem.quantity || 1),
            });
        } else {
            addItem.mutate({
                ...newItem,
                phone: mobileNumber, // ✅ REQUIRED FIELD
                quantity: newItem.quantity || 1,
            });
        }
    };
    

    return {
        cartItems,
        isLoading,
        error,
        addToCart: addItem.mutate,
        updateCart: updateItem.mutate,
        deleteCart: deleteItem.mutate,
        addToCartHandler,
    };
};
