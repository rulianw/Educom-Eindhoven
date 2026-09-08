<script setup>

import { useDashboardStore } from '../stores/useDashboardStore.js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
});
const dashboardStore = useDashboardStore();
const { tasks } = storeToRefs(dashboardStore);
const task = computed(() => tasks.value.find(t => t.id === Number(props.id)))
</script>

<template>
  <div class="task-detail-view" v-if="task">
    <h1>{{ task.title }}</h1>
    <p>Status: {{ task.status }}</p>
    <p>Description: {{ task.description }}</p>
    <button @click="$router.back()">x</button>
  </div>
</template>

