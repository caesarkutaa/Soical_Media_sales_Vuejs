<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">User Profile</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center my-4">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"></div>
      <p class="text-blue-500 mt-2">Loading your profile...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center my-4">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <!-- Profile Details -->
    <div v-if="user && !isLoading" class="bg-white p-6 rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center">
          <img 
            :src="user.profilePicture || '/default-profile.png'" 
            alt="Profile Picture" 
            class="w-20 h-20 rounded-full object-cover mr-4" 
          />
          <div>
            <p class="font-semibold text-gray-600">Name</p>
            <p class="text-lg">{{ user.name }}</p>
          </div>
        </div>

        <div>
          <p class="font-semibold text-gray-600">Email</p>
          <p class="text-lg">{{ user.email }}</p>
        </div>
        <div>
          <p class="font-semibold text-gray-600">Joined On</p>
          <p class="text-lg">{{ formatDate(user.createdAt) }}</p>
        </div>
      </div>

      <div class="mt-6 text-center">
        <button
          @click="editProfile"
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Edit Profile
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import axios from '@/api/axios'; // Assuming you have an axios setup

export default defineComponent({
  setup() {
    const authStore = useAuthStore(); // Get user info from Pinia
    const user = ref(authStore.user); // Reference to store user data
    const isLoading = ref(false);
    const error = ref(null);

    // Format date for user-friendly display
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    // Fetch the user profile on component mount
    const fetchProfile = async () => {
      isLoading.value = true;
      error.value = null;

      try {
        const response = await axios.get('/user/profile', {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        authStore.setUser(response.data); // Update user data in the store
      } catch (err) {
        error.value = err.response?.data?.msg || 'Failed to fetch profile';
      } finally {
        isLoading.value = false;
      }
    };

    // Handle editing of the profile
    const editProfile = () => {
      // Logic to navigate to an edit profile page or show an edit modal
      alert('Edit profile functionality is not implemented yet.');
    };

    onMounted(() => {
      if (!user.value) {
        fetchProfile();
      }
    });

    return {
      user,
      isLoading,
      error,
      formatDate,
      editProfile,
    };
  },
});
</script>

<style scoped>
/* Custom styles */
.bg-white {
  background-color: #ffffff;
}
.text-gray-600 {
  color: #4b5563;
}
.text-blue-500 {
  color: #3b82f6;
}
.text-lg {
  font-size: 1.125rem;
}
.text-center {
  text-align: center;
}
.font-semibold {
  font-weight: 600;
}
.grid-cols-1 {
  grid-template-columns: 1fr;
}
.md:grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}
.gap-4 {
  gap: 1rem;
}
.mt-6 {
  margin-top: 1.5rem;
}
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
