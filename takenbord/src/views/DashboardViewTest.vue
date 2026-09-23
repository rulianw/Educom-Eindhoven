<script setup>
import draggable from 'vuedraggable'
import { useDashboardStore } from '../stores/useDashboardStore.js'
import { ref, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import iconNeutral from '../img/icon-neutral.png'
import iconTodo from '../img/icon-todo.png'
import iconInProgress from '../img/icon-in-progress.png'
import iconDone from '../img/icon-done.png'
import BarChart from '../components/BarChart.vue'

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
let popTimer = null

function iconForStatus(status) {
  return {
    'To Do': iconTodo,
    'In Progress': iconInProgress,
    'Completed': iconDone,
  }[status] || iconNeutral
}

function flashIcon(status) {
  currentIcon.value = iconForStatus(status)
  iconPop.value = false

  requestAnimationFrame(() => {
    iconPop.value = true

    if (popTimer) clearTimeout(popTimer)

    popTimer = setTimeout(() => {
      iconPop.value = false
      popTimer = null
    }, 250)
  })

  if (hideTimer) clearTimeout(hideTimer)

  hideTimer = setTimeout(() => {
    currentIcon.value = iconNeutral
    hideTimer = null
  }, 4000)
}


onUnmounted(() => {
  if (hideTimer) clearTimeout(hideTimer)
  if (popTimer) clearTimeout(popTimer)
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

  <section class="section">
    <div class="container is-fluid">
      <h1 class="title is-2 has-text-weight-bold mb-6">
        Kanban Board
      </h1>

      <div class="columns is-variable is-6 mb-6">

        <div class="column is-one-third">

          <div class="box upper-box">

            <form @submit.prevent="submitTask">

              <h2 class="title is-5 mb-5">
                Add New Task
              </h2>

              <div class="field">
                <label class="label">Title</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="newTaskTitle"
                    placeholder="New task title"
                    required
                    @blur="titleTouched = true"
                  />
                </div>
              </div>

              <p
                v-if="titleTouched && newTaskTitle.length < 5"
                class="help is-danger mb-4"
              >
                Title must be at least 5 characters long.
              </p>

              <div class="field">
                <label class="label">Description</label>
                <div class="control">
                  <textarea
                    class="textarea"
                    v-model="newTaskDescription"
                    placeholder="New task description"
                    required
                  ></textarea>
                </div>
              </div>

              <div class="field">
                <label class="label">Priority</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="newTaskPriority" required>
                      <option value="" disabled>Select priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="field mt-5">
                <div class="control">
                  <button
                    type="submit"
                    class="button is-warning is-rounded has-text-weight-bold"
                  >
                    Add Task
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>

        <div class="column is-one-third">
          <section class="box upper-box remove-box">

            <div class="level mb-4">
              <div class="level-left">
                <h2 class="title is-5 has-text-danger mb-1">
                  Remove Task
                </h2>
              </div>
              <div class="level-right">
                <!-- ".tag" reused here as a small circular badge, not a status label -->
                <span class="tag is-danger is-light is-rounded remove-icon">×</span>
              </div>
            </div>

            <draggable
              v-model="trashZone"
              group="tasks"
              item-key="id"
              class="remove-task-area"
              @change="onRemoveDrop"
            >
              <template #item="{ element: task }">
                <div class="box remove-task-card">
                  <div class="is-flex is-justify-content-space-between is-align-items-center">
                    <span class="has-text-weight-semibold">{{ task.title }}</span>
                    <span class="has-text-danger has-text-weight-bold">×</span>
                  </div>
                </div>
              </template>

              <template #footer>
                <div class="remove-placeholder">
                  Drop a task here to remove it
                </div>
              </template>
            </draggable>

          </section>
        </div>

        <div class="column is-one-third">
          <div class="box upper-box icon-box is-flex is-align-items-center is-justify-content-center">
            <figure class="image is-256x256">
              <img
                :src="currentIcon"
                alt="Current task status"
                class="status-icon"
                :class="{ 'icon-pop': iconPop }"
              />
            </figure>
          </div>
        </div>

      </div>

      <div class="columns is-variable is-5">

        <section class="column">
          <div class="card kanban-column column-todo">
            <header class="card-header column-header">
              <p class="card-header-title">To Do</p>
            </header>

            <draggable
              v-model="localTodo"
              group="tasks"
              item-key="id"
              class="card-content column-list"
              @change="e => onDrop(e, dashboardStore.status[0])"
            >
              <template #item="{ element: task }">
                <div class="card task-card mb-4">
                  <div class="card-content">
                    <h3 class="title is-6 mb-4">{{ task.title }}</h3>
                    <div class="is-flex is-justify-content-space-between is-align-items-center">
                      <!--
                        ":class" here is a DYNAMIC CLASS OBJECT — Vue adds
                        whichever key evaluates true. Bulma's color modifiers
                        (is-success/is-warning/is-danger) map directly onto
                        your low/medium/high priority levels.
                      -->
                      <span
                        class="tag is-rounded is-small"
                        :class="{
                          'is-success': task.priority === 'low',
                          'is-warning': task.priority === 'medium',
                          'is-danger': task.priority === 'high'
                        }"
                      >
                        {{ task.priority }}
                      </span>
                      <router-link
                        class="button is-small is-light is-rounded"
                        :to="{ name: 'TaskDetail', params: { id: task.id } }"
                      >
                        Details →
                      </router-link>
                    </div>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </section>

        <section class="column">
          <div class="card kanban-column column-progress">
            <header class="card-header column-header">
              <p class="card-header-title">In Progress</p>
            </header>
            <draggable
              v-model="localProgress"
              group="tasks"
              item-key="id"
              class="card-content column-list"
              @change="e => onDrop(e, dashboardStore.status[1])"
            >
              <template #item="{ element: task }">
                <div class="card task-card mb-4">
                  <div class="card-content">
                    <h3 class="title is-6 mb-4">{{ task.title }}</h3>
                    <div class="is-flex is-justify-content-space-between is-align-items-center">
                      <span
                        class="tag is-rounded is-small"
                        :class="{
                          'is-success': task.priority === 'low',
                          'is-warning': task.priority === 'medium',
                          'is-danger': task.priority === 'high'
                        }"
                      >
                        {{ task.priority }}
                      </span>
                      <router-link
                        class="button is-small is-light is-rounded"
                        :to="{ name: 'TaskDetail', params: { id: task.id } }"
                      >
                        Details →
                      </router-link>
                    </div>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </section>

        <section class="column">
          <div class="card kanban-column column-done">
            <header class="card-header column-header">
              <p class="card-header-title">Completed</p>
            </header>
            <draggable
              v-model="localDone"
              group="tasks"
              item-key="id"
              class="card-content column-list"
              @change="e => onDrop(e, dashboardStore.status[2])"
            >
              <template #item="{ element: task }">
                <div class="card task-card mb-4">
                  <div class="card-content">
                    <h3 class="title is-6 mb-4">{{ task.title }}</h3>
                    <div class="is-flex is-justify-content-space-between is-align-items-center">
                      <span
                        class="tag is-rounded is-small"
                        :class="{
                          'is-success': task.priority === 'low',
                          'is-warning': task.priority === 'medium',
                          'is-danger': task.priority === 'high'
                        }"
                      >
                        {{ task.priority }}
                      </span>
                      <router-link
                        class="button is-small is-light is-rounded"
                        :to="{ name: 'TaskDetail', params: { id: task.id } }"
                      >
                        Details →
                      </router-link>
                    </div>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </section>

      </div>

    </div>
  </section>
