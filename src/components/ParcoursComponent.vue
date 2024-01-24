<template>
  <!-- Main container -->
  <div>
    <!-- Check if daySequences is not empty -->
    <div v-if="daySequences && daySequences.length" class="box">
      <!-- Display current sequence information -->
      <h3 class="title is-3" v-show="!currentSequence.finished"> Step {{ timer ? activeSequenceIndex + 1 : 0 }} of {{ daySequences.length }}</h3>

      <div v-show="!currentSequence.finished">
        <!-- Display current sequence type and time -->
        <h2 v-show="timer && !timerPaused" class="subtitle is-1">{{ currentSequence.type }} during {{ currentSequence.time }} minutes</h2>

        <!-- Display time, distance, and total time remaining -->
        <div class="container time mb-5">
          <div v-if="activeSequenceIndex === activeSequenceIndex">
            <p class="subtitle is-5">Step time remaining: {{ formatTime(timeRemaining) }}</p>
          </div>
          <div>
            <p class="subtitle is-5">Distance covered: {{ distance.toFixed(0) }} meters</p>
          </div>
          <p class="title is-4">Total time remaining: {{ formatTime(totalTimeRemaining) }}</p>
        </div>
      </div>
    </div>

    <!-- Buttons container -->
    <div class="buttons container">
      <!-- Start button -->
      <button @click="start" v-show="!timer" class="button is-primary">
        Start
      </button>
      <!-- Pause/Resume button -->
      <button @click="toggleTimer" v-show="!currentSequence.finished" class="button is-info">
        {{ timerPaused ? 'Resume' : 'Pause' }}
      </button>
      <!-- Give up button -->
      <button @click="abandonSequences"  v-show="!currentSequence.finished" class="button is-danger">
        Give up
      </button>
    </div>

    <!-- Display congratulations and options after finishing all sequences -->
    <div v-show="currentSequence.finished">
      <div class="congratulations box">
        <h2 class="title is-2">Congratulations!</h2>
        <p>You ran {{ distance.toFixed(0) }} meters in {{ formatTime(totalTimeElapsed) }}.</p>
        <!-- Finish button -->
        <button class="button is-info" @click="goToPreviousPage">
          Finish
        </button>
        <!-- Restart button -->
        <button @click="abandonSequences" class="button is-danger restart">
          <p>Restart</p>
        </button>
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
let lastAnnouncedMessage = "";
const programStore = useProgramStore();
const userStore = useUserStore()
const daySequences = ref([]);
const activeSequenceIndex = ref(0);
const timeRemaining = ref(0);
let timer;
let timerPaused = false;
const currentSequence = ref({});
const distance = ref(0); // Variable pour stocker la distance parcourue
const totalDuration = ref(0);
const totalTimeRemaining = ref(0);
const totalTimeElapsed = ref(0);

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = seconds % 60;
  return `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
};

// Function to calculate the total duration of all sequences
const calculateTotalDuration = () => {
  totalDuration.value = daySequences.value.reduce((total, sequence) => total + sequence.time * 60, 0);
};

// Function to navigate to the previous page
const goToPreviousPage = () => {
  $router.go(-1);
};

// Function to update total time remaining
const updateTotalTimeRemaining = () => {
  totalTimeRemaining.value = totalDuration.value - totalTimeElapsed.value;
};

// Function to announce messages using text-to-speech and optional vibration
const speak = (text) => {
  if (text !== lastAnnouncedMessage && userStore.theUser.options.sound) {
    const synth = window.speechSynthesis;
    if (synth && synth.getVoices().length > 0) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = synth.getVoices()[0];
      synth.speak(utterance);
      lastAnnouncedMessage = text;
    }
  }
};

// Function to trigger vibration if enabled
const vibrate = () => {
  if (navigator.vibrate && userStore.theUser.options.vibration) {
    navigator.vibrate([200, 100, 200]);
  }
};

// Function to start a sequence
const start = () => {
  if (!timer) {
    const currentSequence = daySequences.value[activeSequenceIndex.value];
    if (currentSequence && !currentSequence.finished) {
      startTimer(currentSequence.time, timeRemaining.value);
      speak(`${currentSequence.value.type} during ${currentSequence.value.time} minutes`);
      startTrackingDistance(); // Démarre le suivi de la distance
    }
  }
};

// Function to pause the timer
const pauseTimer = () => {
  clearInterval(timer);
  timer = null;
  timerPaused = true;
  stopTrackingDistance(); // Arrête le suivi de la distance
};


// Function to toggle the timer (pause/resume)
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
  // Update the button text based on the timer state
  const buttonText = timerPaused ? 'Resume' : 'Pause';
  const buttonElement = document.querySelector('.button.is-info');
  if (buttonElement) {
    buttonElement.innerText = buttonText;
  }
};

//
// Function to finish the current sequence
const finishSequence = () => {
  const currentSequence = daySequences.value[activeSequenceIndex.value];
  if (currentSequence && !currentSequence.finished) {
    programStore.finishSequence(id.value, activeSequenceIndex.value);
    currentSequence.finished = true;
    showNextSequence();
    stopTrackingDistance(); // Arrête le suivi de la distance
  }
};

// Function to show the next sequence
const showNextSequence = () => {
  const nextIndex = daySequences.value.findIndex(
    (sequence, index) => index >= activeSequenceIndex.value && !sequence.finished
  );

  if (nextIndex !== -1) {
    activeSequenceIndex.value = nextIndex;
    currentSequence.value = daySequences.value[nextIndex];
    
    // Recalculate total time remaining after updating active sequence index
    updateTotalTimeRemaining();
    vibrate();
  }
};

// Function to start the timer
const startTimer = (duration, savedTime = 0) => {
  timeRemaining.value = savedTime > 0 ? savedTime : duration * 60;

  clearInterval(timer);

  speak(`${currentSequence.value.type} during ${currentSequence.value.time} minutes`);

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

// Function to abandon all sequences for the day
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

// Functions for distance tracking
let watchId; // Variable pour stocker l'ID de la fonction de suivi
let previousPosition; // Variable pour stocker la position précédente

// Function to start tracking distance
const startTrackingDistance = () => {
  // window.confirm('We will use your geolocation data to calculate your distance traveled. Do you accept?');
  watchId = navigator.geolocation.watchPosition(updateDistance);
};

// Function to stop tracking distance
const stopTrackingDistance = () => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);

  }
};

// Function to update distance based on current position
const updateDistance = (position) => {
  if (previousPosition) {
    // Calculate the distance between the previous and current positions
    const currentDistance = calculateDistance(previousPosition, position.coords);
    distance.value += currentDistance;
  }

  // Update the previous position
  previousPosition = position.coords;
};

// Function to calculate distance between two coordinates
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

// Function to convert degrees to radians
const degToRad = (deg) => {
  return deg * (Math.PI / 180);
};

// Lifecycle hook: Fetch day sequences on component mount
onMounted(() => {
  daySequences.value = programStore.getDaySequences(id.value);

  if (daySequences.value.length > 0) {
    calculateTotalDuration();
    showNextSequence();
    startTrackingDistance(); // Démarre le suivi de la distance
  }
});

// Watcher: Start the timer and distance tracking when activeSequenceIndex changes
watch(activeSequenceIndex, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    const currentSequence = daySequences.value[newValue];
    if (currentSequence && !currentSequence.finished) {
      startTimer(currentSequence.time, timeRemaining.value);
    }
  }
});

// Lifecycle hook: Clear timers and update local storage on component unmount
onBeforeUnmount(() => {
  clearInterval(timer);
  stopTrackingDistance(); // Arrête le suivi de la distance
  programStore.updateLocalStorage();
});
</script>




<style>
.restart{
  margin-left: 20px;
}

</style>