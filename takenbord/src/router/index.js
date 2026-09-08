import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/DashboardView.vue'
import TaskDetailView from '../components/TaskDetailView.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/task/:id', name: 'TaskDetail', component: TaskDetailView, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router