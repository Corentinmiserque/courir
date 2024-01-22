<template>
  <div class="homepage-info">
    <div class="program" v-for="(program, programIndex) in props.programs" :key="program.programID">
      <h2>Programme : {{ program.name }}</h2>

      <div v-if="program.weeks.find(week => !week.finished)">
        <div v-if="activeWeek = program.weeks.find(week => !week.finished)">
          <div class="week">
            <h3>Semaine {{ program.weeks.findIndex(week => !week.finished) + 1 }} sur {{ program.durationWeek }}</h3>
            <div id="progress-container">
              <progress :id="'progress-bar-week-' + programIndex" value="0" max="100"></progress>
            </div>

            <div id="day-progress">
              <h3>Jour {{ countFinishedDaysInWeek(activeWeek) }} sur {{ activeWeek.days.length }}</h3>
              <progress :id="'progress-bar-day-' + programIndex" value="0" max="100"></progress>
            </div>

            <div v-for="(day, dayIndex) in activeWeek.days" :key="day.dayID">
              <span v-if="day.finished" class="finished-day">Jour {{ dayIndex + 1 }} (Terminé)</span>
              <span v-else-if="day.finished === false && dayIndex > countFinishedDaysInWeek(activeWeek)" class="upcoming-day">Jour {{ dayIndex + 1 }} (À venir)</span>
              <RouterLink v-else :to="{ name: 'parcours', params: { id: day.dayID } }">Jour {{ dayIndex + 1 }}</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps(['programs']);

const countFinishedDaysInWeek = (week) => week.days.filter((day) => day.finished).length;

const updateProgress = () => {
  props.programs.forEach((program, programIndex) => {
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

onMounted(() => {
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
</style>
