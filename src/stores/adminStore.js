import { defineStore } from "pinia";
import axios from '@/api/axios';;

export const useAdminStore = defineStore("admin", {
  state: () => ({
    token: null, // Holds the admin's authentication token
    errorMessage: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token, // Determine if the admin is logged in
  },
  actions: {
    async login(credentials) {
      try {
        // Send a login request to the backend
        const response = await axios.post("/admin/login", credentials);

        // Store the token in the state
        this.token = response.data.token;
      } catch (error) {
        console.error(error);
        this.errorMessage = "Invalid email or password!";
      }
    },
    logout() {
      // Clear the token when logging out
      this.token = null;
    },
  },
});
