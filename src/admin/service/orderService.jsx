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

      // 🔹 5. Get Paginated Pending Orders
      getPaginatedPendingOrders: (page, size) =>
            axiosInstance.get("/order/pending-orders", {
                  params: { page, size },
            }),

      // 🔹 6. Get Paginated Delivered Orders
      getPaginatedDeliveredOrders: (page, size) =>
            axiosInstance.get("/order/delivered-orders", {
                  params: { page, size },
            }),

      // 🔹 7. Get Paginated Cancelled Orders
      getPaginatedCancelledOrders: (page, size) =>
            axiosInstance.get("/order/cancelled-orders", {
                  params: { page, size },
            }),

      // 🔹 8. Get Paginated Shipped Orders
      getPaginatedShippedOrders: (page, size) =>
            axiosInstance.get("/order/shipped-orders", {
                  params: { page, size },
            }),

      // 🔹 9. Get Total Revenue
      getTotalRevenue: () =>
            axiosInstance.get("/order/total-revenue"),

      // 🔹 10. Get Today's Revenue
      getTodayRevenue: () =>
            axiosInstance.get("/order/today-revenue"),

      // 🔹 11. Get Monthly Sales Report
      getMonthlySalesReport: () =>
            axiosInstance.get("/order/monthly-sales"),
};