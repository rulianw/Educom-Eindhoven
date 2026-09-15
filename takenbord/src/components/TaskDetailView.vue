<script setup>

import { useDashboardStore } from '../stores/useDashboardStore.js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
});

const router = useRouter();
const dashboardStore = useDashboardStore();
const { tasks } = storeToRefs(dashboardStore);
const task = computed(() => tasks.value.find(t => t.id === Number(props.id)))

const statusClass = computed(() => {
    if (!task.value) return '';
    switch (task.value.status) {
        case 'To Do':
            return 'status-todo';
        case 'In Progress':
            return 'status-in-progress';
        case 'Completed':
            return 'status-completed';
        default:
            return '';
    }
});

function close() {
  router.push({ name: 'Dashboard' });
}

</script>

<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-card" v-if="task">
      <button class="close-btn" @click="close" aria-label="Close">✕</button>
      <span class="status-pill" :class="statusClass">{{ task.status }}</span>
      <h2>{{ task.title }}</h2>
      <p class="modal-desc">{{ task.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(58, 58, 58, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  max-width: 420px;
  width: 90%;
  position: relative;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-offwhite);
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-ink);
}

.status-pill {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.75rem;
}
.status-todo     { background: var(--color-lagoon); }
.status-progress { background: var(--color-sunset); }
.status-done     { background: var(--color-moss); }

.modal-card h2 {
  font-family: var(--font-heading);
  margin: 0 0 0.75rem;
  color: var(--color-ink);
}

.modal-desc {
  color: var(--color-ink);
  line-height: 1.5;
}
</style>
