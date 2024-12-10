<template>
  <div class="p-4 sm:p-6">
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Product Management</h1>

    <!-- Loading and Error Messages -->
    <div v-if="isLoading" class="text-center my-4">
      <p>Loading products...</p>
    </div>
    <div v-if="error" class="text-center my-4 text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- Success and Error Messages -->
    <div v-if="message" :class="message.type === 'success' ? 'text-green-500' : 'text-red-500'" class="my-4 text-center">
      <p>{{ message.text }}</p>
    </div>

    <!-- Add Product Button -->
    <div class="text-right mb-4">
      <button
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        @click="openAddProductModal"
      >
        Add Product
      </button>
    </div>

    <!-- Products Table -->
    <div v-if="products.length > 0 && !isLoading" class="overflow-x-auto">
      <table class="table-auto w-full border-collapse border border-gray-200 hidden sm:table">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-4 py-2">#</th>
            <th class="border px-4 py-2">Name</th>
            <th class="border px-4 py-2">Price</th>
            <th class="border px-4 py-2">Stock</th>
            <th class="border px-4 py-2">Description</th>
            <th class="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product._id" class="hover:bg-gray-50">
            <td class="border px-4 py-2">{{ index + 1 }}</td>
            <td class="border px-4 py-2">{{ product.name }}</td>
            <td class="border px-4 py-2">${{ product.price }}</td>
            <td class="border px-4 py-2">{{ product.stock }}</td>
            <td class="border px-4 py-2">{{ product.description }}</td>
            <td class="border px-4 py-2 text-center">
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                @click="openEditModal(product)"
              >
                Edit
              </button>
              <button
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                @click="deleteProduct(product._id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Responsive Cards for Smaller Screens -->
      <div class="sm:hidden space-y-4">
        <div
          v-for="product in products"
          :key="product._id"
          class="border rounded-lg p-4 shadow-sm"
        >
          <p class="text-lg font-bold">{{ product.name }}</p>
          <p class="text-gray-700">
            <strong>Price:</strong> ${{ product.price }}
          </p>
          <p class="text-gray-700">
            <strong>Stock:</strong> {{ product.stock }}
          </p>
          <p class="text-gray-700">
            <strong>Description:</strong> {{ product.description }}
          </p>
          <div class="mt-2 flex space-x-2">
            <button
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              @click="openEditModal(product)"
            >
              Edit
            </button>
            <button
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              @click="deleteProduct(product._id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h2 class="text-lg font-bold mb-4">{{ isEditing ? 'Edit Product' : 'Add Product' }}</h2>
        <form @submit.prevent="isEditing ? updateProduct() : addProduct()">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="formData.name"
              id="name"
              type="text"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div class="mb-4">
            <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
            <input
              v-model="formData.price"
              id="price"
              type="number"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div class="mb-4">
            <label for="stock" class="block text-sm font-medium text-gray-700">Stock</label>
            <input
              v-model="formData.stock"
              id="stock"
              type="number"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div class="mb-4">
            <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              v-model="formData.quantity"
              id="quantity"
              type="number"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              v-model="formData.description"
              id="description"
              rows="3"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            ></textarea>
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" class="bg-gray-300 text-gray-700 px-4 py-2 rounded" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="products.length > 0 && hasMore && !isLoading" class="mt-4 flex justify-center">
      <button
        class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        @click="loadMoreProducts"
      >
        Load More
      </button>
    </div>

    <!-- No Products Message -->
    <div v-if="products.length === 0 && !isLoading" class="text-center mt-4">
      <p>No products found.</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useProductStore } from "@/stores/productStore";

export default defineComponent({
  setup() {
    const productStore = useProductStore();

    // Modal state and form data
    const isModalOpen = ref(false);
    const isEditing = ref(false);
    const formData = ref({ name: "", price: 0, stock: 0, description: "" });
    let editingProductId = null;

    // Message state
    const message = ref({ text: "", type: "" });

    // Function to open the Edit modal
    const openEditModal = (product) => {
      isEditing.value = true;
      formData.value = { ...product };
      editingProductId = product._id;
      isModalOpen.value = true;
    };

    // Function to open the Add Product modal
    const openAddProductModal = () => {
      isEditing.value = false; // Ensure we are in 'Add' mode
      formData.value = { name: "", price: 0, stock: 0, description: "" }; // Clear the form
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      formData.value = { name: "", price: 0, stock: 0, description: "" };
      isEditing.value = false;
    };

    const addProduct = async () => {
      try {
        await productStore.addProduct(formData.value);
        message.value = { text: "Product added successfully!", type: "success" };
        closeModal();
      } catch (error) {
        message.value = { text: "Failed to add product.", type: "error" };
      }
    };

    const updateProduct = async () => {
      try {
        await productStore.updateProduct(editingProductId, formData.value);
        message.value = { text: "Product updated successfully!", type: "success" };
        closeModal();
      } catch (error) {
        message.value = { text: "Failed to update product.", type: "error" };
      }
    };

    const deleteProduct = async (productId) => {
      try {
        await productStore.deleteProduct(productId);
        message.value = { text: "Product deleted successfully!", type: "success" };
      } catch (error) {
        message.value = { text: "Failed to delete product.", type: "error" };
      }
    };

    const loadMoreProducts = () => {
      productStore.changePage(productStore.page + 1);
    };

    onMounted(() => {
      productStore.fetchProducts(); // Fetch products on component load
    });

    return {
      products: productStore.products,
      isLoading: productStore.isLoading,
      error: productStore.error,
      hasMore: productStore.hasMore,

      isModalOpen,
      isEditing,
      formData,
      openAddProductModal,
      openEditModal,
      closeModal,
      addProduct,
      updateProduct,
      deleteProduct,
      loadMoreProducts,

      message, // Add message to return
    };
  },
});
</script>
