<template>
  <div class="relative flex min-h-screen">
    <!-- Sidebar -->
    <div
      class="bg-cyan-600 text-cyan-100 w-64 space-y-6 px-2 py-4 inset-y-0 left-0 transform transition duration-200 ease-in-out fixed z-50"
      :class="{ '-translate-x-full': !isMenuOpen, 'translate-x-0': isMenuOpen }"
    >
      <!-- Logo -->
      <a href="#" class="flex items-center space-x-2 px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-10 h-10"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 2.25l2.25 1.313M12 2.25l-2.25 1.313m0 16.875L12 21.75l2.25-1.313m0-16.875L12 2.25m0 0L9.75 3.563m12 14.187L21 16.5m0 0v-2.25m0 2.25-2.25 1.313m-13.5 0L3 16.5v-2.25m18 2.25v2.25l-2.25 1.313M12 2.25v10.5m0 6.75v-6.75m0 6.75H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V19.5m0-6.75h2.25M8.25 21H6V19.5m0 0h-.375c-.621 0-1.125-.504-1.125-1.125V15m1.5 4.5V21m0 0H3v-1.5m18 0v-4.125c0-.621-.504-1.125-1.125-1.125H15m0 5.25h3m-6 0H3v-4.125c0-.621.504-1.125 1.125-1.125H9.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <span class="text-2xl font-extrabold text-white">Admin Panel</span>
      </a>

      <!-- Navigation -->
      <nav>
        <router-link
          to="/admin/products"
          class="group flex items-center space-x-2 py-3 px-4 hover:bg-cyan-700 rounded hover:text-cyan-300"
          @click="closeDropdown"
        >
          <span>Products</span>
        </router-link>
        <router-link
          to="/admin/orders"
          class="group flex items-center space-x-2 py-3 px-4 hover:bg-cyan-700 rounded hover:text-cyan-300"
          @click="closeDropdown"
        >
          <span>Orders</span>
        </router-link>
        <router-link
          to="/admin/payments"
          class="group flex items-center space-x-2 py-3 px-4 hover:bg-cyan-700 rounded hover:text-cyan-300"
          @click="closeDropdown"
        >
          <span>Payments</span>
        </router-link>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1">
      <div class="bg-white shadow px-2 py-4">
        <!-- Toggle Button -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="text-cyan-600 font-extrabold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-8 h-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
      <div class="p-8 text-cyan-700 font-extrabold">
        <!-- Render child routes -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const isMenuOpen = ref(false); // Sidebar open/close state

    // Function to close the sidebar when navigation items are clicked
    const closeDropdown = () => {
      isMenuOpen.value = false; // Close the sidebar
    };

    return { isMenuOpen, closeDropdown };
  },
};
</script>

