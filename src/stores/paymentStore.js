import { defineStore } from "pinia";
import axios from "@/api/axios";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    bankDetails: [], // Store the bank details for payments
    paymentDetails: [], // Store admin payment details
  }),

  actions: {
    // Fetch bank details (public route)
    async fetchBankDetails() {
      try {
        const response = await axios.get("/payment");
        this.bankDetails = response.data;
        console.log("Bank details fetched:", this.bankDetails);
      } catch (error) {
        console.error("Error fetching bank details:", error);
        throw error;
      }
    },

    // Admin: Update or add payment details
    async updatePaymentDetails(details) {
      try {
        const response = await axios.post("/payment", details);
        this.paymentDetails = response.data;
        console.log("Payment details updated:", this.paymentDetails);
      } catch (error) {
        console.error("Error updating payment details:", error);
        throw error;
      }
    },

    // Admin: Delete payment details
    async deletePaymentDetails() {
      try {
        await axios.delete("/payment");
        this.paymentDetails = null;
        console.log("Payment details deleted.");
      } catch (error) {
        console.error("Error deleting payment details:", error);
        throw error;
      }
    },

    // Admin: Fetch payment details
    async fetchPaymentDetails() {
      try {
        const response = await axios.get("/payment/details");
        this.paymentDetails = response.data;
        console.log("Payment details fetched:", this.paymentDetails);
      } catch (error) {
        console.error("Error fetching payment details:", error);
        throw error;
      }
    },

    // User: Upload proof of payment
    async uploadProofOfPayment(proofFile) {
      try {
        const formData = new FormData();
        formData.append("proofOfPayment", proofFile);

        const response = await axios.post("/payment/upload-proof", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Proof of payment uploaded:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error uploading proof of payment:", error);
        throw error;
      }
    },
  },
});
