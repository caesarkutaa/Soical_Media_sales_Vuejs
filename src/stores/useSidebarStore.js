import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isOpen: true, // Default to open on larger screens
  }),
  actions: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },
    closeSidebar() {
      this.isOpen = false;
    },
    openSidebar() {
      this.isOpen = true;
    },
  },
});
