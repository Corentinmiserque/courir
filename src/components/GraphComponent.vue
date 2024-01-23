<template>
    <div>
      <!-- ... le reste du code ... -->
      <div> Graph</div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import Chart from 'chart.js/auto';
  
  // Reste du code...
  
  const chartData = ref({});
  const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    // ... autres options Chart.js ...
  });
  
  let myChart; // Variable pour stocker l'instance du graphique
  
  // Fonction pour créer ou mettre à jour le graphique
  const updateChart = () => {
    if (myChart) {
      // Si le graphique existe déjà, mettez à jour ses données
      myChart.data = chartData.value;
      myChart.update();
    } else {
      // Sinon, créez le graphique
      const ctx = document.getElementById('chartCanvas').getContext('2d');
      myChart = new Chart(ctx, {
        type: 'line', // ou 'bar', 'radar', etc., selon le type de graphique souhaité
        data: chartData.value,
        options: chartOptions.value,
      });
    }
  };
  
  // Fonction pour mettre à jour les données du graphique
  const updateChartData = () => {
    // ... logique pour récupérer les données du graphique ...
    chartData.value = {
      labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', /* ... autres semaines ... */],
      datasets: [
        {
          label: 'Jours Terminés (Time)',
          borderColor: 'rgb(75, 192, 192)',
          data: [/* ... données de temps par semaine ... */],
        },
        {
          label: 'Jours Terminés (Distance)',
          borderColor: 'rgb(255, 99, 132)',
          data: [/* ... données de distance par semaine ... */],
        },
      ],
    };
  
    // Appel de la fonction pour créer ou mettre à jour le graphique
    updateChart();
  };
  
  onMounted(() => {
    // Mettez à jour les données du graphique au moment du montage du composant
    updateChartData();
  });
  
  // Utilisez watch pour mettre à jour les données du graphique lorsque les données changent
  watch(/* ... la variable qui déclenche la mise à jour du graphique ... */ () => {
    updateChartData();
  });
  </script>
  