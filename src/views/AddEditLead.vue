<template>
  <div class="content-wrapper px-3 py-3">
    <section class="content-header mb-3">
      <h1>
        <i class="fas fa-user-edit"></i> {{ isEditMode ? 'Edit Lead' : 'Add Lead' }}
      </h1>
    </section>

    <div class="card">
      <div class="card-header bg-info text-white">
        <h3 class="card-title">
          <i class="fas fa-address-card"></i> Lead Details
        </h3>
      </div>

      <div class="card-body">
      <div class="row justify-content-center">
    <div class="col-md-10">
        <form v-if="formReady" @submit.prevent="submitForm" class="form-horizontal">
          <div class="row">

            <div class="form-group col-md-6">
              <label for="name">Name</label>
              <input id="name" type="text" class="form-control" v-model="nameValue" :class="{ 'is-invalid': nameError }" />
              <div class="invalid-feedback">{{ nameError }}</div>
            </div>

            <div class="form-group col-md-6">
              <label for="company">Company</label>
              <input id="company" type="text" class="form-control" v-model="companyValue" :class="{ 'is-invalid': companyError }" />
                 <div class="invalid-feedback">{{ companyError }}</div>
            </div>
 
            <div class="form-group col-md-6">
              <label for="contact">Contact</label>
              <input id="contact" type="text" class="form-control" v-model="contactValue" :class="{ 'is-invalid': contactError }"/> 
              <div class="invalid-feedback">{{ contactError }}</div>
            </div>

            <div class="form-group col-md-6">
              <label for="budget">Budget</label>
              <input  id="budget"  type="text" class="form-control" v-model="budgetValue" :class="{ 'is-invalid': budgetError }"/>
               <div class="invalid-feedback">{{ budgetError }}</div>
            </div>

            <!-- Status -->
            <div class="form-group col-md-6">
              <label for="status">Status</label>
              <select id="status" class="form-control"  v-model="statusValue" :class="{ 'is-invalid': statusError }">
                <option disabled value="">Select Status</option>
                <option>New</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Closed</option>
              </select>
              <div class="invalid-feedback">{{ statusError }}</div>
            </div>
          </div>

          <!--Button -->
          <div class="form-group col-12 text-right mt-2">
            <button type="submit" class="btn btn-success"> <i class="fas fa-save"></i> {{ isEditMode ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const store = useStore()
const route = useRoute()
const router = useRouter()
const leadId = route.params.id
const isEditMode = ref(!!leadId)
const formReady = ref(false)

// Schema for validation
const schema = yup.object({
  name: yup.string().required('Name is required'),
  company: yup.string().required('Company is required'),
  contact: yup
    .string()
    .required('Contact is required')
    .matches(/^[0-9]{10}$/, 'Contact must be a 10-digit number'),
  budget: yup
    .string()
    .required('Budget is required')
    .matches(/^\d+$/, 'Budget must be digits only'),
  status: yup.string().required('Status is required'),
})

// useForm and fields
const { handleSubmit, setValues } = useForm({ validationSchema: schema })

const { value: nameValue, errorMessage: nameError } = useField('name')
const { value: companyValue, errorMessage: companyError } = useField('company')
const { value: contactValue, errorMessage: contactError } = useField('contact')
const { value: budgetValue, errorMessage: budgetError } = useField('budget')
const { value: statusValue, errorMessage: statusError } = useField('status')


const onSubmit = async (values) => {
  try {
    if (isEditMode.value) {
      await store.dispatch('leads/updateLead', { ...values, id: leadId })
      await Swal.fire('Updated!', 'Lead updated successfully.', 'success')
    } else {
      await store.dispatch('leads/addLead', values)
      await Swal.fire('Saved!', 'Lead added successfully.', 'success')
    }
    router.push('/leads')
  } catch (err) {
    console.error('Submission error:', err)
    await Swal.fire('Error', 'Something went wrong. Try again.', 'error')
  }
}

const onInvalid = () => {
  Swal.fire({
    icon: 'warning',
    title: 'Validation Error',
    text: 'Please fix the highlighted errors.',
  })
}

const submitForm = handleSubmit(onSubmit, onInvalid)

// If in edit mode, load lead data
onMounted(async () => {
  if (isEditMode.value) {
    try {
      await store.dispatch('leads/fetchLeads')
      const lead = store.state.leads.leads.find(l => l.id === leadId)
      if (lead) {
        setValues(lead)
      } else {
        Swal.fire('Error', 'Lead not found', 'error')
      }
    } catch (err) {
      console.error('Error loading lead:', err)
      Swal.fire('Error', 'Failed to load lead data.', 'error')
    }
  }
  formReady.value = true
})
</script>

<style scoped>
.card-header {
  font-weight: bold;
}
.is-invalid {
  border-color: #dc3545;
}
</style>
