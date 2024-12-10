<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">Order History</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center my-4">
      <p class="text-blue-500">Loading orders...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center my-4">
      <p class="text-red-500">{{ error }}</p>
      <button
        @click="fetchOrders(page)"
        class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Retry
      </button>
    </div>

    <!-- Order Table -->
    <div v-if="orders.length && !isLoading" class="overflow-x-auto">
      <table class="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 border text-left">#</th>
            <th class="px-4 py-2 border text-left">Product Name</th>
            <th class="px-4 py-2 border text-left">Status</th>
            <th class="px-4 py-2 border text-left">Total</th>
            <th class="px-4 py-2 border text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(order, index) in paginatedOrders"
            :key="order._id"
            class="hover:bg-gray-50 even:bg-gray-100"
          >
            <td class="px-4 py-2 border text-center">{{ index + 1 + (page - 1) * limit }}</td>
            <td class="px-4 py-2 border">{{ order.product.name }}</td>
            <td
              :class="{
                'text-green-500': order.status === 'confirmed',
                'text-red-500': order.status === 'pending',
              }"
              class="px-4 py-2 border text-center capitalize"
            >
              {{ order.status }}
            </td>
            <td class="px-4 py-2 border text-center">${{ order.product.price }}</td>
            <td class="px-4 py-2 border text-center">{{ formatDate(order.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="orders.length && !isLoading" class="mt-4 flex items-center justify-center space-x-4">
      <button
        :disabled="page === 1"
        @click="changePage(page - 1)"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      <span>Page {{ page }}</span>
      <button
        :disabled="!hasMore"
        @click="changePage(page + 1)"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useOrderStore } from '@/stores/useOrderStore';

export default defineComponent({
  setup() {
    const orderStore = useOrderStore();

    const formatDate = (date) =>
      new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }).format(new Date(date));

    const changePage = (newPage) => {
      orderStore.fetchOrders(newPage);
    };

    return {
      ...orderStore,
      formatDate,
      changePage,
    };
  },
  mounted() {
    this.fetchOrders(); // Fetch orders on mount
  },
});
</script>

<style scoped>
.table-auto {
  border-spacing: 0;
  width: 100%;
}

.table-auto th,
.table-auto td {
  text-align: left;
}

@media (max-width: 640px) {
  .table-auto th,
  .table-auto td {
    font-size: 14px;
  }

  .table-auto {
    width: 100%;
  }

  .table-auto td,
  .table-auto th {
    padding: 8px;
  }
}
</style>
