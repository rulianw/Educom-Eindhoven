import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/DashboardView.vue'
import TaskDetailView from '../views/TaskDetailView.vue'
import DashboardTest from '../views/DashboardViewTest.vue'

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
    },
  { path: '/test', name: 'DashboardTest', component: DashboardTest }, 
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router