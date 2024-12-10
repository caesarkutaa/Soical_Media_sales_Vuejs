<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
      <div class="text-center bg-white p-8 rounded-lg shadow-lg">
        <h1 class="text-4xl font-bold text-gray-800">404</h1>
        <p class="text-xl text-gray-600 mt-4">Oops! The page you're looking for doesn't exist.</p>
        <router-link
          to="/"
          class="mt-6 text-blue-500 hover:text-blue-700"
        >
          Go back to Home
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound',
  };
  </script>
  
  <style scoped>
  /* Styling for the Not Found page */
  .bg-gray-100 {
    background-color: #f7fafc;
  }
  .bg-white {
    background-color: #ffffff;
  }
  .text-gray-800 {
    color: #2d3748;
  }
  .text-gray-600 {
    color: #718096;
  }
  .text-blue-500 {
    color: #4299e1;
  }
  .text-blue-700 {
    color: #2b6cb0;
  }
  .text-center {
    text-align: center;
  }
  .p-8 {
    padding: 2rem;
  }
  .mt-6 {
    margin-top: 1.5rem;
  }
  .rounded-lg {
    border-radius: 0.5rem;
  }
  .shadow-lg {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
  </style>
  