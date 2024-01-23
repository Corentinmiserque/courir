import { defineStore } from 'pinia';

export const useProgramStore = defineStore('program', {
  state: () => ({
    data: {},
  }),
getters:{
  allData: (state) => state.data,
},
  actions: {
    async initializeData() {
      const localStorageData = localStorage.getItem('courirData');

      if (localStorageData) {
        this.data = JSON.parse(localStorageData);
        // alert('Data loaded from local storage');
      } else {
        try {
          // Fetch data from programs.json
          const response = await fetch('programs.json'); 
          const programsJson = await response.json();

          console.log(programsJson)

          this.$patch({data:programsJson});

          //this.updateLocalStorage();
          localStorage.setItem('courirData', JSON.stringify(this.data));
          // alert('Data loaded from programs.json');
        } catch (error) {
          console.error('Error loading data from programs.json:', error);
        }
      }
    },
    
    getDaySequences(dayId) {
      const programs = this.data.programs;
      for (const program of programs) {
        for (const week of program.weeks) {
          for (const day of week.days) {
            if (day.dayID === dayId) {
              return day.sequences;
            }
          }
        }
      }
      return [];
    },


    finishSequence(dayId, sequenceIndex) {
      const programs = this.data.programs;
      for (const program of programs) {
        for (const week of program.weeks) {
          const day = week.days.find((d) => d.dayID === dayId);
          if (day && day.sequences[sequenceIndex]) {
            day.sequences[sequenceIndex].finished = true;
            this.updateLocalStorage();
            this.finishDay(day);
            return;
          }
        }
      }
    },

    finishDay(day) {
      // Vérifier si toutes les séquences du jour sont terminées
      const allSequencesFinished = day.sequences.every((sequence) => sequence.finished);
    
      // Si toutes les séquences sont terminées, marquer le jour comme terminé
      if (allSequencesFinished) {
        day.finished = true;
      } else {
        // Si au moins une séquence n'est pas terminée, marquer le jour comme non terminé
        day.finished = false;
      }
    
      // Mettre à jour le stockage local après chaque modification
      this.updateLocalStorage();
    },
    
    abandonSequences({ commit, state }, id) {
      // Logique pour réinitialiser les séquences à "finished = false" et mettre à jour la journée
      state.programs[id].sequences.forEach((sequence) => {
        sequence.finished = false;
      });
      commit('updateDayFinished', id);
    },
    
    updateDayDistance(dayId, distance) {
      const programs = this.data.programs;

      // Loop through programs, weeks, and days to find the specific day
      for (const program of programs) {
        for (const week of program.weeks) {
          for (const day of week.days) {
            if (day.dayID === dayId) {
              // Update the day's distance in the store
              day.distance = distance;

              // Update the local storage
              this.updateLocalStorage();

              return;
            }
          }
        }
      }
    },
  
    updateLocalStorage() {
      localStorage.setItem('courirData', JSON.stringify(this.data));
    },
  },
});
