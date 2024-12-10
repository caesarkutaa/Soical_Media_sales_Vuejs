<template>
  <div class="order-summary-container">
    <h2 class="text-2xl font-semibold mb-4">Order Summary</h2>

    <!-- Show loading state if the order is not yet available -->
    <div v-if="!order">
      <p>Loading your order...</p>
    </div>

    <!-- Show order summary if order is available -->
    <div v-else>
      <h3 class="text-xl font-medium mb-2">Your Order</h3>
      <ul class="mb-4">
        <li v-for="(item, index) in order.items" :key="index">
          {{ item.productId.name }} (x{{ item.quantity }}) - $
          {{ item.productId.price * item.quantity }}
        </li>
      </ul>
      <p class="font-semibold">Total: ${{ order.totalAmount }}</p>

      <div class="mt-4">
        <h4 class="font-semibold">Admin Account Details</h4>
        <div v-if="adminAccount.accountHolder" class="bg-gray-100 p-4 rounded-lg">
  <p><strong>Account Name:</strong> {{ adminAccount.accountHolder }}</p>
  <p><strong>Account Number:</strong> {{ adminAccount.accountNumber }}</p>
  <p><strong>Bank:</strong> {{ adminAccount.bankName }}</p>
  <p><strong>Amount to Send:</strong> ${{ order.totalAmount }}</p>
        </div>
      </div>

      <!-- Payment Proof Section (only for pending orders) -->
      <div v-if="order.status === 'Pending'" class="mt-4">
        <label for="proof" class="block mb-2">Upload Proof of Payment</label>
        <input
          type="file"
          id="proof"
          name="proofOfPayment" 
          @change="handleProofUpload"
          class="border p-2"
        />
        <button
          @click="uploadProof"
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-4"
        >
          Submit Proof
        </button>
      </div>

      <!-- Loading state for uploading proof -->
      <div v-if="loading" class="mt-4">
        <p>Uploading your proof... Please wait.</p>
      </div>

      <!-- Show message if the order is pending and no proof is being uploaded -->
      <div v-if="order.status === 'Pending' && !loading" class="mt-4">
        <p>Your payment is pending. Please wait for approval.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { usePaymentStore } from '@/stores/paymentStore'; // Pinia store for payment

export default defineComponent({
  setup() {
    const cartStore = useCartStore(); // Cart store
    const paymentStore = usePaymentStore(); // Payment store
    
    const order = computed(() => cartStore.orders[0]); // Assuming only one order in the cart
    const adminAccount = ref({}); // To store admin payment details
    const proofFile = ref(null); // File to upload as proof of payment
    const loading = ref(false); // Loading state for proof upload

    // Fetch orders on mount
    const fetchOrder = async () => {
      try {
        await cartStore.fetchOrders(); // Fetch orders from the cart store
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchAdminAccountDetails = async () => {
  try {
    await paymentStore.fetchBankDetails(); // Fetch bank details using the store
    if (paymentStore.bankDetails && paymentStore.bankDetails.length > 0) {
      adminAccount.value = paymentStore.bankDetails[0]; // Use the first bank detail
      console.log("Admin Account Details:", adminAccount.value);
    } else {
      console.error("No bank details found");
    }
  } catch (error) {
    console.error("Error fetching admin account details:", error);
  }
};


    // Handle proof file upload
    const handleProofUpload = (event) => {
      proofFile.value = event.target.files[0];
    };

    // Upload proof of payment
    const uploadProof = async () => {
      if (proofFile.value && order.value) {
        loading.value = true;
        try {
          await cartStore.uploadProof(order.value._id, proofFile.value); // Call store method to upload proof
          loading.value = false;
          // Optionally, update order status in the store to 'Pending'
          order.value.status = 'Pending';
          alert("Proof of payment uploaded successfully. Your order is now pending.");
        } catch (error) {
          loading.value = false;
          alert("Error uploading proof of payment. Please try again.");
        }
      } else {
        alert("Please select a file before submitting.");
      }
    };

    // Return the necessary data and methods to the template
    return {
      order,
      adminAccount,
      proofFile,
      loading,
      fetchOrder,
      fetchAdminAccountDetails,
      handleProofUpload,
      uploadProof,
    };
  },
  mounted() {
    this.fetchOrder(); // Fetch order on page mount
    this.fetchAdminAccountDetails(); // Fetch admin account details on page mount
  },
});
</script>

<style scoped>

.order-summary-container {
  padding: 16px;
}

/* Adjust typography and layout for smaller screens */
h2,
h3 {
  text-align: center;
}

/* Responsive spacing for unordered list */
ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

ul li {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem; /* Slightly smaller font for better fit */
  padding: 4px 0;
}

/* Adjust the size of the admin account details box for smaller screens */
.bg-gray-100 {
  background-color: #f7fafc;
  padding: 16px;
  border-radius: 8px;
  margin: 10px auto; /* Center the box on small screens */
  width: 100%;
  max-width: 400px; /* Keep it constrained */
}

/* Button responsiveness */
button {
  cursor: pointer;
  width: 100%; /* Full width for smaller screens */
  margin-top: 10px;
  font-size: 1rem; /* Adjust font size */
  padding: 10px 0;
}

input[type="file"] {
  cursor: pointer;
  width: 100%; /* Full width input for small screens */
  margin-bottom: 10px;
}

.mt-4 {
  margin-top: 1rem;
}

/* Responsive typography adjustments */
@media (max-width: 640px) {
  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.2rem;
  }

  ul li {
    flex-direction: column; /* Stack items for narrow screens */
    align-items: flex-start;
  }

  .bg-gray-100 {
    font-size: 0.9rem; /* Reduce font size on small screens */
  }
}

/* Flexbox utility for proper alignment */
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>


