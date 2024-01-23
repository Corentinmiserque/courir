<template>
  <div class="container content">
    <HeaderComponent :userData="userData" :programs="data.programs"></HeaderComponent>

    <section class="main-content container content">
      <ul class="tabs">
        <li v-for="(tab, key) in tabs" :key="key" class="tab-button" :class="{ active: currentTab === tab }" @click="currentTab = tab">{{ tab.label }}</li>
      </ul>
      <component :is="currentTab.composant" :programs="data.programs" :userData="userData" class="tab"></component>
    </section>
    <footerComponent></footerComponent>
  </div>
</template>

<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue';
import homepageComponent from '@/components/homepageComponent.vue';
import legendComponent from '@/components/legendComponent.vue';
import footerComponent from '@/components/footerComponent.vue';
import optionsComponent from '@/components/optionsComponent.vue';
import GraphComponent from '@/components/GraphComponent.vue';

import { ref } from 'vue';
import { useProgramStore } from '@/stores/programs';
import { useUserStore } from '@/stores/user';

const programStore = useProgramStore();
const data = ref(programStore.allData);

const userStore = useUserStore()
const userData = ref(userStore.theUser)

const tabs = [
  {
    label: "Homepage",
    composant: homepageComponent
  },
  {
    label: "Legend",
    composant: legendComponent
  },
  {
    label: "Options",
    composant: optionsComponent
  },
  {
    label: "Graph",
    composant: GraphComponent
  }
];

const currentTab = ref(tabs[0]);
</script>

<style>
.tabs {
  align-content: start;
  display: flex;
  justify-content: flex-start;
  align-items: start;
}
.tabs li {
  max-width: 100px;
}
.tab-button {
  padding: 6px 10px 0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-right: -1px;
}
.tab-button:hover {
  background: #e0e0e0;
}
.tab-button.active {
  background: #e0e0e0;
}
.tab {
  border: 1px solid #ccc;
  padding: 10px;
}
.content ul:not(:last-child) {
    margin-bottom: 0;
}
.content ul {
  margin-left: 0;
}
</style>
