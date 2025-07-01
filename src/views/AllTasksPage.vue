<template>
  <div class="content-wrapper px-3 py-3">
    <section class="content-header mb-4">
      <h3><i class="fas fa-tasks"></i> All Tasks</h3>
    </section>

    <div class="card">
      <div class="card-body p-0">
        <div v-if="tasks.length" class="table-responsive">
          <table class="table table-bordered table-hover table-striped mb-0">
            <thead class="table-dark">
              <tr>
                <th>Task</th>
                <th>Lead ID</th>
                <th>Due Date</th>
                <th>Status</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in tasks" :key="task.id">
                <td>{{ task.title }}</td>
                <td>{{ task.leadId }}</td>
                <td>{{ task.dueDate }}</td>
                <td>
                 <span
  :class="[
    'badge',
    task.status === 'Pending' ? 'bg-warning' :
    task.status === 'In Progress' ? 'bg-primary' :
    task.status === 'Done' ? 'bg-success' :
    'bg-secondary'
  ]" >
  {{ task.status }}
</span>
 </td>
<td class="text-center">
<button @click="confirmDelete(task.id)" class="btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="p-3">
          <div class="alert alert-info mb-0 text-center">No tasks available.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import Swal from 'sweetalert2'

const store = useStore()

onMounted(() => {
  store.dispatch('tasks/fetchTasks')
})

const tasks = computed(() => store.state.tasks.tasks)

async function confirmDelete(taskId) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This task will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  })

  if (result.isConfirmed) {
    try {
      await store.dispatch('tasks/deleteTask', taskId)
      Swal.fire('Deleted!', 'Task has been deleted.', 'success')
    } catch (error) {
      Swal.fire('Error', 'Failed to delete the task.', 'error')
    }
  }
}

</script>
