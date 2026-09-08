<script setup>
import { useDashboardStore } from '../stores/useDashboardStore.js'
import { storeToRefs } from 'pinia'

const dashboardStore = useDashboardStore()
const { changeStatus } = dashboardStore
const { tasks } = storeToRefs(dashboardStore)
</script>

<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <ul>
      <li v-for="task in tasks" :key="task.id">

        <div v-if="task.status === 'To Do'" class="to-do">
          <h1>To Do</h1>
        </div>
        <div v-else-if="task.status === 'In Progress'" class="in-progress">
          <h1>In Progress</h1>
        </div>
        <div v-else-if="task.status === 'Completed'" class="completed">
          <h1>Completed</h1>
        </div>

        <h2>{{ task.title }}</h2>
        <div class="task-status">
          <b-dropdown id="dropdown-status" text="Change status" class="m-md-2">
            <b-dropdown-item @click="changeStatus(task.id, 'In Progress')">In Progress</b-dropdown-item>
            <b-dropdown-item @click="changeStatus(task.id, 'To Do')">To Do</b-dropdown-item>
            <b-dropdown-item @click="changeStatus(task.id, 'Completed')">Completed</b-dropdown-item>
          </b-dropdown>
        </div>
        <router-link :to="{ name: 'TaskDetail', params: { id: task.id } }">View Details</router-link>

      </li>
    </ul>
  </div>
</template>

<style>
</style>