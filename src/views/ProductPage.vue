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
  
      <!-- Product Table for Larger Screens -->
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
              <td class="px-4 py-2 border text-center">{{ index + 1 + (page - 1) * productsPerPage }}</td>
              <td class="px-4 py-2 border">{{ product.name }}</td>
              <td class="px-4 py-2 border">{{ product.description }}</td>
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
                  @click="handleAddToCart(product._id, index)"
                >
                  Add to Cart
                </button>
                <div v-show="showSuccessMessage[index]" class="mt-2 text-green-500">
                  Product added to cart successfully!
                </div>
              </td>
            </tr>
          </tbody>
        </table>
  
        <!-- Responsive Cards -->
        <div class="sm:hidden">
          <div
            v-for="(product, index) in paginatedProducts"
            :key="product._id"
            class="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
          >
            <p class="text-sm font-semibold">#{{ index + 1 + (page - 1) * productsPerPage }}</p>
            <p><strong>Name:</strong> {{ product.name }}</p>
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
              @click="handleAddToCart(product._id, index)"
            >
              Add to Cart
            </button>
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
  import { ref, computed } from "vue";
  import { useProductStore } from "@/stores/productStore";
  import { useCartStore } from "@/stores/cartStore";
  import { useAuthStore } from "@/stores/authStore";
  import { useRouter } from "vue-router";
  
  export default {
    setup() {
      const productStore = useProductStore();
      const cartStore = useCartStore();
      const authStore = useAuthStore();
      const router = useRouter();
  
      const showSuccessMessage = ref([]);
      const searchQuery = ref("");
      const page = ref(1);
      const productsPerPage = 10;
  
      const handleAddToCart = async (productId, index) => {
        if (!authStore.isAuthenticated) {
          router.push("/login");
          return;
        }
        try {
          await cartStore.addToCart(productId);
          showSuccessMessage.value[index] = true;
          setTimeout(() => (showSuccessMessage.value[index] = false), 3000);
        } catch (error) {
          console.error("Error adding to cart:", error);
        }
      };
  
      const filteredProducts = computed(() =>
        productStore.products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      );
  
      const paginatedProducts = computed(() =>
        filteredProducts.value.slice((page.value - 1) * productsPerPage, page.value * productsPerPage)
      );
  
      const totalPages = computed(() => Math.ceil(filteredProducts.value.length / productsPerPage));
  
      const changePage = (newPage) => {
        if (newPage > 0 && newPage <= totalPages.value) {
          page.value = newPage;
        }
      };
  
      return {
        ...productStore,
        searchQuery,
        page,
        productsPerPage,
        filteredProducts,
        paginatedProducts,
        totalPages,
        changePage,
        showSuccessMessage,
        handleAddToCart,
      };
    },
    mounted() {
      this.fetchProducts();
    },
  };
  </script>
  