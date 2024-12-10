<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import userIcon from '@/assets/user-icon.png'; // Import the image

const dropdownOpen = ref(false);
const authStore = useAuthStore();

// Toggle dropdown for mobile view
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Close dropdown after clicking a link
const closeDropdown = () => {
  dropdownOpen.value = false;
};

// Computed property to check if the user is logged in
const user = computed(() => authStore.user);
</script>

<template>
  <header class="bg-blue-600 text-white">
    <div class="container mx-auto flex justify-between items-center py-4 px-4">
      <!-- Logo -->
      <div class="text-xl font-bold">Hush</div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden text-white focus:outline-none"
        @click="toggleDropdown"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <!-- Navigation Links -->
      <nav
        :class="['flex-col md:flex-row md:space-x-6 md:flex', dropdownOpen ? 'flex' : 'hidden']"
        class="absolute md:static top-14 left-0 w-full md:w-auto bg-blue-600 md:bg-transparent z-10 md:z-auto"
      >
        <router-link
          to="/"
          class="block py-2 px-4 hover:bg-blue-700 md:hover:bg-transparent md:hover:text-gray-200"
          @click="closeDropdown"
        >
          Home
        </router-link>
        <router-link
          to="/products"
          class="block py-2 px-4 hover:bg-blue-700 md:hover:bg-transparent md:hover:text-gray-200"
          @click="closeDropdown"
        >
          Products
        </router-link>
        <router-link
          to="/support"
          class="block py-2 px-4 hover:bg-blue-700 md:hover:bg-transparent md:hover:text-gray-200"
          @click="closeDropdown"
        >
          Support
        </router-link>

        <!-- Conditional Display for User or Login/Register Links -->
        <template v-if="user">
          <!-- User Profile -->
          <div class="flex items-center space-x-2">
            <span class="text-white">{{ user.name }}</span>
            <router-link to="/dashboard/profile" @click="closeDropdown" >
              <img :src="userIcon" alt="User Icon" class="w-8 h-8 rounded-full" />
            </router-link>
          </div>
        </template>
        <template v-else> 
          <!-- Login/Register Links -->
          <router-link
            to="/login"
            class="block py-2 px-4 bg-white text-blue-600 rounded hover:bg-gray-100 md:bg-transparent md:hover:text-gray-200"
            @click="closeDropdown"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="block py-2 px-4 bg-blue-700 rounded hover:bg-blue-800"
            @click="closeDropdown"
          >
            Register
          </router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* Add styles here if necessary */
</style>
