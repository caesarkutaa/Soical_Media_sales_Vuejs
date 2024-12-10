<script setup>
import { onMounted, computed } from 'vue';
import { useProductStore } from '@/stores/productStore';
import OrderButton from '@/components/addTocartButton.vue';

// Access the product store
const productStore = useProductStore();

// Fetch products on component mount
onMounted(async () => {
  try {
    await productStore.fetchProducts();
  } catch (error) {
    console.error('Error during onMounted:', error);
  }
});

// Use computed properties for reactive binding
const products = computed(() => productStore.products); // Reactive array of products
const loading = computed(() => productStore.isLoading); // Reactive loading state
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-blue-50 py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 leading-tight">
          Your Marketplace for Social Media Accounts
        </h2>
        <p class="text-gray-600 text-base md:text-lg mb-8">
          Secure and verified accounts for Facebook, Instagram, VPNs, and more.
        </p>
        <router-link
          to="/products"
          class="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Browse Products
        </router-link>
      </div>
    </section>

    <!-- Products Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h3 class="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
          Explore Our Products
        </h3>
        <div v-if="loading" class="text-center">
          <p class="text-xl font-semibold text-gray-600">Loading...</p>
        </div>
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="product in products"
            :key="product._id"
            class="bg-white shadow-lg rounded-lg p-4 hover:shadow-2xl transform transition-all duration-300 hover:scale-105"
          >

            <!-- Product Info -->
            <h2 class="text-lg font-semibold mb-2">{{ product.name }}</h2>
            <p class="text-gray-600 mb-4">{{ product.description }}</p>
            <p class="text-xl font-bold text-blue-600">N{{ product.price }}</p>

            <!-- Order Button -->
            <OrderButton
              class="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 w-full"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<style scoped>
/* Product Card Styles */
.bg-white {
  background-color: #ffffff;
}

.shadow-lg {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.shadow-2xl {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.transform {
  transition: transform 0.3s ease-in-out;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.relative {
  position: relative;
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

.object-cover {
  object-fit: cover;
}

.rounded-lg {
  border-radius: 8px;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

.text-blue-600 {
  color: #3b82f6;
}

.text-xl {
  font-size: 1.25rem;
}

.font-bold {
  font-weight: 700;
}

.bg-blue-600 {
  background-color: #3b82f6;
}

.hover\:bg-blue-700:hover {
  background-color: #2563eb;
}

.w-full {
  width: 100%;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

.transition-all {
  transition: all 0.3s ease;
}
</style>
