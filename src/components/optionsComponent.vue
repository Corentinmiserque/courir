<template>
  <div class="options-container">
    <h2 class="title is-4">Options</h2>
    
    <div class="field">
      <label class="label">Change the program</label>
      <div class="control">
        <div class="select">
          <select v-model="selectedProgram">
            <option disabled value="">Select a program</option>
            <option v-for="program in computedPrograms" :key="program.programID" :value="program.programID">{{ program.name }}</option>
          </select>
        </div>
      </div>
    <div class="control">
      <button @click="changeProgram" class="button is-primary">Save Program</button>
    </div>
  </div>
    <!-- Notification Option -->
    <div class="field">
      <label class="label">Notification</label>
      <div class="control">
        <input type="checkbox" v-model="userOptions.notification" />
      </div>
      <div class="control">
        <button @click="updateOption('notification', userOptions.notification)" class="button is-primary">Save Notification</button>
      </div>
    </div>

    <!-- Sound Option -->
    <div class="field">
      <label class="label">Sound</label>
      <div class="control">
        <input type="checkbox" v-model="userOptions.sound" />
      </div>
      <div class="control">
        <button @click="updateOption('sound', userOptions.sound)" class="button is-primary">Save Sound</button>
      </div>
    </div>

    <!-- Vibration Option -->
    <div class="field">
      <label class="label">Vibration</label>
      <div class="control">
        <input type="checkbox" v-model="userOptions.vibration" />
      </div>
      <div class="control">
        <button @click="updateOption('vibration', userOptions.vibration)" class="button is-primary">Save Vibration</button>
      </div>
    </div>

    </div>
    

</template>

<script setup>
import { ref, computed } from 'vue';
import { useProgramStore } from '@/stores/programs';
import { useUserStore } from '@/stores/user';

const programStore = useProgramStore();
const UserStore = useUserStore();

const allProgramData = ref(programStore.allData);
const selectedProgram = ref(allProgramData.value.programs.length > 0 ? allProgramData.value.programs[0].programID : '');
const computedPrograms = computed(() => {
  return allProgramData.value.programs;
});

const { userOptions, updateOption, changeProgram } = UserStore;
</script>

<style scoped>
.options-container {
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
</style>
