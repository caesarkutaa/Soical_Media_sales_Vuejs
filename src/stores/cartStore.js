import { defineStore } from 'pinia';
import axios from '@/api/axios';

export const useCartStore = defineStore('cart', {
  state: () => ({
    // Initialize cart as an object with items as an empty array
    cart: {
      items: [],
      totalAmount: 0,
    },
    orders: [],
  }),
  actions: {
    async fetchCart() {
      try {
        const response = await axios.get('/cart');
        // Ensure the response always has the cart object with items
        this.cart = response.data || { items: [], totalAmount: 0 }; 
        console.log("Fetched cart:", this.cart);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    },
    async addToCart(productId, quantity) {
      try {
        const response = await axios.post('/cart', { productId, quantity });
        this.cart = response.data || { items: [], totalAmount: 0 }; // Set default if empty response
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    },
    async removeFromCart(cartId,productId) {
      console.log("Cart ID:", cartId);
      console.log("Product ID:", productId);
      try {
        const response = await axios.delete(`/cart/${cartId}/product/${productId}`);
        this.cart = response.data || { items: [], totalAmount: 0 };  // Update cart after removal
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    },
    async placeOrder(userId) {
      try {
        // Ensure cart is fetched
        if (!this.cart?._id) {
          await this.fetchCart(); // Attempt to fetch the cart again
        }
    
        const cartId = this.cart?._id;
        if (!cartId || !userId) {
          throw new Error("Cart ID or User ID is missing.");
        }
    
        console.log("Cart ID:", cartId);
        console.log("User ID:", userId);
    
        const response = await axios.post("/order", { cartId, userId });
        console.log("Order placed successfully:", response.data);
    
        // Clear cart after successful order placement
        await this.fetchCart();
        return response.data;
      } catch (error) {
        console.error("Error placing order:", error);
        throw error;
      }
    },
    async fetchOrders() {
      try {
        const response = await axios.get('/order');
        this.orders = response.data;
        console.log(response)
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },
    async uploadProof(orderId, proofFile) {
      try {
        const formData = new FormData();
        formData.append('proof', proofFile);

        await axios.post(`/order/upload-proof`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (error) {
        console.error('Error uploading proof:', error);
      }
    },
  },
});
