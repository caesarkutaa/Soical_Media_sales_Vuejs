<template>
    <div v-if="isVisible" class="toast-container">
      <div :class="['toast', type]" v-for="(toast, index) in toasts" :key="index">
        <span>{{ toast.message }}</span>
        <button @click="closeToast(index)" class="close-btn">X</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        toasts: [],
        isVisible: false,
      };
    },
    methods: {
      addToast(message, type = 'success') {
        this.toasts.push({ message, type });
        this.isVisible = true;
  
        // Automatically remove toast after 3 seconds
        setTimeout(() => {
          this.closeToast(0);
        }, 3000);
      },
      closeToast(index) {
        this.toasts.splice(index, 1);
  
        if (this.toasts.length === 0) {
          this.isVisible = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
  }
  
  .toast {
    background-color: #4caf50;
    color: white;
    padding: 10px;
    margin: 5px 0;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .toast.error {
    background-color: #f44336;
  }
  
  .toast.success {
    background-color: #4caf50;
  }
  
  .toast .close-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
  }
  </style>
  