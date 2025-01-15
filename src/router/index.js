import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import WalletPage from '@/components/WalletPage.vue';

const routes = [
  { path: '/', component: HomePage, name: 'Home' },
  { path: '/wallet', component: WalletPage, name: 'Wallet' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
