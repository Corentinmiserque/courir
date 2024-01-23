import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ParcoursViewVue from '@/views/ParcoursView.vue';
import LoginViewVue from '@/views/LoginView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginViewVue
    },
    {
      path: '/homepage',
      name: 'homepage',
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
