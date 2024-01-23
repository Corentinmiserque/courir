<template>
  <div class="options-container">
    <h2>Options</h2>
    <div>
     
      <select v-model="selectedProgram">
        <option disabled value="">Select a program</option>
        <option v-for="program in computedPrograms" :key="program.programID" :value="program.programID">{{ program.name }}</option>
      </select>
    </div>
    <button @click="changeProgram">Save</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProgramStore } from '@/stores/programs';
import { useUserStore } from '@/stores/user';

const programStore = useProgramStore();
const UserStore = useUserStore();

// Use a ref for reactive access to programStore.allData
const allProgramData = ref(programStore.allData);

// Set the selectedProgram to the ID of the first program
const selectedProgram = ref(allProgramData.value.programs.length > 0 ? allProgramData.value.programs[0].programID : '');

const computedPrograms = computed(() => {
  return allProgramData.value.programs;
});

const changeProgram = () => {
  UserStore.changeProgram(selectedProgram.value);
  alert("Votre programme a bien été modifié");
};
</script>

<style scoped>
.options-container {
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
</style>
