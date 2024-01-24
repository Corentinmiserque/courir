<template>
  <header class="hero is-primary">
    <div class="hero-body">
      <h2 class="settings">  {{ text }} {{ userData.username }} </h2>
    </div>
  </header>
</template>

<script setup>
const { text, userData } = defineProps(['text', 'userData']);
</script>


