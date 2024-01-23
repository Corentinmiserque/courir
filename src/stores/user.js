import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: {},
    errorUser: false,
  }),
  getters: {
    theUser: (state) => {
      return state.user;
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
      // Add logic to update the selected program in the user data
      this.user.selectedProgramID = selectedProgramID;

      // Save the updated user data
      this.saveUserData(this.user);
    },
  },
});
