<template>
    <div class="p-6">
      <h1 class="text-xl sm:text-2xl font-bold mb-6">Admin Payment Management</h1>
  
      <!-- Loading and Error Messages -->
      <div v-if="isLoading" class="text-center my-4">
        <p>Loading payment details...</p>
      </div>
      <div v-if="error" class="text-center my-4 text-red-500">
        <p>{{ error }}</p>
      </div>
  
      <!-- Payment Details Table (Large Screens) -->
      <div v-if="!isLoading && paymentDetails.length > 0" class="hidden sm:block overflow-x-auto">
        <table class="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="border px-4 py-2">#</th>
              <th class="border px-4 py-2">Bank Name</th>
              <th class="border px-4 py-2">Account Number</th>
              <th class="border px-4 py-2">Account Name</th>
              <th class="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(payment, index) in paymentDetails" :key="payment._id">
              <td class="border px-4 py-2">{{ index + 1 }}</td>
              <td class="border px-4 py-2">{{ payment.bankName }}</td>
              <td class="border px-4 py-2">{{ payment.accountNumber }}</td>
              <td class="border px-4 py-2">{{ payment.accountHolder }}</td>
              <td class="border px-4 py-2">
                <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="openEditModal(payment)">
                  Edit
                </button>
                <button class="bg-red-500 text-white px-4 py-2 rounded" @click="deletePaymentDetails(payment._id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Card Layout for Mobile Screens -->
      <div v-if="!isLoading && paymentDetails.length > 0" class="sm:hidden">
        <div v-for="(payment, index) in paymentDetails" :key="payment._id" class="mb-4 p-4 border rounded-md shadow-sm">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold text-lg">{{ payment.bankName }}</h3>
            <p class="text-sm text-gray-600">Account: {{ payment.accountHolder }}</p>
          </div>
          <p class="text-sm text-gray-500">Account Number: {{ payment.accountNumber }}</p>
          <div class="mt-4 flex space-x-2">
            <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="openEditModal(payment)">
              Edit
            </button>
            <button class="bg-red-500 text-white px-4 py-2 rounded" @click="deletePaymentDetails(payment._id)">
              Delete
            </button>
          </div>
        </div>
      </div>
  
      <!-- Edit Payment Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-semibold mb-4">Edit Payment Details</h2>
          <form @submit.prevent="submitEditPayment">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Bank Name</label>
              <input v-model="editablePayment.bankName" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Account Number</label>
              <input v-model="editablePayment.accountNumber" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Account Holder</label>
              <input v-model="editablePayment.accountHolder" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div class="flex justify-end space-x-4">
              <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded" @click="closeEditModal">Cancel</button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- No Payment Details Found -->
      <div v-if="!isLoading && paymentDetails.length === 0" class="text-center mt-4">
        <p>No payment details found.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, onMounted, ref } from "vue";
  import { usePaymentStore } from "@/stores/paymentStore";
  
  export default defineComponent({
    setup() {
      const paymentStore = usePaymentStore();
      const isLoading = ref(true);
      const error = ref(null);
      const showEditModal = ref(false);
      const editablePayment = ref(null);
  
      // Fetch payment details on mount
      onMounted(async () => {
        try {
          await paymentStore.fetchPaymentDetails(); // Fetch the details
          console.log("Fetched payment details:", paymentStore.paymentDetails);
          isLoading.value = false;
        } catch (err) {
          error.value = "Error loading payment details.";
          console.error(err);
          isLoading.value = false;
        }
      });
  
      // Open edit modal with payment data
      const openEditModal = (payment) => {
        editablePayment.value = { ...payment }; // Clone the payment details for editing
        showEditModal.value = true;
      };
  
      // Close the edit modal
      const closeEditModal = () => {
        showEditModal.value = false;
        editablePayment.value = null;
      };
  
      // Submit edited payment details
      const submitEditPayment = async () => {
        try {
          await paymentStore.updatePaymentDetails(editablePayment.value); // Update the payment details
          await paymentStore.fetchPaymentDetails(); // Re-fetch the updated list
          closeEditModal();
        } catch (err) {
          error.value = "Error updating payment details.";
          console.error(err);
        }
      };
  
      // Delete payment details
      const deletePaymentDetails = async (paymentId) => {
        if (!confirm("Are you sure you want to delete this payment detail?")) return;
        try {
          isLoading.value = true;
          await paymentStore.deletePaymentDetails(paymentId); // Delete the payment details
          await paymentStore.fetchPaymentDetails(); // Re-fetch to get the updated list
          isLoading.value = false;
        } catch (err) {
          error.value = "Error deleting payment details.";
          console.error(err);
          isLoading.value = false;
        }
      };
  
      return {
        isLoading,
        error,
        paymentDetails: paymentStore.paymentDetails,
        showEditModal,
        editablePayment,
        openEditModal,
        closeEditModal,
        submitEditPayment,
        deletePaymentDetails,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Modal backdrop */
  .fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
  }
  
  .bg-opacity-75 {
    background-color: rgba(0, 0, 0, 0.75);
  }
  
  /* Modal content */
  .bg-white {
    background-color: #fff;
  }
  
  .w-96 {
    width: 24rem;
  }
  
  .p-6 {
    padding: 1.5rem;
  }
  
  .rounded-lg {
    border-radius: 0.5rem;
  }
  
  .shadow-sm {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .text-gray-700 {
    color: #4a4a4a;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  .mt-4 {
    margin-top: 1rem;
  }
  
  .space-x-4 > * {
    margin-right: 1rem;
  }
  </style>
  