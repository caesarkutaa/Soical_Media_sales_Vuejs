<template>
  <footer class="bg-blue-600 text-white py-6">
    <div class="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
      <!-- Footer Text -->
      <p class="text-sm mb-4 md:mb-0">&copy; {{ new Date().getFullYear() }} All rights reserved.</p>

      <!-- Footer Links -->
      <nav class="flex space-x-4">
        <router-link to="/privacy" class="hover:text-gray-200">Privacy</router-link>
        <router-link to="/contact" class="hover:text-gray-200">Contact Us</router-link>
      </nav>
    </div>
  </footer>
</template>

<script setup>
// No need for extra script logic for now
</script>

<style scoped>
/* Add any custom styles if needed */
</style>







  