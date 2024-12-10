<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full sm:w-96">
      <h2 class="text-3xl font-bold text-center text-blue-600 mb-4">Login</h2>
      <p class="text-gray-600 text-center mb-6">Welcome back! Please login to your account.</p>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
          :disabled="loading"
        >
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>

      <!-- Success Message -->
      <p v-show="loginSuccess" class="text-green-600 text-center mt-4">
        Login successful!
      </p>

      <!-- Error Message -->
      <p v-show="loginError" class="text-red-600 text-center mt-4">
        {{ errorMessage }}
      </p>

      <p class="text-gray-600 text-center mt-4">
        Don’t have an account?
        <router-link to="/register" class="text-blue-600 font-semibold hover:underline">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const authStore = useAuthStore();
    const router = useRouter();

    const loading = ref(false); // Loading state
    const loginSuccess = ref(false); // Success message visibility
    const loginError = ref(false); // Error message visibility
    const errorMessage = ref(''); // Error message content

    const handleLogin = async () => {
      loading.value = true; // Show loading state
      try {
        await authStore.login(email.value, password.value);
        loginSuccess.value = true; // Show success message
        loginError.value = false; // Hide error message
        setTimeout(() => router.push('/dashboard/profile'), 2000); // Redirect after 2 seconds
      } catch (error) {
        loginSuccess.value = false; // Hide success message
        loginError.value = true; // Show error message
        errorMessage.value = error.message || 'Login failed'; // Set error message
      } finally {
        loading.value = false; // Hide loading state
      }
    };

    return { email, password, handleLogin, loginSuccess, loginError, errorMessage, loading };
  },
};
</script>
