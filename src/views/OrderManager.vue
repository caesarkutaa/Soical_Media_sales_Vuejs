<template>
  <div class="p-4 sm:p-6">
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Order Management</h1>

    <!-- Loading and Error Messages -->
    <div v-if="isLoading" class="text-center my-4">
      <p>Loading orders...</p>
    </div>
    <div v-if="error" class="text-center my-4 text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- Orders Table -->
    <div v-if="orders.length > 0 && !isLoading" class="overflow-x-auto">
      <table class="table-auto w-full border-collapse border border-gray-200 hidden sm:table">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-4 py-2">#</th>
            <th class="border px-4 py-2">Order ID</th>
            <th class="border px-4 py-2">Customer Name</th>
            <th class="border px-4 py-2">Customer Email</th>
            <th class="border px-4 py-2">Products</th>
            <th class="border px-4 py-2">Total</th>
            <th class="border px-4 py-2">Status</th>
            <th class="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="order._id" class="hover:bg-gray-50">
            <td class="border px-4 py-2">{{ index + 1 }}</td>
            <td class="border px-4 py-2">{{ order._id }}</td>
            <td class="border px-4 py-2">{{ order.userDetails.name || "N/A" }}</td>
            <td class="border px-4 py-2">{{ order.userDetails.email || "N/A" }}</td>
            <td class="border px-4 py-2">
              <ul>
                <li v-for="product in order.products" :key="product.productId">
                  <span>Product name: {{ product.name }}</span>,
                  <span>Product name: {{ product.description }}</span>,  
                  <span>Quantity: {{ product.quantity }}</span>
                </li>
              </ul>
            </td>
            <td class="border px-4 py-2">${{ order.totalAmount || 0 }}</td>
            <td class="border px-4 py-2">
              <select
                v-model="order.status"
                @change="updateStatus(order._id, order.status)"
                class="border rounded px-2 py-1"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </td>
            <td class="border px-4 py-2 text-center">
              <button
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                @click="deleteOrder(order._id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Responsive Cards for Smaller Screens -->
      <div class="sm:hidden space-y-4">
        <div
          v-for="(order, index) in orders"
          :key="order._id"
          class="border rounded-lg p-4 shadow-sm"
        >
          <div class="flex justify-between items-center">
            <p class="text-sm text-gray-500">Order #{{ index + 1 }}</p>
            <button
              class="text-red-500 hover:underline"
              @click="deleteOrder(order._id)"
            >
              Delete
            </button>
          </div>
          <p class="text-gray-700">
            <strong>Customer Name:</strong> {{ order.userDetails.name || "N/A" }}
          </p>
          <p class="text-gray-700">
            <strong>Customer Email:</strong> {{ order.userDetails.email || "N/A" }}
          </p>
          <p class="text-gray-700">
            <strong>Products:</strong>
          </p>
          <ul class="text-gray-700 pl-4 list-disc">
            <li v-for="product in order.products" :key="product.productId">
              Name: {{ product.name }}, Products Description  : {{ product.description }}, Quantity: {{ product.quantity }}
            </li>
          </ul>
          <p class="text-gray-700">
            <strong>Total:</strong> ${{ order.totalAmount || 0 }}
          </p>
          <div class="mt-2">
            <label for="status" class="text-sm text-gray-600">Status</label>
            <select
              v-model="order.status"
              @change="updateStatus(order._id, order.status)"
              class="border rounded px-2 py-1 w-full mt-1"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1 && !isLoading" class="mt-4 flex justify-center space-x-4">
      <button
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        :disabled="currentPage === 1"
        @click="fetchOrders(currentPage - 1)"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        :disabled="currentPage === totalPages"
        @click="fetchOrders(currentPage + 1)"
      >
        Next
      </button>
    </div>

    <!-- No Orders Message -->
    <div v-if="orders.length === 0 && !isLoading" class="text-center mt-4">
      <p>No orders found.</p>
    </div>
  </div>
</template>



<script>
import { defineComponent, onMounted } from "vue";
import { useOrderStore } from "@/stores/useOrderStore";

export default defineComponent({
  setup() {
    const orderStore = useOrderStore();

    // Fetch orders on component mount
    onMounted(() => {
      orderStore.fetchAllOrdersByAdmin(); // Load all orders for admin
    });

    return {
      orders: orderStore.orders,
      isLoading: orderStore.isLoading,
      error: orderStore.error,
      currentPage: orderStore.currentPage,
      totalPages: orderStore.totalPages,

      // Methods
      fetchOrders: orderStore.fetchAllOrdersByAdmin,
      updateStatus: orderStore.updateOrderStatus,
      deleteOrder: async (orderId) => {
        try {
          await orderStore.updateOrderStatus(orderId, "Completed");
          orderStore.fetchAllOrdersByAdmin(orderStore.currentPage);
        } catch (err) {
          console.error(err.message);
        }
      },
    };
  },
});
</script>
