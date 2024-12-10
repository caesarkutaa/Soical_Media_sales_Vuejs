<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full sm:w-96">
        <h2 class="text-3xl font-bold text-center text-blue-600 mb-4">Register</h2>
        <p class="text-gray-600 text-center mb-6">Create an account to get started.</p>
        <form @submit.prevent="handleRegister">
          <div class="mb-4">
            <label for="name" class="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              v-model="name"
              type="text"
              id="name"
              placeholder="Enter your full name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
          <div class="mb-4">
            <label for="password" class="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="Enter a strong password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="mb-6">
            <label for="confirm-password" class="block text-gray-700 font-semibold mb-2">Confirm Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <p class="text-gray-600 text-center mt-4">
          Already have an account?
          <router-link to="/login" class="text-blue-600 font-semibold hover:underline">Login</router-link>
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
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const authStore = useAuthStore();
    const router = useRouter();

    const handleRegister = async () => {
      if (password.value !== confirmPassword.value) {
        alert('Passwords do not match!');
        return;
      }
      try {
        await authStore.register(name.value, email.value, password.value);
        alert('Registration successful!');
        router.push('/login'); // Redirect to the login page after registration
      } catch (error) {
        alert(error.message || 'Registration failed');
      }
    };

    return { name, email, password, confirmPassword, handleRegister };
  },
};
</script>

  