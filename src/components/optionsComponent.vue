<template>
  <!-- Container for options -->
  <div class="options-container">
    <!-- Title for the options section -->
    <h2 class="title is-4">Options</h2>

    <!-- Change Program Option -->
    <div class="field">
      <!-- Label for the change program option -->
      <label class="label">Change the program</label>
      <div class="control">
        <!-- Dropdown to select a program -->
        <div class="select">
          <select v-model="selectedProgram">
            <option disabled value="">Select a program</option>
            <!-- Loop through computedPrograms to populate dropdown options -->
            <option v-for="program in computedPrograms" :key="program.programID" :value="program.programID">{{ program.name }}</option>
          </select>
        </div>
      </div>
      <div class="control">
        <!-- Button to save the selected program -->
        <button @click="confirmChangeProgram" class="button is-primary">Save Program</button>
      </div>
    </div>

    <!-- Notification Option -->
    <div class="field">
      <!-- Label for the notification option -->
      <label class="label">Notification</label>
      <div class="control">
        <!-- Checkbox for enabling/disabling notifications -->
        <input type="checkbox" v-model="userOptions.notification" />
      </div>
      <div class="control">
        <!-- Button to save the notification option -->
        <button @click="confirmUpdateOption('notification', userOptions.notification)" class="button is-primary">Save Notification</button>
      </div>
    </div>

    <!-- Sound Option -->
    <div class="field">
      <!-- Label for the sound option -->
      <label class="label">Sound</label>
      <div class="control">
        <!-- Checkbox for enabling/disabling sound -->
        <input type="checkbox" v-model="userOptions.sound" />
      </div>
      <div class="control">
        <!-- Button to save the sound option -->
        <button @click="confirmUpdateOption('sound', userOptions.sound)" class="button is-primary">Save Sound</button>
      </div>
    </div>

    <!-- Vibration Option -->
    <div class="field">
      <!-- Label for the vibration option -->
      <label class="label">Vibration</label>
      <div class="control">
        <!-- Checkbox for enabling/disabling vibration -->
        <input type="checkbox" v-model="userOptions.vibration" />
      </div>
      <div class="control">
        <!-- Button to save the vibration option -->
        <button @click="confirmUpdateOption('vibration', userOptions.vibration)" class="button is-primary">Save Vibration</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProgramStore } from '@/stores/programs';
import { useUserStore } from '@/stores/user';

// Initialize program and user stores
const programStore = useProgramStore();
const UserStore = useUserStore();

// Reference to program data and selected program
const allProgramData = ref(programStore.allData);
const selectedProgram = ref(allProgramData.value.programs.length > 0 ? allProgramData.value.programs[0].programID : '');
const computedPrograms = computed(() => {
  return allProgramData.value.programs;
});

// Destructure user options and update functions from UserStore
const { userOptions, updateOption, changeProgram } = UserStore;

// Function to confirm and change the program
const confirmChangeProgram = () => {
  if (confirm('Are you sure you want to change the program?')) {
    changeProgram();
  }
};

// Function to confirm and update a user option
const confirmUpdateOption = (option, value) => {
  if (confirm(`Are you sure you want to save the ${option} option?`)) {
    updateOption(option, value);
  }
};
</script>

<style scoped>
.options-container {
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
</style>
