<template>
  <div class="container content">
    <HeaderComponent></HeaderComponent>
    <section class="main-content container content">
      <homepageComponent :programs="data.programs"></homepageComponent>
      <legendComponent></legendComponent>
    </section>
    <footerComponent></footerComponent>
  </div>
</template>

<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue';
import homepageComponent from '@/components/homepageComponent.vue';
import legendComponent from '@/components/legendComponent.vue';
import footerComponent from '@/components/footerComponent.vue';

import { ref, onMounted } from 'vue';
import { useProgramStore } from '@/stores/programs';

const programStore = useProgramStore();
const data = ref(programStore.allData);

onMounted(async () => {
  // Appeler updateProgress() ici si nécessaire
});
</script>
