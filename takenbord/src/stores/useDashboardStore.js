import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {

    //states
    const STORAGE_KEY = "kanban-tasks";

    const tasks = ref([
        { id: 1, title: 'Fix login redirect bug', status: 'In Progress', priority: 'high', description: 'Users are landing on a 404 after logging in via SSO instead of the dashboard. Likely a broken redirect URL in the auth callback.' },
        { id: 2, title: 'Write onboarding docs', status: 'To Do', priority: 'medium', description: 'Draft a short getting-started guide for new trainees covering repo setup, branch naming, and the review process.' },
        { id: 3, title: 'Update dependency versions', status: 'Completed', priority: 'low', description: 'Bumped Vue, Vite, and Pinia to their latest minor versions and verified nothing broke.' },
        { id: 4, title: 'Design task priority badges', status: 'In Progress', priority: 'medium', description: 'Create a small color-coded pill component to show low/medium/high priority on task cards.' },
        { id: 5, title: 'Set up CI pipeline', status: 'To Do', priority: 'high', description: 'Configure GitHub Actions to run lint and build checks on every pull request before merge.' },
        { id: 6, title: 'Review PR #42', status: 'To Do', priority: 'low', description: 'Check the new dropdown component refactor for accessibility and prop naming consistency.' },
        { id: 7, title: 'Fix mobile layout overflow', status: 'Completed', priority: 'high', description: 'Task cards were overflowing their columns on narrow viewports. Added responsive breakpoints to the board grid.' },
        { id: 8, title: 'Add drag-and-drop tests', status: 'In Progress', priority: 'low', description: 'Write basic tests confirming a task\'s status updates correctly after being dropped into a new column.' },
    ])

    

    //getters
    const todoTasks = computed(() => tasks.value.filter(t => t.status === 'To Do'))
    const progressTasks = computed(() => tasks.value.filter(t => t.status === 'In Progress'))
    const doneTasks = computed(() => tasks.value.filter(t => t.status === 'Completed'))

    //actions
    

    function changeStatus(taskId, newStatus) {
        const task = tasks.value.find(t => t.id === taskId)
        if (task) task.status = newStatus
    }

    function addTask(taskData) {
        if (taskData.title.length < 5) return 'Title must be at least 5 characters long.'
        const newTask = {
            id: tasks.value.length ? Math.max(...tasks.value.map(t => t.id)) + 1 : 1,
            title: taskData.title,
            status: 'To Do',
            priority: taskData.priority,
            description: taskData.description
        }
        tasks.value.push(newTask)
    }

    function removeTask(taskId) {
        const index = tasks.value.findIndex(t => t.id === taskId)
        if (index !== -1) {
            tasks.value.splice(index, 1)
        }
    }

    return { tasks, todoTasks, progressTasks, doneTasks, changeStatus, addTask, removeTask }
})