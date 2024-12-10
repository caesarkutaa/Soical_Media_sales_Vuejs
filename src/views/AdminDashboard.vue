<template>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
  
      <!-- Tabs for different admin functionalities -->
      <div class="flex space-x-4 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="['px-4 py-2 rounded', activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200']"
        >
          {{ tab }}
        </button>
      </div>
  
      <!-- Tab Content -->
      <div v-if="activeTab === 'Products'">
        <h2 class="text-xl font-semibold mb-4">Manage Products</h2>
        <div>
          <!-- Upload Product Form -->
          <h3 class="text-lg font-medium mb-2">Upload Product</h3>
          <form @submit.prevent="uploadProduct" class="flex flex-col space-y-2">
            <input
              v-model="newProduct.name"
              type="text"
              placeholder="Product Name"
              class="border rounded px-4 py-2"
            />
            <input
              v-model="newProduct.category"
              type="text"
              placeholder="Category"
              class="border rounded px-4 py-2"
            />
            <input
              v-model="newProduct.price"
              type="number"
              placeholder="Price"
              class="border rounded px-4 py-2"
            />
            <input
              v-model="newProduct.stock"
              type="number"
              placeholder="Stock"
              class="border rounded px-4 py-2"
            />
            <button
              type="submit"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Upload Product
            </button>
          </form>
        </div>
  
        <!-- Product List -->
        <h3 class="text-lg font-medium mt-6 mb-2">All Products</h3>
        <div v-if="products.length === 0">No products found.</div>
        <ul class="space-y-4">
          <li
            v-for="product in products"
            :key="product._id"
            class="border rounded p-4 flex justify-between"
          >
            <div>
              <h4 class="font-bold">{{ product.name }}</h4>
              <p>Category: {{ product.category }}</p>
              <p>Price: ${{ product.price }}</p>
              <p>Stock: {{ product.stock }}</p>
            </div>
            <button
              @click="deleteProduct(product._id)"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
  
      <div v-if="activeTab === 'Users'">
        <h2 class="text-xl font-semibold mb-4">Manage Users</h2>
        <!-- User List -->
        <ul class="space-y-4">
          <li
            v-for="user in users"
            :key="user._id"
            class="border rounded p-4 flex justify-between"
          >
            <div>
              <h4 class="font-bold">{{ user.name }}</h4>
              <p>Email: {{ user.email }}</p>
              <p>Role: {{ user.role }}</p>
            </div>
            <div class="space-x-2">
              <button
                @click="updateAccountDetails(user._id)"
                class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Update
              </button>
              <button
                @click="deleteAccount(user._id)"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>
  
      <div v-if="activeTab === 'Payments'">
        <h2 class="text-xl font-semibold mb-4">Approve Payments</h2>
        <ul class="space-y-4">
          <li
            v-for="payment in pendingPayments"
            :key="payment._id"
            class="border rounded p-4 flex justify-between"
          >
            <div>
              <h4 class="font-bold">Payment ID: {{ payment._id }}</h4>
              <p>User: {{ payment.userName }}</p>
              <p>Amount: ${{ payment.amount }}</p>
            </div>
            <button
              @click="approvePayment(payment._id)"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Approve
            </button>
          </li>
        </ul>
      </div>
    </div>
  </template>

  <script>
import { ref } from "vue";
import { useProductStore } from "@/stores/productStore";
import { useAuthStore } from "@/stores/authStore";
import { usePaymentStore } from "@/stores/paymentStore";

export default {
  setup() {
    const productStore = useProductStore();
    const userStore = useAuthStore();
    const paymentStore = usePaymentStore();

    const tabs = ["Products", "Users", "Payments"];
    const activeTab = ref("Products");

    // States for new product
    const newProduct = ref({
      name: "",
      category: "",
      price: 0,
      stock: 0,
    });

    // Fetch data
    const fetchProducts = productStore.fetchProducts;
    const fetchUsers = userStore.fetchUsers;
    const fetchPayments = paymentStore.fetchPendingPayments;

    // Operations
    const uploadProduct = async () => {
      try {
        await productStore.createProduct(newProduct.value);
        alert("Product uploaded successfully!");
        fetchProducts();
      } catch (error) {
        console.error(error);
        alert("Error uploading product.");
      }
    };

    const deleteProduct = async (productId) => {
      try {
        await productStore.deleteProduct(productId);
        alert("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error(error);
        alert("Error deleting product.");
      }
    };

    const updateAccountDetails = async (userId) => {
      try {
        const updatedDetails = {}; // Fill with the desired updates
        await userStore.updateUser(userId, updatedDetails);
        alert("Account updated successfully!");
        fetchUsers();
      } catch (error) {
        console.error(error);
        alert("Error updating account.");
      }
    };

    const deleteAccount = async (userId) => {
      try {
        await userStore.deleteUser(userId);
        alert("Account deleted successfully!");
        fetchUsers();
      } catch (error) {
        console.error(error);
        alert("Error deleting account.");
      }
    };

    const approvePayment = async (paymentId) => {
      try {
        await paymentStore.approvePayment(paymentId);
        alert("Payment approved!");
        fetchPayments();
      } catch (error) {
        console.error(error);
        alert("Error approving payment.");
      }
    };

    // Load data on mount
    fetchProducts();
    fetchUsers();
    fetchPayments();

    return {
      tabs,
      activeTab,
      newProduct,
      products: productStore.products,
      users: userStore.users,
      pendingPayments: paymentStore.pendingPayments,
      uploadProduct,
      deleteProduct,
      updateAccountDetails,
      deleteAccount,
      approvePayment,
    };
  },
};
</script>
