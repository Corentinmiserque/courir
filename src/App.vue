<script setup>
import { onMounted } from 'vue';
import { useProgramStore } from '@/stores/programs';
import { useUserStore } from './stores/user';
import { switchInstallBtn } from './register-sw';

const programStore = useProgramStore();
const userStore = useUserStore();

onMounted(() => {
  switchInstallBtn();

  // Initialise le store Pinia
  programStore.initializeData();
  userStore.loadUserData(); 
});
</script>


<template>
  <header>
    <div class="install">
      <button class="install-btn  button is-danger hidden">Install</button>
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

