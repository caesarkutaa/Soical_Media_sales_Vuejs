import { createRouter, createWebHistory } from 'vue-router';

// Lazy load components
import DashboardLayout from '@/components/Sidebar.vue';
import UserProfile from '@/views/UserProfile.vue';
import ProductListing from '@/views/ProductListing.vue';
import OrderHistory from '@/views/OrderHistory.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import NotFound from '@/views/NotFound.vue';
import OrderSummary from '@/views/OrderSummary.vue';
import Cart from '@/views/Cart.vue';
import ProductPage from '@/views/ProductPage.vue';
import AdminLogin from '@/views/AdminLogin.vue';
import AdminLayout from '@/views/AdminLayout.vue';
import ProductManager from '@/views/ProductManager.vue';
import OrderManager from '@/views/OrderManager.vue';
import AdminPayment from '@/views/AdminPayment.vue'

const routes = [
  // Public routes
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/products',
    name: 'product',
    component: ProductPage,
  },

  // Dashboard (Protected routes)
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true }, // Protected route
    children: [
      {
        path: 'profile',
        name: 'user-profile',
        component: UserProfile,
      },
      {
        path: 'products',
        name: 'product-listing',
        component: ProductListing,
      },
      {
        path: 'order-summary',
        name: 'order-summarys',
        component: OrderSummary,
      },
      {
        path: 'cart',
        name: 'cart',
        component: Cart,
      },
    ],
  },

  // Admin Pages
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: 'products',
        name: 'ProductManager',
        component: ProductManager,
      },
      {
        path: 'orders',
        name: 'OrderManager',
        component: OrderManager,
      },
      {
        path: 'payments',
        name: 'AdminPayment',
        component: AdminPayment,
      },
  
    ],
  },

  // Catch-all for 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
