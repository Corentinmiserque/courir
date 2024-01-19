<template>
    <div>
      <p>L'ID récupéré de la route est : {{ id }}</p>
      <RouterView />
      <div v-if="daySequences && daySequences.length">
        <h3>Séquences pour le jour {{ id }}</h3>
        <ul>
          <li v-for="(sequence, index) in daySequences" :key="index">
            {{ sequence.type }} - {{ sequence.time }} minutes
            <div v-if="!sequence.finished && index === activeSequenceIndex">
              Temps restant : {{ formatTime(timeRemaining) }}
            </div>
          </li>
        </ul>
        <button @click="toggleTimer">{{ timer ? 'Pause' : 'Reprendre' }}</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useRoute } from 'vue-router';
  import { useProgramStore } from '@/stores/programs';
  
  const route = useRoute();
  const id = ref(route.params.id);
  
  const programStore = useProgramStore();
  const daySequences = ref([]);
  const activeSequenceIndex = ref(0);
  const timeRemaining = ref(0);
  let timer;
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    return `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
  };
  
  const startNextSequenceIfNeeded = () => {
    activeSequenceIndex.value++;
    if (activeSequenceIndex.value < daySequences.value.length) {
      const nextSequence = daySequences.value[activeSequenceIndex.value];
      if (!nextSequence.finished) {
        startTimer(nextSequence.time);
      } else {
        startNextSequenceIfNeeded();
      }
    } else {
      console.log("Toutes les séquences sont terminées");
    }
  };
  

  
  const pauseTimer = () => {
    clearInterval(timer);
    timer = null;
  };


  const toggleTimer = () => {
  if (timer) {
    // Si le minuteur est en cours, mettez-le en pause
    pauseTimer();
  } else {
    // Si le minuteur est en pause, reprenez-le
    const currentSequence = daySequences.value[activeSequenceIndex.value];
    if (currentSequence && !currentSequence.finished) {
      startTimer(currentSequence.time, timeRemaining.value);
    }
  }
};

const startTimer = (duration, savedTime = 0) => {
  timeRemaining.value = savedTime > 0 ? savedTime : duration * 60;
  timer = setInterval(() => {
    timeRemaining.value--;
    if (timeRemaining.value <= 0) {
      clearInterval(timer);
      programStore.finishSequence(id.value, activeSequenceIndex.value);
      startNextSequenceIfNeeded();
    }
  }, 1000);
};
  
  onMounted(() => {
    daySequences.value = programStore.getDaySequences(id.value);
  
    if (daySequences.value.length > 0) {
      const firstSequence = daySequences.value[0];
      if (!firstSequence.finished) {
        startTimer(firstSequence.time);
      }
    }
  });
  
  onBeforeUnmount(() => {
    // Assurez-vous d'effacer le minuteur lors de la destruction du composant
    clearInterval(timer);
  });
  </script>
  