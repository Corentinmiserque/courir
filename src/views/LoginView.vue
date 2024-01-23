<template>
  <main>
    <!-- Formulaire de connexion -->
    <form @submit.prevent="identification" class="login">
      <!-- Champ pour saisir le pseudo -->
      <div class="field">
        <label class="label" for="pseudo">Pseudo</label>
        <div class="control">
          <input type="text" class="input" v-model="pseudo" id="pseudo" required>
        </div>
      </div>

      <!-- Liste déroulante pour sélectionner le programme -->
      <div class="field">
        <label class="label" for="program">Programme</label>
        <div class="control">
          <select v-model="selectedProgram" id="program" required>
            <option disabled value="">Sélectionnez un programme</option>
            <option v-for="program in programs" :key="program.programID" :value="program.programID">{{ program.name }}</option>
          </select>
        </div>
      </div>

      <!-- Bouton de soumission du formulaire -->
      <div class="field has-text-centered">
        <button type="submit" class="button is-primary">S'identifier</button>
      </div>
    </form>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useProgramStore } from '@/stores/programs';

const UserStore = useUserStore();
const programStore = useProgramStore();

// Variables réactives pour stocker le pseudo et le programme sélectionné
const pseudo = ref('');
const selectedProgram = ref('');

import { useRouter } from 'vue-router';
const $router = useRouter();

// Fonction d'identification
const identification = () => {
  // Vérifie si le pseudo et le programme sont choisis
  if (pseudo.value && selectedProgram.value) {
    const userData = {
      username: pseudo.value,
      selectedProgramID: selectedProgram.value,
    };

    // Appelle la fonction d'enregistrement des données utilisateur
    UserStore.saveUserData(userData);

    // Effectue la redirection uniquement si les valeurs sont présentes
    $router.push('/homepage');
  } else {
    // Affiche un message d'erreur ou effectue d'autres actions en fonction des besoins
    console.error("Veuillez remplir tous les champs avant de continuer.");
  }
};

// Liste des programmes obtenue depuis le store
const programs = computed(() => {
  console.log(programStore.allData.programs);
  return programStore.allData.programs;
});

// Vérifie s'il y a déjà des données utilisateur enregistrées dans le stockage local lors du montage du composant
onMounted(async() => {
  const savedUserData = UserStore.theUser;
  console.log(savedUserData);
  if (Object.keys(savedUserData).length !== 0) {
    // Si des données sont présentes, redirige vers la page d'accueil
    $router.push('/homepage');
  }
});
</script>
