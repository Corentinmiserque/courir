<template>
  <div>
    <div v-if="daySequences && daySequences.length" class="box">
      <h3 class="title is-4"> Étape {{ activeSequenceIndex + 1 }} sur {{ daySequences.length }}</h3>
      <div v-show="!currentSequence.finished">
        <h2 v-show="showSequenceTitle" class="subtitle is-1">{{ currentSequence.type }} pendant {{ currentSequence.time }} minutes</h2>
        <div v-if="activeSequenceIndex === activeSequenceIndex">
          <p class="subtitle is-5">Temps restant : {{ formatTime(timeRemaining) }}</p>
        </div>
        <div>
          <p class="subtitle is-5">Distance parcourue : {{ distance.toFixed(0) }} mètres</p>
        </div>
        <p class="subtitle is-5">Temps total restant : {{ formatTime(totalTimeRemaining) }}</p>
      </div>
      <div class="buttons">
        <button @click="start" v-show="!timer" class="button is-primary">
          Start
        </button>

        <button @click="toggleTimer" v-show="!currentSequence.finished" class="button is-info">
          {{ timerPaused ? 'Reprendre' : 'Pause' }}
        </button>

        <button @click="abandonSequences" v-show="!currentSequence.finished" class="button is-danger">
          Abandonner
        </button>
      </div>
      
      <div v-show="currentSequence.finished">
      <div class="congratulations">
        <h2 class="title is-2">Félicitations!</h2>
        <p>Vous avez couru {{ distance.toFixed(0) }} mètres en {{ formatTime(totalTimeElapsed) }}.</p>

        <button @click="goToPreviousPage" class="button is-info">
          Retour à la page précédente
        </button>

        <button @click="abandonSequences" class="button is-danger">
          Recommencer
        </button>
       
      </div>
      </div>
    </div>
  </div>

  
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProgramStore } from '@/stores/programs';
import { useUserStore } from '@/stores/user';

const $router = useRouter();
const route = useRoute();
const id = ref(route.params.id);

//permets d'empecher de lire plusieurs fois le meme message
let lastAnnouncedMessage = "";

const programStore = useProgramStore();
const userStore = useUserStore();


const daySequences = ref([]);
const activeSequenceIndex = ref(0);
const timeRemaining = ref(0);

let timer;
let timerPaused = false;

const currentSequence = ref({}); //stock séquence en cours 

const distance = ref(0); // Variable pour stocker la distance parcourue

const totalDuration = ref(0);
const totalTimeRemaining = ref(0);
const totalTimeElapsed = ref(0);

const showSequenceTitle = ref(false); // permet d'afficher le titre seulement au start

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = seconds % 60;
  return `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
};

const vibrate = (pattern) => {
  // Vérifie si la fonction vibrate est prise en charge par le navigateur
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

const calculateTotalDuration = () => {
  totalDuration.value = daySequences.value.reduce((total, sequence) => total + sequence.time * 60, 0);
};

const goToPreviousPage = () => {
  $router.go(-1);
};

const updateTotalTimeRemaining = () => {
  totalTimeRemaining.value = totalDuration.value - totalTimeElapsed.value;
};

const speak = (text) => {
  // Vérifie si le son est activé avant de parler
  if (userStore.user.options.sound) {
    if (text !== lastAnnouncedMessage) {
      const synth = window.speechSynthesis;

      // Vérifie si la synthèse vocale est disponible
      if (synth && synth.getVoices().length > 0) {
        const utterance = new SpeechSynthesisUtterance(text);

        // Utilise la première voix disponible plutôt que de spécifier une voix
        utterance.voice = synth.getVoices()[0];

        synth.speak(utterance);
        lastAnnouncedMessage = text;
      }
    }
  }
};

const start = () => {
  if (!timer) {
    const currentSequence = daySequences.value[activeSequenceIndex.value];
    if (currentSequence && !currentSequence.finished) {
      startTimer(currentSequence.time, timeRemaining.value);
      startTrackingDistance(); // Démarre le suivi de la distance
      showSequenceTitle.value = true; 
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
      startTrackingDistance();
      timerPaused = false;
    }
  }

  // Directly manipulate the button text
  const button = document.querySelector('.button.is-info');
  if (button) {
    button.innerText = timerPaused ? 'Reprendre' : 'Pause';
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
    vibrate([200, 100, 200]); // Exemple de motif de vibration (vibre 200 ms, pause 100 ms, puis vibre à nouveau 200 ms)
    
    activeSequenceIndex.value = nextIndex;
    currentSequence.value = daySequences.value[nextIndex];
    
    // Recalculate total time remaining after updating active sequence index
    updateTotalTimeRemaining();
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

    totalTimeElapsed.value++; // Accumuler le temps total écoulé
    updateTotalTimeRemaining();
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
    calculateTotalDuration();
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
  programStore.updateLocalStorage();
});
</script>
