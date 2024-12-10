import { defineStore } from 'pinia';
import axios from '@/api/axios';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    isLoading: false,
    error: null,
    page: 1,
    limit: 10,
    hasMore: true,
  }),

  actions: {
    // Fetch all products (already provided)
    async fetchProducts() {
      try {
        this.isLoading = true;
        this.error = null;

        const response = await axios.get(`/products?page=${this.page}&limit=${this.limit}`);
        this.products = [...this.products, ...response.data];
      } catch (err) {
        this.error = err.response?.data?.msg || 'Failed to fetch products';
      } finally {
        this.isLoading = false;
      }
    },

    // Change the page for pagination
    changePage(newPage) {
      this.page = newPage;
      this.fetchProducts();
    },

    // Add a new product (admin only)
    async addProduct(productData) {
      try {
        this.isLoading = true;
        this.error = null;

        const response = await axios.post('/products', productData);
        this.products.push(response.data); // Add the new product to the state
      } catch (err) {
        this.error = err.response?.data?.msg || 'Failed to add product';
      } finally {
        this.isLoading = false;
      }
    },

    // Update a product by ID (admin only)
    async updateProduct(productId, productData) {
      try {
        this.isLoading = true;
        this.error = null;

        const response = await axios.put(`/products/${productId}`, productData);
        const updatedProduct = response.data;

        // Update the state with the updated product
        this.products = this.products.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        );
      } catch (err) {
        this.error = err.response?.data?.msg || 'Failed to update product';
      } finally {
        this.isLoading = false;
      }
    },

    // Delete a product by ID (admin only)
    async deleteProduct(productId) {
      try {
        this.isLoading = true;
        this.error = null;

        await axios.delete(`/products/${productId}`);

        // Remove the product from the state
        this.products = this.products.filter((product) => product._id !== productId);
      } catch (err) {
        this.error = err.response?.data?.msg || 'Failed to delete product';
      } finally {
        this.isLoading = false;
      }
    },
  },
});
