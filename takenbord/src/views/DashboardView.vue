<script setup>
import draggable from 'vuedraggable'
import { useDashboardStore } from '../stores/useDashboardStore.js'
import { ref, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import iconNeutral from '../img/icon-neutral.png'
import iconTodo from '../img/icon-todo.png'
import iconInProgress from '../img/icon-in-progress.png'
import iconDone from '../img/icon-done.png'

const dashboardStore = useDashboardStore()
const { todoTasks, progressTasks, doneTasks } = storeToRefs(dashboardStore)

const localTodo = ref([])
const localProgress = ref([])
const localDone = ref([])
const trashZone = ref([])

const titleTouched = ref(false)
const currentIcon = ref(iconNeutral)
const iconPop = ref(false)
let hideTimer = null

function iconForStatus(status) {
  return {
    'To Do': iconTodo,
    'In Progress': iconInProgress,
    'Completed': iconDone,
  }[status] || iconNeutral
}

function flashIcon(status) {
  currentIcon.value = iconForStatus(status)
  iconPop.value = true
  setTimeout(() => { iconPop.value = false }, 250)

  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    currentIcon.value = iconNeutral
    hideTimer = null
  }, 4000)
}

onUnmounted(() => {
  if (hideTimer) clearTimeout(hideTimer)
})

function syncFromStore() {
  localTodo.value = [...todoTasks.value]
  localProgress.value = [...progressTasks.value]
  localDone.value = [...doneTasks.value]
}

syncFromStore()
watch([todoTasks, progressTasks, doneTasks], syncFromStore)

function onDrop(event, newStatus) {
  if (event.added) {
    dashboardStore.moveTask(event.added.element.id, newStatus)
    flashIcon(newStatus)
  }
}

function onRemoveDrop(event) {
  if (event.added) {
    dashboardStore.removeTask(event.added.element.id)
    trashZone.value = []
  }
}

const newTaskTitle = ref('')
const newTaskDescription = ref('')
const newTaskPriority = ref('')

function submitTask() {
  const result = dashboardStore.addTask({
    title: newTaskTitle.value,
    description: newTaskDescription.value,
    priority: newTaskPriority.value,
  })

  if (result) {
    console.log(result)
    return
  }

  flashIcon('To Do')
  newTaskTitle.value = ''
  newTaskDescription.value = ''
  newTaskPriority.value = ''
  titleTouched.value = false
}
</script>

<template>
  <div class="dashboard">
    <h1>Kanban Board</h1>

    <div class="upper-container">
      <div class="submit-container">
        <form class="task-form" @submit.prevent="submitTask">
          <div class="column-header">Add New Task</div>
          <input
            class="new-task-title"
            type="text"
            v-model="newTaskTitle"
            placeholder="New task title"
            required
            @blur="titleTouched = true"
          />
          <div v-if="titleTouched && newTaskTitle.length < 5" class="error-message">
            Title must be at least 5 characters long.
          </div>
          <textarea
            class="new-task-description"
            v-model="newTaskDescription"
            placeholder="New task description"
            required
          ></textarea>
          <select class="new-task-priority" v-model="newTaskPriority" required>
            <option value="" disabled>Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit" class="add-task-btn">Add Task</button>
        </form>
      </div>

      <section class="remove-task-section">
        <div class="remove-task-header">
          <div class="column-header">
            <h2>Remove Task</h2>
          </div>
          <span class="remove-icon">×</span>
        </div>

        <draggable
          v-model="trashZone"
          group="tasks"
          item-key="id"
          class="remove-task-area"
          @change="onRemoveDrop"
        >
          <template #item="{ element: task }">
            <div class="remove-task-card">
              <span>{{ task.title }}</span>
              <span class="remove-x">×</span>
            </div>
          </template>

          <template #footer>
            <div class="remove-placeholder">
              Drop a task here to remove it
            </div>
          </template>
        </draggable>
      </section>

      <div class="icon-container">
        <img :src="currentIcon" class="status-icon" :class="{ 'icon-pop': iconPop }" />
      </div>
    </div>

    <div class="board">
      <section class="column column-todo">
        <div class="column-header">To Do</div>
        <draggable
          v-model="localTodo"
          group="tasks"
          item-key="id"
          class="column-list"
          @change="e => onDrop(e, dashboardStore.status[0])"
        >
          <template #item="{ element: task }">
            <div class="task-card">
              <h3>{{ task.title }}</h3>
              <div class="card-side">
                <span class="priority-pill" :class="`priority-${task.priority}`">{{ task.priority }}</span>
                <router-link class="details-link" :to="{ name: 'TaskDetail', params: { id: task.id } }">Details <span aria-hidden="true"></span>→</router-link>
              </div>
            </div>
          </template>
        </draggable>
      </section>

      <section class="column column-progress">
        <div class="column-header">In Progress</div>
        <draggable
          v-model="localProgress"
          group="tasks"
          item-key="id"
          class="column-list"
          @change="e => onDrop(e, dashboardStore.status[1])"
        >
          <template #item="{ element: task }">
            <div class="task-card">
              <h3>{{ task.title }}</h3>
              <div class="card-side">
                <span class="priority-pill" :class="`priority-${task.priority}`">{{ task.priority }}</span>
                <router-link class="details-link" :to="{ name: 'TaskDetail', params: { id: task.id } }">Details <span aria-hidden="true"></span>→</router-link>
              </div>
            </div>
          </template>
        </draggable>
      </section>

      <section class="column column-done">
        <div class="column-header">Completed</div>
        <draggable
          v-model="localDone"
          group="tasks"
          item-key="id"
          class="column-list"
          @change="e => onDrop(e, dashboardStore.status[2])"
        >
          <template #item="{ element: task }">
            <div class="task-card">
              <h3>{{ task.title }}</h3>
              <div class="card-side">
                <span class="priority-pill" :class="`priority-${task.priority}`">{{ task.priority }}</span>
                <router-link class="details-link" :to="{ name: 'TaskDetail', params: { id: task.id } }">Details <span aria-hidden="true"></span>→</router-link>
              </div>
            </div>
          </template>
        </draggable>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem;
}

