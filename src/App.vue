<template>
    <div>
      <!-- Navigation Bar -->
      <nav-bar />
      
  
      <!-- Main Content (Page content will be rendered here) -->
      <router-view />
      
      <!-- Footer Bar -->
      <FooterBar />
    </div>
  </template>
  
  <script setup>
  // Importing the components
  import NavBar from '@/components/Nav.vue';
  import FooterBar from '@/components/Footer.vue';
  </script>
  
  <style scoped>
  /* Add necessary layout styles */
  </style>
  





