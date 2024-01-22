<template>
    <div>
      <div v-if="daySequences && daySequences.length">
        <h3>Séquence pour le jour {{ id }} - Étape {{ activeSequenceIndex + 1 }} sur {{ daySequences.length }}</h3>
        <div v-show="!currentSequence.finished">
          {{ currentSequence.type }} - {{ currentSequence.time }} minutes
          <div v-if="activeSequenceIndex === activeSequenceIndex">
            Temps restant : {{ formatTime(timeRemaining) }}
          </div>
        </div>
  
        <button @click="toggleTimer">
          {{ timer ? (timerPaused ? 'Reprendre' : 'Pause') : 'Start' }}
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
  
  const pauseTimer = () => {
    clearInterval(timer);
    timer = null;
    timerPaused = true;
  };
  
  const toggleTimer = () => {
    if (timer) {
      pauseTimer();
    } else {
      const currentSequence = daySequences.value[activeSequenceIndex.value];
      if (currentSequence && !currentSequence.finished) {
        startTimer(currentSequence.time, timeRemaining.value);
      }
    }
  };
  
  const finishSequence = () => {
    const currentSequence = daySequences.value[activeSequenceIndex.value];
    if (currentSequence && !currentSequence.finished) {
      programStore.finishSequence(id.value, activeSequenceIndex.value);
      currentSequence.finished = true;
      showNextSequence();
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
    daySequences.value.forEach((sequence, index) => {
      daySequences.value[index].finished = false;
    });
  
    // Remettre day.finished à false
    programStore.getDay(id.value).finished = false;
  
    // Rediriger vers la page précédente
    $router.go(-1);
  };
  
  onMounted(() => {
    daySequences.value = programStore.getDaySequences(id.value);
  
    if (daySequences.value.length > 0) {
      showNextSequence();
      startTimer(currentSequence.value.time);
    }
  });
  
  watch(activeSequenceIndex, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      const currentSequence = daySequences.value[newValue];
      if (currentSequence && !currentSequence.finished) {
        startTimer(currentSequence.time, timeRemaining.value);
      }
    }
  });
  
  onBeforeUnmount(() => {
    clearInterval(timer);
    programStore.updateLocalStorage();
  });
  </script>
  