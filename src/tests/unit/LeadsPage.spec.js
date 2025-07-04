// tests/unit/LeadsPage.spec.js
import { routes } from '@/router'
import { mount, flushPromises } from '@vue/test-utils'
import LeadsPage from '@/views/LeadsPage.vue'
import { createStore } from 'vuex'
import { createRouter, createWebHashHistory } from 'vue-router'
import Swal from 'sweetalert2'

jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true }))
}))

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const mockLeads = [
  {
    id: '1',
    name: 'Rohan gupta',
    company: 'swageasy',
    contact: '123456',
    budget: '5000',
    status: 'New'
  }
]

const store = createStore({
  modules: {
    leads: {
      namespaced: true,
      state: () => ({
        leads: mockLeads
      }),
      actions: {
        fetchLeads: jest.fn(),
        deleteLead: jest.fn(() => Promise.resolve())
      }
    }
  }
})

describe('LeadsPage.vue', () => {
  it('renders leads and handles delete', async () => {
    router.push('/leads')
    await router.isReady()

    const wrapper = mount(LeadsPage, {
      global: {
        plugins: [store, router]
      }
    })

    expect(wrapper.text()).toContain('Lead Management')
    expect(wrapper.text()).toContain('Rohan gupta')
    expect(wrapper.find('table').exists()).toBe(true)
    const deleteBtn = wrapper.find('button.btn-sm.btn-light')
    await deleteBtn.trigger('click')
    await flushPromises()
    expect(Swal.fire).toHaveBeenCalled()
  })
})
