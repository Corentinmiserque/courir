<template>
  <div>
    <div v-if="daySequences && daySequences.length">
      <h3>Séquence pour le jour {{ id }} - Étape {{ activeSequenceIndex + 1 }} sur {{ daySequences.length }}</h3>
      <div v-show="!currentSequence.finished">
        {{ currentSequence.type }} - {{ currentSequence.time }} minutes
        <div v-if="activeSequenceIndex === activeSequenceIndex">
          Temps restant : {{ formatTime(timeRemaining) }}
        </div>
        <div>
          <!-- Affiche la distance parcourue -->
          Distance parcourue : {{ distance.toFixed(0) }} mètres
        </div>
      </div>
      <button @click="start" :disabled="timer">
        Start
      </button>
      <button @click="toggleTimer">
        {{ timerPaused ? 'Reprendre' : 'Pause' }}
      </button>
      <button @click="abandonSequences">
        Abandonné
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProgramStore } from '@/stores/programs';

const $router = useRouter();
const route = useRoute();
const id = ref(route.params.id);
let lastAnnouncedMessage = "";
const programStore = useProgramStore();
const daySequences = ref([]);
const activeSequenceIndex = ref(0);
const timeRemaining = ref(0);
let timer;
let timerPaused = false;
const currentSequence = ref({});
const distance = ref(0); // Variable pour stocker la distance parcourue

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = seconds % 60;
  return `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
};

const speak = (text) => {
  if (text !== lastAnnouncedMessage) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
    lastAnnouncedMessage = text;
  }
};

const start = () => {
  if (!timer) {
    const currentSequence = daySequences.value[activeSequenceIndex.value];
    if (currentSequence && !currentSequence.finished) {
      startTimer(currentSequence.time, timeRemaining.value);
      startTrackingDistance(); // Démarre le suivi de la distance
    }
  }
};

const pauseTimer = () => {
  clearInterval(timer);
  timer = null;
  timerPaused = true;
  stopTrackingDistance(); // Arrête le suivi de la distance
};

const toggleTimer = () => {
  if (timer) {
    pauseTimer();
  } else {
    const currentSequence = daySequences.value[activeSequenceIndex.value];
    if (currentSequence && !currentSequence.finished) {
      startTimer(currentSequence.time, timeRemaining.value);
      startTrackingDistance(); // Démarre le suivi de la distance
    }
  }
};

const finishSequence = () => {
  const currentSequence = daySequences.value[activeSequenceIndex.value];
  if (currentSequence && !currentSequence.finished) {
    programStore.finishSequence(id.value, activeSequenceIndex.value);
    currentSequence.finished = true;
    showNextSequence();
    stopTrackingDistance(); // Arrête le suivi de la distance
  }
};

const showNextSequence = () => {
  const nextIndex = daySequences.value.findIndex(
    (sequence, index) => index >= activeSequenceIndex.value && !sequence.finished
  );

  if (nextIndex !== -1) {
    activeSequenceIndex.value = nextIndex;
    currentSequence.value = daySequences.value[nextIndex];
  }
};

const startTimer = (duration, savedTime = 0) => {
  timeRemaining.value = savedTime > 0 ? savedTime : duration * 60;

  clearInterval(timer);

  speak(`${currentSequence.value.type} pendant ${currentSequence.value.time} minutes`);

  timer = setInterval(() => {
    timeRemaining.value--;

    if (timeRemaining.value <= 0) {
      clearInterval(timer);
      finishSequence();
    }
  }, 1000);

  timerPaused = false;
};

const abandonSequences = () => {
  const id = route.params.id;

  programStore.allData.programs.forEach((program) => {
    program.weeks.forEach((week) => {
      const day = week.days.find((d) => d.dayID === id);
      if (day) {
        day.sequences.forEach((sequence) => {
          sequence.finished = false;
        });
        programStore.finishDay(day);
      }
    });
  });

  $router.go(-1);
};

// Fonctions pour le suivi de la distance
let watchId; // Variable pour stocker l'ID de la fonction de suivi
let previousPosition; // Variable pour stocker la position précédente

const startTrackingDistance = () => {
  watchId = navigator.geolocation.watchPosition(updateDistance);
};

const stopTrackingDistance = () => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
};

const updateDistance = (position) => {
  if (previousPosition) {
    // Calcule la distance entre les positions précédente et actuelle
    const currentDistance = calculateDistance(previousPosition, position.coords);
    distance.value += currentDistance;
  }

  // Met à jour la position précédente
  previousPosition = position.coords;
};

const calculateDistance = (coord1, coord2) => {
  const earthRadius = 6371; // Rayon moyen de la Terre en kilomètres
  const lat1 = degToRad(coord1.latitude);
  const lon1 = degToRad(coord1.longitude);
  const lat2 = degToRad(coord2.latitude);
  const lon2 = degToRad(coord2.longitude);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;
  return distance * 1000; // Convertit en mètres
};

const degToRad = (deg) => {
  return deg * (Math.PI / 180);
};

onMounted(() => {
  daySequences.value = programStore.getDaySequences(id.value);

  if (daySequences.value.length > 0) {
    showNextSequence();
  }
});

watch(activeSequenceIndex, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    const currentSequence = daySequences.value[newValue];
    if (currentSequence && !currentSequence.finished) {
      startTimer(currentSequence.time, timeRemaining.value);
      startTrackingDistance(); // Démarre le suivi de la distance
    }
  }
});

onBeforeUnmount(() => {
  clearInterval(timer);
  stopTrackingDistance(); // Arrête le suivi de la distance
  programStore.updateDayDistance(id.value, distance.value);
  programStore.updateLocalStorage();
});
</script>
