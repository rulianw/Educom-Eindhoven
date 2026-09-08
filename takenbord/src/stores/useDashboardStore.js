import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {

    //states
    const tasks = ref([
    { id: 1, title: 'Task 1', status: 'In Progress', description: 'This is the description for Task 1.' },
    { id: 2, title: 'Task 2', status: 'To Do', description: 'This is the description for Task 2.' },
    { id: 3, title: 'Task 3', status: 'Completed', description: 'This is the description for Task 3.' },
    { id: 4, title: 'Task 4', status: 'In Progress', description: 'This is the description for Task 4.' },
    { id: 5, title: 'Task 5', status: 'To Do', description: 'This is the description for Task 5.' },
    ]);

    //actions
    function changeStatus(taskId, newStatus) {
        const task = tasks.value.find(t => t.id === taskId)
        if (task) task.status = newStatus
    }

    return { tasks, changeStatus }
})