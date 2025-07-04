import { mount, flushPromises } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createRouter, createWebHashHistory } from 'vue-router'
import AllTasksPage from '@/views/AllTasksPage.vue'
import Swal from 'sweetalert2'


jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true }))
}))

describe('AllTasksPage.vue', () => {
  let store, router

  const mockTasks = [
    {
      id: '1',
      title: 'Follow up after demo',
      leadId: '123',
      dueDate: '2025-07-05',
      status: 'Pending'
    }
  ]

  beforeEach(async () => {
    store = createStore({
      modules: {
        tasks: {
          namespaced: true,
          state: () => ({
            tasks: mockTasks
          }),
          actions: {
            fetchTasks: jest.fn(),
            deleteTask: jest.fn()
          }
        }
      }
    })

    router = createRouter({
      history: createWebHashHistory(),
      routes: [{ path: '/tasks', component: AllTasksPage }]
    })

    await router.push('/tasks')
    await router.isReady()
  })

  it('renders tasks table when tasks exist', async () => {
    const wrapper = mount(AllTasksPage, {
      global: {
        plugins: [store, router]
      }
    })

    expect(wrapper.text()).toContain('All Tasks')
    expect(wrapper.text()).toContain('Follow up after demo')
    expect(wrapper.find('table').exists()).toBe(true)
  })

  it('shows alert when no tasks are available', async () => {
    store.state.tasks.tasks = [] 
    const wrapper = mount(AllTasksPage, {
      global: {
        plugins: [store, router]
      }
    })

    expect(wrapper.text()).toContain('No tasks available.')
  })

  it('calls SweetAlert and dispatches deleteTask on confirm', async () => {
    const wrapper = mount(AllTasksPage, {
      global: {
        plugins: [store, router]
      }
    })

    const deleteBtn = wrapper.find('button.btn-danger')
    await deleteBtn.trigger('click')
    await flushPromises()

    expect(Swal.fire).toHaveBeenCalled()
    expect(store._modules.root._children.tasks._rawModule.actions.deleteTask).toBeDefined()
  })
})

