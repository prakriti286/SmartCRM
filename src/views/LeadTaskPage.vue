<template>
  <div class="content-wrapper px-3 py-3">
    <section class="content-header mb-4">
      <h3><i class="fas fa-tasks"></i> Tasks for {{ leadName }}</h3>
      <h6 class="text-muted">Company: {{ company }} | Contact: {{ contact }}</h6>
    </section>

    <!-- Add Task Form -->
    <div class="card mb-4">
      <div class="card-header bg-success text-white">
        <h5 class="card-title mb-0"><i class="fas fa-plus-circle"></i> Add New Task</h5>
      </div>
      <div class="card-body">
        <Form @submit="onSubmit" :validation-schema="taskSchema">
          <div class="row g-3 align-items-end">
            <div class="col-md-4">
              <label class="form-label">Task</label>
              <Field name="title" as="select" class="form-select">
                <option value="">Select Task</option>
                <option value="Follow up after demo">Follow up after demo</option>
                <option value="Schedule Zoom meeting">Schedule Zoom meeting</option>
                <option value="Call client for feedback">Call client for feedback</option>
                <option value="Send quotation">Send quotation</option>
                <option value="Send proposal email">Send proposal email</option>
                <option value="In-person meeting with lead">In-person meeting with lead</option>
                <option value="Send contract for signature">Send contract for signature</option>
                <option value="Close lead as won">Close lead as won</option>
              </Field>
              <ErrorMessage name="title" class="text-danger small" />
            </div>

            <div class="col-md-3">
              <label class="form-label">Due Date</label>
              <Field name="dueDate" type="date" class="form-control" />
              <ErrorMessage name="dueDate" class="text-danger small" />
            </div>

            <div class="col-md-3">
              <label class="form-label">Status</label>
              <Field name="status" as="select" class="form-select">
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </Field>
              <ErrorMessage name="status" class="text-danger small" />
            </div>

            <div class="col-md-2">
              <button type="submit" class="btn btn-success w-100">
                <i class="fas fa-plus"></i> Add
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>

    <!-- Task List -->
    <div class="card">
      <div class="card-header bg-info text-white">
        <h5 class="card-title mb-0"><i class="fas fa-list"></i> Task List</h5>
      </div>
      <div class="card-body p-0">
        <div v-if="leadTasks.length" class="table-responsive">
          <table class="table table-bordered table-hover table-striped mb-0">
            <thead class="table-dark">
              <tr>
                <th>Title</th>
                <th>Lead ID</th>
                <th>Due Date</th>
                <th>Status</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in leadTasks" :key="task.id">
                <td>{{ task.title }}</td>
                <td>{{ task.leadId }}</td>
                <td>{{ task.dueDate }}</td>
                <td>{{ task.status }}</td>
                <td class="text-center">
                  <button @click="confirmDelete(task.id)" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="p-3">
          <div class="alert alert-info mb-0">No tasks yet for this lead.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { computed, onMounted } from 'vue'
import Swal from 'sweetalert2'

const store = useStore()
const route = useRoute()
const leadId = route.params.id


const leadName = computed(() =>
  (route.query.name || '')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
)
const company = computed(() => route.query.company || '')
const contact = computed(() => route.query.contact || '')

// Fetch tasks on load
onMounted(() => {
  store.dispatch('tasks/fetchTasks')
})


const taskSchema = yup.object({
  title: yup.string().required('Task title is required'),
  dueDate: yup.string().required('Due date is required'),
  status: yup.string().required('Status is required')
})


const leadTasks = computed(() =>
  store.state.tasks.tasks
    .filter(t => String(t.leadId) === String(leadId))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
)

// Add Task
function onSubmit(values, { resetForm }) {
  const newTask = { ...values, leadId }
  store.dispatch('tasks/addTask', newTask)
  resetForm()
}


function confirmDelete(taskId) {
  Swal.fire({
    title: 'Are you sure ?',
    text: 'You want to delete this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then(result => {
    if (result.isConfirmed) {
      store.dispatch('tasks/deleteTask', taskId)
      Swal.fire('Deleted!', 'Task has been deleted.', 'success')
    }
  })
}
</script>
