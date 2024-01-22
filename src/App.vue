<script setup>
import { onMounted } from 'vue';
import { useProgramStore } from '@/stores/programs';
import { switchInstallBtn } from './register-sw';
const programStore = useProgramStore();
onMounted(() => {
  switchInstallBtn();

  // Initialise le store Pinia
  programStore.initializeData();

  
});
</script>

<template>
  <header>
    <div class="install">
      <button class="install-btn hidden">Install</button>
    </div>

    <section class="section">
      <RouterView />
    </section>
  </header>
</template>

<style scoped>
.hidden {
  display: none;
}
</style>

