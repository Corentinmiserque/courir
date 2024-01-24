import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: {
      options: {},
    },
    errorUser: false,
  }),
  getters: {
    theUser: (state) => {
      return state.user;
    },
    userOptions: (state) => {
      return state.user.options;
    },
  },
  actions: {
    saveUserData(userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    },

    loadUserData() {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        this.user = JSON.parse(storedData);
      }
    },

    changeProgram(selectedProgramID) {
      if (!this.user.options) {
        this.user.options = {};
      }

      this.user.selectedProgramID = selectedProgramID;
      this.saveUserData(this.user);
    },

    updateOption(optionName, value) {
      if (!this.user.options) {
        this.user.options = {};
      }

      // Mettez à jour l'option spécifiée dans les données de l'utilisateur
      this.user.options[optionName] = value;

      // Sauvegardez les données utilisateur mises à jour
      this.saveUserData(this.user);
    },
  },
});

