<template>
 <div class="content px-3 pt-2" style="min-height: 500px;">

    <div class="row">
      <!-- Leads -->
      <div class="col-md-6 col-lg-4 col-12">

        <div class="small-box bg-info">
          <div class="inner">
            <h3>{{ leads.length }}</h3>
            <p>Total Leads</p>

            <div v-if="showLeads" class="small">
              <div>New: {{ leadsByStatus?.New || 0 }}</div>
              <div>Pending: {{ leadsByStatus?.Pending || 0 }}</div>
              <div>In Progress: {{ leadsByStatus?.['In Progress'] || 0 }}</div>
              <div>Closed: {{ leadsByStatus?.Closed || 0 }}</div>
            </div>
          </div>
          <div class="icon">
            <i class="fas fa-user-plus"></i>
          </div>
          <a href="#" @click.prevent="showLeads = !showLeads" class="small-box-footer">
            {{ showLeads ? 'Show Less' : 'More info' }}
            <i :class="showLeads ? 'fas fa-chevron-up' : 'fas fa-arrow-circle-right'"></i>
          </a>
        </div>
      </div>

      <!-- Tasks -->
      <div class="col-md-6 col-lg-4 col-12">

        <div class="small-box bg-warning">
          <div class="inner">
            <h3>{{ tasks.length }}</h3>
            <p>Total Tasks</p>

            <div v-if="showTasks" class="small">
              <div>Pending: {{ tasksByStatus?.Pending || 0 }}</div>
              <div>In Progress: {{ tasksByStatus?.['In Progress'] || 0 }}</div>
              <div>Done: {{ tasksByStatus?.Done || 0 }}</div>
            </div>
          </div>
          <div class="icon">
            <i class="fas fa-tasks"></i>
          </div>
          <a href="#" @click.prevent="showTasks = !showTasks" class="small-box-footer">
            {{ showTasks ? 'Show Less' : 'More info' }}
            <i :class="showTasks ? 'fas fa-chevron-up' : 'fas fa-arrow-circle-right'"></i>
          </a>
        </div>
      </div>

      <!-- Deals -->
      <div class="col-md-6 col-lg-4 col-12">

        <div class="small-box bg-success">
          <div class="inner">
            <h3>{{ tasksByStatus?.Done || 0 }}</h3>
            <p>Total Deals</p>

            <div v-if="showDeals" class="small">
              <div>Deals (Done Tasks): {{ tasksByStatus?.Done || 0 }}</div>
            </div>
          </div>
          <div class="icon">
            <i class="fas fa-handshake"></i>
          </div>
          <a href="#" @click.prevent="showDeals = !showDeals" class="small-box-footer">
            {{ showDeals ? 'Show Less' : 'More info' }}
            <i :class="showDeals ? 'fas fa-chevron-up' : 'fas fa-arrow-circle-right'"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="row">
    <div class="col-md-12">
      <CombinedDonutChart />
    </div>
    <div class="col-md-12">
      <LeadTaskTable />
    </div>
  </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import CombinedDonutChart from '../components/CombinedDonutChart.vue'
import LeadTaskTable from '@/components/LeadTaskTable.vue'
const store = useStore()

const showLeads = ref(false)
const showTasks = ref(false)
const showDeals = ref(false)

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

onMounted(() => {
  store.dispatch('leads/fetchLeads')
  store.dispatch('tasks/fetchTasks')
})
</script>
