import axiosInstance from "../api/axiosInstance";

export const orderService = {
      // 🔹 1. Get All Orders (Paginated)
      getAllOrders: (page, size) =>
            axiosInstance.get("/order/all-ordersCount", {
                  params: { page, size },
            }),

      // 🔹 2. Update Order Status
      updateStatus: (payload) =>
            axiosInstance.post("/order/update-status", payload),

      // 🔹 3. Track Order by ID
      trackOrder: (orderId) =>
            axiosInstance.get("/order/track-order", {
                  params: { orderId },
            }),

      // 🔹 4. Verify Payment
      verifyPayment: (orderId) =>
            axiosInstance.get("/payment/verify-payment", {
                  params: { orderId },
            }),
};
