import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/DashboardView.vue'
import TaskDetailView from '../views/TaskDetailView.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { 
    path: '/task/:id', 
    name: 'TaskDetail', 
    components: {
      default: Dashboard,
      modal: TaskDetailView,
    },
    props: { modal: true },
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router