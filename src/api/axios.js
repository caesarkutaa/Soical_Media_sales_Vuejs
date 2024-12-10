// api/axios.js
import axios from 'axios';

// Create an Axios instance with base URL and default configurations
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3023/api/v1', // replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

