<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">Product List</h1>

    <!-- Search Bar -->
    <div class="mb-4 flex items-center justify-between flex-wrap">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search Products..."
        class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 mb-2 sm:mb-0"
      />
      <button
        @click="fetchProducts"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
      >
        Refresh
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center">Loading products...</div>

    <!-- No Products Found -->
    <div v-if="!isLoading && paginatedProducts.length === 0" class="text-center mt-4">
      No products available.
    </div>

    <!-- Table for Larger Screens -->
    <div v-if="!isLoading && paginatedProducts.length > 0">
      <table class="table-auto border-collapse border border-gray-200 w-full hidden sm:table">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 border text-left">#</th>
            <th class="px-4 py-2 border text-left">Name</th>
            <th class="px-4 py-2 border text-left">Category</th>
            <th class="px-4 py-2 border text-left">Price</th>
            <th class="px-4 py-2 border text-left">Stock</th>
            <th class="px-4 py-2 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(product, index) in paginatedProducts"
            :key="product._id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2 border text-center">{{ index + 1 + (page - 1) * 10 }}</td>
            <td class="px-4 py-2 border">{{ product.name }}</td>
            <td class="px-4 py-2 border">{{ product.category }}</td>
            <td class="px-4 py-2 border">${{ product.price }}</td>
            <td
              :class="{
                'text-green-500': product.stock > 0,
                'text-red-500': product.stock === 0,
              }"
              class="px-4 py-2 border text-center"
            >
              {{ product.stock }}
            </td>
            <td class="px-4 py-2 border text-center">
              <button
                class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                @click="addToCart(product._id, 1, index)"
              >
                Add to Cart
              </button>
              <!-- Success Message -->
              <div v-show="showSuccessMessage[index]" class="mt-2 text-green-500">
                Product added to cart successfully!
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Responsive View -->
      <div class="sm:hidden">
        <div
          v-for="(product, index) in paginatedProducts"
          :key="product._id"
          class="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
        >
          <p class="text-sm font-semibold">#{{ index + 1 + (page - 1) * 10 }}</p>
          <p><strong>Name:</strong> {{ product.name }}</p>
          <p><strong>Description:</strong> {{ product.description }}</p>
          <p><strong>Price:</strong> ${{ product.price }}</p>
          <p>
            <strong>Stock:</strong>
            <span
              :class="{
                'text-green-500': product.stock > 0,
                'text-red-500': product.stock === 0,
              }"
            >
              {{ product.stock }}
            </span>
          </p>
          <button
            class="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            @click="addToCart(product._id, 1, index)"
          >
            Add to Cart
          </button>
          <!-- Success Message -->
          <div v-show="showSuccessMessage[index]" class="mt-2 text-green-500">
            Product added to cart successfully!
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div
      v-if="!isLoading && filteredProducts.length > 0"
      class="mt-4 flex items-center justify-center space-x-4"
    >
      <button
        :disabled="page === 1"
        @click="changePage(page - 1)"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button
        :disabled="page === totalPages"
        @click="changePage(page + 1)"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";

export default defineComponent({
  setup() {
    const productStore = useProductStore();
    const cartStore = useCartStore();
    const showSuccessMessage = ref([]); // Array to track which product index should show the success message
    const productsPerPage = 10;

    // Add to cart function with success message
    const addToCart = async (productId, quantity, index) => {
      try {
        await cartStore.addToCart(productId, quantity); // Add product to cart
        // Show success message for the specific product
        showSuccessMessage.value[index] = true;
        // Hide the success message after 3 seconds
        setTimeout(() => {
          showSuccessMessage.value[index] = false;
        }, 3000);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    };

    return {
      ...productStore,
      showSuccessMessage,
      addToCart,
      searchQuery: "",
      page: 1,
      productsPerPage,
      get filteredProducts() {
        if (this.isLoading) return [];
        if (!this.searchQuery) return this.products;
        return this.products.filter((product) =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
      get paginatedProducts() {
        const start = (this.page - 1) * this.productsPerPage;
        const end = start + this.productsPerPage;
        return this.filteredProducts.slice(start, end);
      },
      get totalPages() {
        return Math.ceil(this.filteredProducts.length / this.productsPerPage);
      },
      changePage(newPage) {
        if (newPage > 0 && newPage <= this.totalPages) {
          this.page = newPage;
        }
      },
    };
  },
  mounted() {
    this.fetchProducts();
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
  .table-auto {
    display: none;
  }
}

@media (min-width: 641px) {
  .sm\:hidden {
    display: none;
  }
}
</style>
