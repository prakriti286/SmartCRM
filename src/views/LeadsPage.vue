<template>
  <div class="content-wrapper px-3 py-3">
    <section class="content-header mb-4 d-flex justify-content-between align-items-center">
      <h3><i class="fas fa-address-book"></i> Lead Management</h3>
      <router-link class="btn btn-primary" to="/addlead"> <i class="fas fa-plus-circle"></i> Add Lead
      </router-link>
    </section>

    <div v-if="leads.length" class="card">
      <div class="card-body table-responsive p-0">
        <table class="table table-bordered table-hover table-striped mb-0">
          <thead class="table-dark">
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Budget</th>
              <th>Status</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in leads" :key="lead.id">
              <td>{{ lead.name }}</td>
              <td>{{ lead.company }}</td>
              <td>{{ lead.contact }}</td>
              <td>{{ lead.budget }}</td>
              <td>{{ lead.status }}</td>
              <td class="text-center">
                <router-link :to="{ path: `/lead/${lead.id}/tasks`, query: {
                    name: lead.name,
                    company: lead.company,
                    contact: lead.contact
                  }}"
                  class="btn btn-sm btn-info me-2"><i class="fas fa-tasks"></i>
                </router-link>
                <router-link :to="`/editlead/${lead.id}`" class="btn btn-sm btn-warning me-2">
<i class="fas fa-edit"></i>
                </router-link>
                <button @click="removeLead(lead.id)" class="btn btn-sm btn-danger">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="alert alert-info mt-4 text-center">
      No leads available.
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

import Swal from 'sweetalert2'

const store = useStore()
const route = useRoute()
const leads = computed(() => store.state.leads.leads)



onMounted(() => {
  store.dispatch('leads/fetchLeads')
})
watch(
  () => route.fullPath,
  () => {
    store.dispatch('leads/fetchLeads')
  }
)
const removeLead = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You want to delete this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  })

  if (result.isConfirmed) {
    try {
      await store.dispatch('leads/deleteLead', id)
      await store.dispatch('leads/fetchLeads')
      Swal.fire('Deleted!', 'Lead has been deleted.', 'success')
    } catch (error) {
      Swal.fire('Error', 'Failed to delete lead.', 'error')
    }
  }
}


</script>
