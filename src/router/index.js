import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ParcoursViewVue from '@/views/ParcoursView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/parcours/:id', // Utilisation de deux-points pour indiquer un paramètre dynamique (id)
      name: 'parcours',
      component: ParcoursViewVue
    },
  ]
});

export default router;
