<script setup>
import { onMounted } from 'vue';

import {switchInstallBtn} from './register-sw';
import {  RouterView } from 'vue-router'

// import ParcoursView from './views/ParcoursView.vue';

onMounted( () =>{
  switchInstallBtn()
})


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

<style  scoped >
.hidden{
    display: none;
}
</style>

