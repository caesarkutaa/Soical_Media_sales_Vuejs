<template>
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <div class="w-full max-w-md bg-white p-8 shadow-md rounded">
        <h1 class="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <form @submit.prevent="handleLogin" class="flex flex-col space-y-4">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="border rounded px-4 py-2 w-full"
            required
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="border rounded px-4 py-2 w-full"
            required
          />
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Login
          </button>
        </form>
        <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
      </div>
    </div>
  </template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "@/stores/adminStore";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const adminStore = useAdminStore();
    const router = useRouter();

    const handleLogin = async () => {
      // Call the login action from the admin store
      await adminStore.login({ email: email.value, password: password.value });

      // If authenticated, navigate to the admin dashboard
      if (adminStore.isAuthenticated) {
        router.push("/admin-dashboard");
      }
    };

    return {
      email,
      password,
      handleLogin,
      errorMessage: adminStore.errorMessage,
    };
  },
};
</script>
