<template>
    <div class="container content">
    <HeaderComponent :userData="userData" text="Are you ready"></HeaderComponent>
  <div>
    <ParcoursComponent :id="id"/>
  </div>
  </div>
</template>

<script setup>
import ParcoursComponent from '@/components/ParcoursComponent.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import HeaderComponent from '@/components/HeaderComponent.vue';


import { useUserStore } from '@/stores/user';


const userStore = useUserStore()
const userData = ref(userStore.theUser)

const route = useRoute();
const id = ref(route.params.id);

onMounted(() => {
  // Ajoutez ici le code d'initialisation si nécessaire
});
</script>
