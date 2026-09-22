<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  todoCount: { type: Number, required: true },
  progressCount: { type: Number, required: true },
  doneCount: { type: Number, required: true },
})

// chartData needs to be a computed property, not a plain object —
// this way, whenever the props change (a task moves columns), the
// chart automatically re-renders with the new numbers.
const chartData = computed(() => ({
  labels: ['To Do', 'In Progress', 'Completed'],
  datasets: [
    {
      label: 'Tasks',
      data: [props.todoCount, props.progressCount, props.doneCount],
      backgroundColor: ['#94bebb', '#e89c73', '#657652'], // lagoon, sunset, palm
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false } // only one dataset, so a legend just clutters
  },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1 } } // whole-number task counts only
  }
}
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>