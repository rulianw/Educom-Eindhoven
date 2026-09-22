<script setup>
import { useDashboardStore } from '../stores/useDashboardStore.js'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  id: { type: Number, required: true }
})

const router = useRouter()
const dashboardStore = useDashboardStore()
const { tasks } = storeToRefs(dashboardStore)
const task = computed(() => tasks.value.find(t => t.id === Number(props.id)))

const editMode = ref(false)
const titleTouched = ref(false)

const statusClass = computed(() => {
  if (!task.value) return ''
  switch (task.value.status) {
    case 'To Do': return 'status-todo'
    case 'In Progress': return 'status-progress'
    case 'Completed': return 'status-done'
    default: return ''
  }
})

const editTitle = ref('')
const editDescription = ref('')
const editPriority = ref('')

watch(editMode, (isEditing) => {
  if (isEditing && task.value) {
    editTitle.value = task.value.title
    editDescription.value = task.value.description
    editPriority.value = task.value.priority
    titleTouched.value = false
  }
})

function close() {
  router.push({ name: 'Dashboard' })
}

function submitEdit() {
  const result = dashboardStore.editTask(task.value.id, {
    title: editTitle.value,
    description: editDescription.value,
    priority: editPriority.value,
    status: task.value.status, 
  })

  if (result) {
    console.log(result)
    return
  }

  editMode.value = false
}
</script>

<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-card" v-if="task">

      <div v-if="!editMode">
      <div class="header-row">
        <span class="status-pill" :class="statusClass">{{ task.status }}</span>
        <div class="bar">
          <button class="edit-btn" @click="editMode = true">Edit</button>
          <button class="close-btn" @click="close" aria-label="Close">✕</button>
        </div>
      </div>
        <h2>{{ task.title }}</h2>
        <p class="modal-desc">{{ task.description }}</p>
        <span class="priority-pill" :class="`priority-${task.priority}`">{{ task.priority }}</span>
      </div>

      <form v-else @submit.prevent="submitEdit">
        <div class="bar">
          <button type="button" class="close-btn" @click="close" aria-label="Close">✕</button>
        </div>
        <span class="status-pill" :class="statusClass">{{ task.status }}</span>

        <input
          class="new-task-title"
          type="text"
          v-model="editTitle"
          placeholder="Task title"
          required
          @blur="titleTouched = true"
        />
        <div v-if="titleTouched && editTitle.length < 5" class="error-message">
          Title must be at least 5 characters long.
        </div>

        <textarea
          class="new-task-description"
          v-model="editDescription"
          placeholder="Task description"
          required
        ></textarea>

        <select class="new-task-priority" v-model="editPriority" required>
          <option value="" disabled>Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit" class="save-btn">Save</button>
      </form>

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

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between; 
  margin-bottom: 0.75rem;
}

.bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.status-pill {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  /* margin-bottom and align-self removed — no longer relevant now that
     this sits inside a flex row instead of stacked block-level content */
}

.edit-btn,
.close-btn {
  background: var(--color-offwhite);
  border: none;
  border-radius: var(--radius-pill);
  padding: 0.4rem 0.9rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-ink);
}

.close-btn {
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  padding: 0;
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

.priority-pill {
  display: inline-block;
  font-size: 0.50rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 0.15rem 0.55rem;
  border-radius: var(--radius-pill);
  color: white;
  margin: 0.35rem 0 0.5rem;
  margin-top: 0.5rem;
}
.priority-low    { background: var(--color-moss); }
.priority-medium { background: var(--color-sunset); }
.priority-high   { background: var(--color-sangria); }

.new-task-title,
.new-task-description,
.new-task-priority {
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--color-seabreeze);
  font-family: var(--font-body);
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.new-task-description {
  min-height: 80px;
  resize: vertical;
}

.error-message {
  color: var(--color-sangria);
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: -0.25rem;
  margin-bottom: 0.5rem;
}

.save-btn {
  margin-top: 0.5rem;
  background: var(--color-butter);
  color: var(--color-ink);
  border: none;
  border-radius: var(--radius-pill);
  padding: 0.6rem 1.5rem;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.1s ease, background 0.15s ease;
}

.save-btn:hover {
  background: var(--color-moss);
}
</style>