import { defineStore } from 'pinia';
import axios from '@/api/axios'; // Assuming you have a configured Axios instance in `api/axios.js`

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),
  
  
  getters: {
    isAuthenticated() {
      // Return true if token exists
      return this.token !== null;
    },
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/auth/login', { email, password });
        this.user = response.data.user;
        this.token = response.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`; // Attach token to all requests
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to login';
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },
    async register(name, email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/auth/register', { name, email, password });
        this.user = response.data.user;
        this.token = response.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`; // Attach token to all requests
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to register';
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      delete axios.defaults.headers.common['Authorization']; // Remove token from headers
    },
    
      async fetchUserProfile() {
        try {
          this.isLoading = true;
          const response = await axios.get('/auth/profile');
          this.profile = response.data;
        } catch (err) {
          this.error = err.response?.data?.msg || 'Failed to fetch user profile';
        } finally {
          this.isLoading = false;
        }
      },
    },
  persist: {
    enabled: true, // Optional: Persist the auth state (requires Pinia persist plugin)
    strategies: [
      {
        key: 'auth',
        storage: localStorage,
      },
    ],
  },
});