</template>

<style scoped>
.upper-box {
  min-height: clamp(200px, 35vw, 420px);
  max-height: clamp(200px, 35vw, 420px);
  overflow: auto;
}

.status-icon {
  object-fit: contain;
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.icon-pop {
  animation: pop 0.25s ease;
}
@keyframes pop {
  0%   { transform: scale(0.7); }
  60%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.remove-box {
  border: 1px solid color-mix(in srgb, var(--color-sangria) 25%, white);
  background: color-mix(in srgb, var(--color-sangria) 5%, white);
}

.remove-task-area {
  min-height: 180px;
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
  text-align: center;
}
.remove-task-card {
  padding: 0.7rem 0.9rem;
  border: 1px solid color-mix(in srgb, var(--color-sangria) 25%, white);
  border-radius: 10px;
  color: var(--color-ink);
  font-size: 0.85rem;
}

.kanban-column {
  overflow: hidden;
  border-radius: var(--radius-lg);
}
.column-todo { background: color-mix(in srgb, var(--color-lagoon) 18%, white); }
.column-todo .column-header { background: var(--color-lagoon); }

.column-progress { background: color-mix(in srgb, var(--color-sunset) 18%, white); }
.column-progress .column-header { background: var(--color-sunset); }

.column-done { background: color-mix(in srgb, var(--color-moss) 18%, white); }
.column-done .column-header { background: var(--color-moss); }

.status-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.25s ease, opacity 0.2s ease;
}

.task-card {
  cursor: grab;
}
.task-card:active {
  cursor: grabbing;
}

.remove-icon {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
}

.column-list {
  min-height: 80px;
}

.icon-box {
  background: white;
}

@media screen and (max-width: 768px) {
  .upper-box {
    min-height: 220px;
    max-height: none;
  }
}
</style>