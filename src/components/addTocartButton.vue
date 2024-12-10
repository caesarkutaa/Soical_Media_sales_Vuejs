<template>
  <div>
    <button
      @click="addToCart"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      :disabled="isLoading"
    >
      {{ isLoading ? "Adding..." : "Add to Cart" }}
    </button>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    <p v-if="successMessage" class="text-green-500 mt-2">{{ successMessage }}</p>
  </div>
</template>

<script>
import { useCartStore } from '../stores/cartStore'; // Assuming you have a cart store
import { useAuthStore } from '../stores/authStore'; // For user authentication
import { useRouter } from 'vue-router'; // For redirection

export default {
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const cartStore = useCartStore(); // Access the cart store
    const authStore = useAuthStore(); // Access the auth store
    const router = useRouter(); // Get router instance

    // Add to Cart function
    const addToCart = async () => {
      console.log("Add to Cart button clicked"); // Debug log
      try {
        // Check if the user is authenticated
        if (!authStore.isAuthenticated) {
          console.log("User not authenticated, redirecting to login...");
          router.push('/login');
          return;
        }

        // Proceed with adding product to cart
        console.log("Proceeding with adding to cart...");
        await cartStore.addProductToCart(props.productId);
        alert("Product added to cart successfully!");
      } catch (err) {
        console.log("Error adding to cart:", err);
        alert(cartStore.error || "Something went wrong.");
      }
    };

    return {
      addToCart,
      isLoading: cartStore.isLoading,
      error: cartStore.error,
    };
  },
};
</script>
