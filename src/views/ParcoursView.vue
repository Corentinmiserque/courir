<template>
  <div>
    <ParcoursComponent :id="id"/>
  </div>
</template>

<script setup>
import ParcoursComponent from '@/components/ParcoursComponent.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = ref(route.params.id);

onMounted(() => {
  // Ajoutez ici le code d'initialisation si nécessaire
});
</script>
