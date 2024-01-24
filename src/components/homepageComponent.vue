<template>
  <!-- The main container for the homepage info -->
  <div class="homepage-info container">
    <!-- Loop through filtered programs -->
    <div v-for="(program, programIndex) in filteredPrograms" :key="program.programID">
      <!-- Display program name and details -->
      <h2 class="title is-4">Program: {{ program.name }}</h2>

      <!-- Check if there are unfinished weeks in the program -->
      <div v-if="program.weeks.some(week => !week.finished)">
        <!-- Display details for the active week -->
        <div class='box' v-if="activeWeek = program.weeks.find(week => !week.finished)">
          <!-- Container for week details -->
          <div class="week container">
            <!-- Display week progress and details -->
            <div class="box">
              <h3 class="subtitle is-5">Week {{ program.weeks.findIndex(week => !week.finished) + 1 }} of {{ program.durationWeek }}</h3>
              <div class="progress container">
                <!-- Progress bar for the week -->
                <progress :id="'progress-bar-week-' + programIndex" class="progress is-primary" value="0" max="100"></progress>
              </div>

              <!-- Display day progress and details -->
              <div class="day-progress container">
                <h3>Day {{ countFinishedDaysInWeek(activeWeek) }} of {{ activeWeek.days.length }}</h3>
                <!-- Progress bar for the day -->
                <progress :id="'progress-bar-day-' + programIndex" class="progress is-info" value="0" max="100"></progress>
              </div>
            </div>

            <!-- Container for days in the week -->
            <div class="box">
              <div class="columns is-centered is-justify-content-space-around ">
                <!-- Loop through active week's days -->
                <div v-for="(day, dayIndex) in activeWeek.days" :key="day.dayID" class='column box is-2 has-text-centered'>
                  <!-- Display day status based on completion -->
                  <span v-if="day.finished" class="finished-day ">Day {{ dayIndex + 1 }} (Finished)</span>
                  <span v-else-if="day.finished === false && dayIndex > countFinishedDaysInWeek(activeWeek)" class="upcoming-day">Day {{ dayIndex + 1 }} (Upcoming)</span>
                  <!-- Link to the route for the day -->
                  <RouterLink v-else :to="{ name: 'parcours', params: { id: day.dayID } }"><span class="overlay">Day {{ dayIndex + 1 }}</span></RouterLink>
                </div>
              </div>
            </div>

            <!-- Container for reset buttons -->
            <div class=" box">
              <div class="columns is-6  container">
                <!-- Button to reset the current week -->
                <button @click="resetWeek" class="button is-danger">Reset Week</button>
                <!-- Button to reset the entire program -->
                <button @click="resetProgram" class="button reset is-danger">Reset Program</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

// Define the props needed by the component
const props = defineProps(['programs', 'userData']);
const activeWeek = ref(null); // Declaration of activeWeek

// Compute filtered programs based on selectedProgramID
const filteredPrograms = computed(() => {
  const selectedProgramID = props.userData.selectedProgramID;
  return props.programs.filter((program) => program.programID === selectedProgramID);
});

// Count the number of finished days in a week
const countFinishedDaysInWeek = (week) => week.days.filter((day) => day.finished).length;

// Reset the current week
const resetWeek = () => {
  if (activeWeek.value) {
    activeWeek.value.days.forEach(day => {
      day.finished = false;
      day.sequences.forEach(sequence => {
        sequence.finished = false;
      });
    });
    updateProgress();
  }
};

// Reset the entire program
const resetProgram = () => {
  filteredPrograms.value.forEach((program) => {
    program.weeks.forEach((week) => {
      week.days.forEach(day => {
        day.finished = false;
        day.sequences.forEach(sequence => {
          sequence.finished = false;
        });
      });
      week.finished = false;
    });
  });
  updateProgress();
};

// Update the progress bar values
const updateProgress = () => {
  filteredPrograms.value.forEach((program, programIndex) => {
    const unfinishedWeek = program.weeks.find((week) => !week.finished);

    if (unfinishedWeek) {
      const totalWeeks = parseInt(program.durationWeek, 10);
      const weekIndex = program.weeks.indexOf(unfinishedWeek);

      const progressBarWeek = document.querySelector(`#progress-bar-week-${programIndex}`);
      const progressBarDay = document.querySelector(`#progress-bar-day-${programIndex}`);

      const progressPercentageWeek = (weekIndex / (totalWeeks - 1)) * 100;
      progressBarWeek.value = progressPercentageWeek;

      const unfinishedDays = unfinishedWeek.days.filter((day) => !day.finished);
      const totalDays = unfinishedWeek.days.length;

      if (unfinishedDays.length > 0) {
        const dayIndexInWeek = countFinishedDaysInWeek(unfinishedWeek);
        progressBarDay.value = (dayIndexInWeek / totalDays) * 100;
      }
    }
  });
};

// Execute updateProgress on component mount
onMounted( () => {
  updateProgress();
});
</script>

<style>
.finished-day {
  color: green;
}

.upcoming-day {
  color: red;
}
.overlay{
background-color: blue;
}
</style>
