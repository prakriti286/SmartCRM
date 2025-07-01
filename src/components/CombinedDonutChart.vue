<template>
  <div class="card">
    <div class="card-header bg-primary text-white">
      <h3 class="card-title">Lead & Task Status Distribution</h3>
    </div>
    <div class="card-body">
      <canvas id="combinedDonutChart" style="min-height: 300px; height: 300px;"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import Chart from 'chart.js/auto'

const store = useStore()

const leads = computed(() => store.state.leads.leads || [])
const tasks = computed(() => store.state.tasks.tasks || [])

const leadsByStatus = computed(() =>
  leads.value.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1
    return acc
  }, {})
)

const tasksByStatus = computed(() =>
  tasks.value.reduce((acc, task) => {
    const status = task.status?.trim().toLowerCase()
    if (status === 'pending') acc['Pending'] = (acc['Pending'] || 0) + 1
    else if (status === 'in progress') acc['In Progress'] = (acc['In Progress'] || 0) + 1
    else if (status === 'done') acc['Done'] = (acc['Done'] || 0) + 1
    return acc
  }, {})
)

onMounted(async () => {
  await store.dispatch('leads/fetchLeads')
  await store.dispatch('tasks/fetchTasks')

  await nextTick() 

  const canvas = document.getElementById('combinedDonutChart')
  if (!canvas) {
    console.warn('Canvas not found!')
    return
  }

  const ctx = canvas.getContext('2d')

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['New','Pending', 'In Progress', 'Closed'],
      datasets: [
        {
          label: 'Leads',
          data: [
            leadsByStatus.value['Pending'] || 0,
            leadsByStatus.value['In Progress'] || 0,
            leadsByStatus.value['Closed'] || 0,
            leadsByStatus.value['New'] || 0
          ],
          backgroundColor: ['#f39c12','#dd4b39', '#00c0ef', '#00a65a'],
          borderWidth: 1
        },
        {
          label: 'Tasks',
          data: [
            tasksByStatus.value['Pending'] || 0,
            tasksByStatus.value['In Progress'] || 0,
            tasksByStatus.value['Done'] || 0
          ],
          backgroundColor: ['#ffc107', '#17a2b8', '#28a745'],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`
            }
          }
        }
      }
    }
  })
})
</script>