.dashboard h1 {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--color-ink);
  margin-bottom: 2rem;
}

.upper-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; 
  align-items: start;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.submit-container,
.remove-task-section,
.icon-container {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-seabreeze);
  padding: 1.5rem;
  min-height: clamp(200px, 35vw, 420px);
  max-height: clamp(200px, 35vw, 420px);
  overflow: auto;
}

.icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
}

.status-icon {
  width: 70%;   
  height: 70%;
  object-fit: contain;
  transition: opacity 0.2s ease;
}

.details-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.9rem;
  border-radius: var(--radius-pill);
  background: var(--color-offwhite);
  color: var(--color-odyssey);
  font-weight: 600;
  font-size: 0.8rem;
  text-decoration: none;
  transition: background 0.15s ease, transform 0.1s ease;
  white-space: nowrap;
  align-self: flex-start;
  margin-top: 0.5rem;
  margin-left: 2rem;
}

.details-link:hover {
  background: var(--color-seabreeze);
  transform: translateX(2px);
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.button {
  transition: transform 0.1s ease, box-shadow 0.15s ease;
}
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.button:active {
  transform: translateY(0);
}

.new-task-priority {
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--color-seabreeze);
  font-family: var(--font-body);
  font-size: 0.95rem;
  background: white;
}

.priority-pill {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 0.15rem 0.55rem;
  border-radius: var(--radius-pill);
  color: white;
  margin: 0.35rem 0 0.5rem;
}

.priority-low    { background: var(--color-moss); }
.priority-medium { background: var(--color-sunset); }
.priority-high   { background: var(--color-sangria); }

.column {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.column-header {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.05rem;
  padding: 0.9rem 1.1rem;
  color: var(--color-ink);
  border-radius: 1rem;
}

.column-todo     { background: color-mix(in srgb, var(--color-lagoon) 18%, white); }
.column-todo     .column-header { background: var(--color-lagoon); }

.column-progress { background: color-mix(in srgb, var(--color-sunset) 18%, white); }
.column-progress .column-header { background: var(--color-sunset); }

.column-done     { background: color-mix(in srgb, var(--color-moss) 18%, white); }
.column-done     .column-header { background: var(--color-moss); }

.column-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  min-height: 80px;
  padding: 1rem;
}
.icon-pop {
  animation: pop 0.25s ease;
}
@keyframes pop {
  0%   { transform: scale(0.7); }
  60%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.error-message {
  color: var(--color-sangria);
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: -0.25rem;
  margin-bottom: 0.25rem;
  padding-left: 0.25rem;
}

.remove-task-section {
  display: flex;
  flex-direction: column;
  border-color: color-mix(in srgb, var(--color-sangria) 25%, white);
  background: color-mix(in srgb, var(--color-sangria) 5%, white);
}

.remove-task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.remove-task-header h2 {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  color: var(--color-sangria);
  margin: 0 0 0.25rem;
}

.remove-task-header p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-ink);
  opacity: 0.65;
}

.remove-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-sangria) 12%, white);
  color: var(--color-sangria);
  font-size: 1.3rem;
  font-weight: 700;
}

.remove-task-area {
  flex: 1;
  min-height: 0;
  padding: 0.75rem;
  border: 2px dashed color-mix(in srgb, var(--color-sangria) 35%, white);
  border-radius: 14px;
  background: color-mix(in srgb, var(--color-sangria) 3%, white);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.remove-task-area:hover {
  background: color-mix(in srgb, var(--color-sangria) 8%, white);
  border-color: var(--color-sangria);
}

.remove-placeholder {
  min-height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-sangria);
  opacity: 0.65;
  font-size: 0.85rem;
  font-weight: 600;
}

.remove-task-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 0.9rem;
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-sangria) 25%, white);
  border-radius: 10px;
  color: var(--color-ink);
  font-size: 0.85rem;
  font-weight: 600;
}

.remove-x {
  color: var(--color-sangria);
  font-size: 1.1rem;
  font-weight: 700;
}

.status-icon {
  transition: transform 0.25s ease, opacity 0.2s ease;
}

.task-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 14px;
  padding: 1rem;
  box-shadow: none;
  cursor: grab;
}

.task-card:active {
  cursor: grabbing;
}

.task-card h3 {
  font-family: var(--font-heading);
  font-size: 1rem;
  margin: 0;
  color: var(--color-ink);
}

.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.3s ease;
}
.task-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.task-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.task-form {
  display: flex;
  flex-direction: column;
}

.new-task-title,
.new-task-description {
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--color-seabreeze);
  font-family: var(--font-body);
  font-size: 0.95rem;
  margin-bottom:1rem;
}

.new-task-description {
  min-height: 80px;
  resize: vertical;
  border-radius: 14px;
}

.add-task-btn {
  margin-top: 1.5rem;
  align-self: flex-start;
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

.add-task-btn:hover {
  background: var(--color-moss);
}

.add-task-btn:active {
  transform: scale(0.97);
}
</style>