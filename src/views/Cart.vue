<template>
    <div class="cart-container">
      <h2 class="text-2xl font-semibold mb-4">Your Cart</h2>
  
      <!-- If cart is empty, show message -->
      <div v-if="cart.items.length === 0" class="text-center">
        <p>Your cart is empty. Add some products!</p>
      </div>
  
      <div v-else>
        <!-- Table for larger screens -->
        <div class="hidden sm:block">
          <table class="table-auto w-full border-collapse mb-4">
            <thead>
              <tr class="bg-gray-100">
                <th class="px-4 py-2 text-left">Product</th>
                <th class="px-4 py-2 text-left">Quantity</th>
                <th class="px-4 py-2 text-left">Price</th>
                <th class="px-4 py-2 text-left">Total</th>
                <th class="px-4 py-2 text-left">Remove</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in cart.items" :key="item.productId._id">
                <td class="px-4 py-2">{{ item.productId.name }}</td>
                <td class="px-4 py-2">{{ item.quantity }}</td>
                <td class="px-4 py-2">${{ item.productId.price }}</td>
                <td class="px-4 py-2">${{ item.productId.price * item.quantity }}</td>
                <td class="px-4 py-2">
                  <button
                    @click="removeFromCart(cart._id, item.productId._id)"
                    class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
  
          <div class="flex justify-between items-center mt-4">
            <p class="font-semibold">Total: ${{ cart.totalAmount }}</p>
            <button
              @click="checkout"
              class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
  
        <!-- Mobile-friendly view -->
        <div class="sm:hidden">
          <div
            v-for="(item, index) in cart.items"
            :key="item.productId._id"
            class="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
          >
            <p class="font-semibold">{{ item.productId.name }}</p>
            <p><strong>Quantity:</strong> {{ item.quantity }}</p>
            <p><strong>Price:</strong> ${{ item.productId.price }}</p>
            <p><strong>Total:</strong> ${{ item.productId.price * item.quantity }}</p>
            <div class="flex justify-between items-center mt-4">
              <button
                @click="removeFromCart(cart._id, item.productId._id)"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
  
          <div class="flex justify-between items-center mt-4">
            <p class="font-semibold">Total: ${{ cart.totalAmount }}</p>
            <button
              @click="checkout"
              class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, computed } from 'vue';
  import { useCartStore } from '@/stores/cartStore';
  import { useAuthStore } from '@/stores/authStore';
  import { useRouter } from 'vue-router'
   // Pinia store
  
  export default defineComponent({
    setup() {
      const cartStore = useCartStore();
      const authStore = useAuthStore();
      const router = useRouter();
      const cart = computed(() => cartStore.cart);
  
      const fetchCart = async () => {
        await cartStore.fetchCart();
      };
  
      const removeFromCart = async (cartId,productId) => {
        await cartStore.removeFromCart(cartId,productId);
      };
  
      const checkout = async () => {
  try {
    const userId = authStore.user?._id; // Ensure user is logged in
    if (!userId) {
      throw new Error("User is not authenticated.");
    }

    await cartStore.placeOrder(userId);

    // Navigate to order summary
    router.push("/dashboard/order-summary");
  } catch (error) {
    console.error("Checkout failed:", error);
    alert("Checkout failed. Please try again.");
  }
};
      return {
        cart,
        fetchCart,
        removeFromCart,
        checkout,
      };
    },
    mounted() {
      this.fetchCart(); // Load cart on page mount
    },
  });
  </script>
  
  <style scoped>
  .table-auto th,
  .table-auto td {
    text-align: left;
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  .sm\\:hidden {
    display: none;
  }
  
  @media (max-width: 640px) {
    .sm\\:block {
      display: none;
    }
  }
  </style>
  