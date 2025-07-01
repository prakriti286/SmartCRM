<template>
  <div class="card">
    <div class="card-header bg-info text-white">
      <h3 class="card-title">Recent Leads & Tasks</h3>
    </div>
    <div class="card-body table-responsive p-0">
      <table class="table table-hover text-nowrap">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Task Title</th>
            <th>Due Date</th>
            <th>Task Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in combinedData" :key="item.taskId">
            <td>{{ item.leadName }}</td>
            <td>{{ item.company }}</td>
            <td>{{ item.taskTitle }}</td>
            <td>{{ item.dueDate }}</td>
            <td>
              <span :class="['badge', getStatusBadge(item.status)]">{{ item.status }}</span>
            </td>
          </tr>
          <tr v-if="combinedData.length === 0">
            <td colspan="5" class="text-center">No data available</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(() => {
  store.dispatch('leads/fetchLeads')
  store.dispatch('tasks/fetchTasks')
})

const leads = computed(() => store.state.leads.leads || [])
const tasks = computed(() => store.state.tasks.tasks || [])

// Combine task and lead info by leadId
const combinedData = computed(() => {
  return tasks.value.map(task => {
    const lead = leads.value.find(lead => lead.id === task.leadId) || {}
    return {
      taskId: task.id,
      leadName: lead.name || 'Unknown',
      company: lead.company || 'Unknown',
      taskTitle: task.title || '-',
      dueDate: task.dueDate || '-',
     status: task.status || '-'
    }
  })
})


const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'badge-warning'
    case 'in progress':
      return 'badge-info'
    case 'done':
      return 'badge-success'
    case 'closed':
      return 'badge-secondary'
    default:
      return 'badge-light'
  }
}
</script>
