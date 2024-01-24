<template>
  <div class="homepage-info container">
    <div v-for="(program, programIndex) in filteredPrograms" :key="program.programID">
      <h2 class="title is-4">Program: {{ program.name }}</h2>

      <div v-if="program.weeks.some(week => !week.finished)">
        <div class='box' v-if="activeWeek = program.weeks.find(week => !week.finished)">
          <div class="week container">
            <div class="box">
              <h3 class="subtitle is-5">Week {{ program.weeks.findIndex(week => !week.finished) + 1 }} of {{ program.durationWeek }}</h3>
              <div class="progress container">
                <progress :id="'progress-bar-week-' + programIndex" class="progress is-primary" value="0" max="100"></progress>
              </div>

              <div class="day-progress container">
                <h3>Day {{ countFinishedDaysInWeek(activeWeek) }} of {{ activeWeek.days.length }}</h3>
                <progress :id="'progress-bar-day-' + programIndex" class="progress is-info" value="0" max="100"></progress>
              </div>
            </div>
            <div class="box">
              <div class="columns is-centered is-justify-content-space-around ">
                <div v-for="(day, dayIndex) in activeWeek.days" :key="day.dayID" class='column box is-2 has-text-centered'>
                  <span v-if="day.finished" class="finished-day ">Day {{ dayIndex + 1 }} (Finished)</span>

                  <span v-else-if="day.finished === false && dayIndex > countFinishedDaysInWeek(activeWeek)" class="upcoming-day">Day {{ dayIndex + 1 }} (Upcoming)</span>
                  <RouterLink v-else :to="{ name: 'parcours', params: { id: day.dayID } }">Day {{ dayIndex + 1 }}</RouterLink>
                </div>
              </div>
            </div>
            <div class=" box">
              <div class="columns is-6  container">
                <button @click="resetWeek" class="button is-danger">Reset Week</button>
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

const props = defineProps(['programs', 'userData']);
const activeWeek = ref(null); // Déclaration de activeWeek

const filteredPrograms = computed(() => {
  const selectedProgramID = props.userData.selectedProgramID;
  return props.programs.filter((program) => program.programID === selectedProgramID);
});

const countFinishedDaysInWeek = (week) => week.days.filter((day) => day.finished).length;

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
.reset{
  margin-left: 20px;
}
</style>
