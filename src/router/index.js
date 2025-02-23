import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import WalletPage from '@/components/WalletPage.vue';
import LeaderPage from '@/components/LeaderPage.vue';

const routes = [
  { path: '/', component: HomePage, name: 'Home' },
  { path: '/wallet', component: WalletPage, name: 'Wallet' },
  { path: '/leaderboard', component: LeaderPage, name: 'Leaderboard' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
