import { mount } from '@vue/test-utils'
import LeadTaskPage from '../../views/LeadTaskPage.vue'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'
import flushPromises from 'flush-promises'
import Swal from 'sweetalert2'
 import { nextTick } from 'vue'
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true }))
}))

const addTaskMock = jest.fn()
const deleteTaskMock = jest.fn()
const fetchTasksMock = jest.fn()

describe('LeadTaskPage.vue', () => {
  let store
  let router

  const createWrapper = async (tasks = []) => {
    const tasksModule = {
      namespaced: true,
      state: () => ({ tasks }),
      actions: {
        fetchTasks: fetchTasksMock,
        addTask: addTaskMock,
        deleteTask: deleteTaskMock
      }
    }

    store = createStore({
      modules: { tasks: tasksModule }
    })

    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/lead-tasks/:id',
          name: 'LeadTaskPage',
          component: LeadTaskPage
        }
      ]
    })

    await router.push({
      name: 'LeadTaskPage',
      params: { id: '1' },
      query: { name: 'Rohan gupta', company: 'SwagEasy', contact: '1234567890' }
    })

    await router.isReady()

    const wrapper = mount(LeadTaskPage, {
      global: {
        plugins: [store, router]
      }
    })

    await flushPromises()
    return wrapper
  }

  it('renders lead name, company, and contact', async () => {
    const wrapper = await createWrapper()
   expect(wrapper.text()).toContain('Tasks for Rohan Gupta') 
    expect(wrapper.text()).toContain('Company: SwagEasy')
    expect(wrapper.text()).toContain('Contact: 1234567890')
  })

  it('shows empty task list message', async () => {
    const wrapper = await createWrapper([])
    expect(wrapper.find('.alert-info').text()).toBe('No tasks yet for this lead.')
  })

  it('renders task in table if present', async () => {
    const tasks = [
      {
        id: 1,
        leadId: '1',
        title: 'Send quotation',
        dueDate: '2025-07-10',
        status: 'Pending'
      }
    ]
    const wrapper = await createWrapper(tasks)
    expect(wrapper.find('table').text()).toContain('Send quotation')
    expect(wrapper.find('table').text()).toContain('2025-07-10')
    expect(wrapper.find('table').text()).toContain('Pending')
  })

  it('adds task with valid data', async () => {
    const wrapper = await createWrapper()

    await wrapper.find('select[name="title"]').setValue('Send proposal email')
    await wrapper.find('input[name="dueDate"]').setValue('2025-07-11')
    await wrapper.find('select[name="status"]').setValue('In Progress')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(addTaskMock).toHaveBeenCalled()
  })

 

it('shows validation errors if form is submitted empty', async () => {
  const wrapper = await createWrapper()

  // Submit the form without input
  await wrapper.find('form').trigger('submit.prevent')

  // Flush VeeValidate async updates
  await flushPromises()
  await nextTick()

  // Wait for DOM updates
  await flushPromises()
  await nextTick()

  const errors = wrapper.findAll('.text-danger')

  // Debug (optional)
  console.log('Errors found:', errors.map(e => e.text()))

  expect(errors.map(e => e.text())).toEqual([
    'Task title is required',
    'Due date is required',
    'Status is required'
  ])
})


  it('confirms delete with SweetAlert', async () => {
    const tasks = [
      {
        id: 2,
        leadId: '1',
        title: 'Follow up',
        dueDate: '2025-07-10',
        status: 'Pending'
      }
    ]
    const wrapper = await createWrapper(tasks)

    await wrapper.find('.btn-danger').trigger('click')
    await flushPromises()

    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Are you sure ?',
      text: 'You want to delete this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })
    
expect(deleteTaskMock).toHaveBeenCalledWith(expect.any(Object), 2)

    expect(Swal.fire).toHaveBeenCalledWith('Deleted!', 'Task has been deleted.', 'success')
  })
})
