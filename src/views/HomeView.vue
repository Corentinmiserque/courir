<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue';
import homepageComponent from '@/components/homepageComponent.vue';
import legendComponent from '@/components/legendComponent.vue';
import footerComponent from '@/components/footerComponent.vue';
</script>

<template>
  <div class="container content">
<HeaderComponent></HeaderComponent>
    <section class="main-content container content">
<homepageComponent></homepageComponent>
<legendComponent></legendComponent>
    </section>
    <footerComponent></footerComponent>
  </div>
</template>

