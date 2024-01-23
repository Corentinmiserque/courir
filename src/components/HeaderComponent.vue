<template>
  <header class="hero is-primary">
    <div class="hero-body">
      <h2 class="settings">Welcome Back {{ userData.username }}</h2>
    </div>
  </header>
</template>

<script setup>

const { userData } = defineProps(['userData']);
</script>

