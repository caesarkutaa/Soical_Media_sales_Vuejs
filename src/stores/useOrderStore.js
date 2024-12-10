import { defineStore } from "pinia";
import axios from "@/api/axios"; // Replace with your actual Axios instance
import { useAuthStore } from "./authStore"; // Import the auth store

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [], // List of orders
    isLoading: false, // Loading state
    error: null, // Error messages
    currentPage: 1, // Current page number
    totalPages: 1, // Total number of pages
    pageSize: 10, // Number of orders per page
  }),
  actions: {
    // Create a new order
    async createOrder(productId) {
      const authStore = useAuthStore();

      try {
        this.isLoading = true;
        this.error = null;

        const response = await axios.post(
          `/order/`,
          { productId },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );

        const newOrder = response.data;
        this.orders.push(newOrder); // Add to local state
        return newOrder;
      } catch (err) {
        this.error = err.response?.data?.msg || "Failed to create order";
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch all orders for the authenticated user (pagination supported)
    async fetchOrders(page = 1) {
      const authStore = useAuthStore();

      try {
        this.isLoading = true;

        const response = await axios.get(`/order`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
          params: { page, limit: this.pageSize },
        });

        this.orders = response.data.orders;
        this.currentPage = response.data.currentPage || page;
        this.totalPages = response.data.totalPages || 1;
      } catch (err) {
        this.error = err.response?.data?.msg || "Failed to fetch orders";
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch all orders by admin
    async fetchAllOrdersByAdmin(page = 1) {
      const authStore = useAuthStore();

      try {
        this.isLoading = true;

        const response = await axios.get(`/order/orders`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
          params: { page, limit: this.pageSize },
        });

        this.orders = response.data.orders;
        this.currentPage = response.data.currentPage || page;
        this.totalPages = response.data.totalPages || 1;
      } catch (err) {
        this.error = err.response?.data?.msg || "Failed to fetch all orders";
      } finally {
        this.isLoading = false;
      }
    },

    // Upload proof of payment
    async uploadProof(orderId, file) {
      const authStore = useAuthStore();

      try {
        this.isLoading = true;
        this.error = null;

        const formData = new FormData();
        formData.append("proofOfPayment", file);

        await axios.post(`/order/upload-proof`, formData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        // Successfully uploaded proof
      } catch (err) {
        this.error = err.response?.data?.msg || "Failed to upload proof of payment";
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    // Update order status
    async updateOrderStatus(orderId, status) {
      const authStore = useAuthStore();

      try {
        this.isLoading = true;
        this.error = null;

        const response = await axios.put(
          `/order/${orderId}/status`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );

        // Update local state
        const updatedOrder = response.data;
        const index = this.orders.findIndex((order) => order._id === orderId);
        if (index !== -1) this.orders[index].status = updatedOrder.status;
      } catch (err) {
        this.error = err.response?.data?.msg || "Failed to update order status";
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
