import PublicUrl from "../api/publicUrl";

// ✅ Auth headers generator (fresh token every time)
const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    },
});

// ✅ Get Cart by phone number
export const fetchCart = () => {
    const mobileNumber = localStorage.getItem("userMobileNumber");

    if (!mobileNumber) {
        return Promise.reject("Mobile number not found in localStorage.");
    }

    return PublicUrl.get(`/cart/by-phone?phone=${mobileNumber}`, authHeader());
};

// ✅ Add item to cart
export const addToCart = (cartItem) => {
    return PublicUrl.post("/cart/create", cartItem, authHeader());
};

// ✅ Update existing cart item
export const updateCartItem = (cartItem) => {
    return PublicUrl.put("/cart/update", cartItem, authHeader());
};

// ✅ Delete item from cart
export const deleteCartItem = (id) => {
    return PublicUrl.delete(`/cart/delete/${id}`, authHeader());
};
