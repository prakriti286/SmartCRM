import { mount, flushPromises } from '@vue/test-utils'
import { createStore } from 'vuex'
import LeadDashboard from '@/views/LeadDashboard.vue'


jest.mock('@/components/CombinedDonutChart.vue', () => ({
  template: '<div class="donut-chart-mock" />'
}))
jest.mock('@/components/LeadTaskTable.vue', () => ({
  template: '<div class="task-table-mock" />'
}))

const mockLeads = [
  { id: '1', status: 'New' },
  { id: '2', status: 'Pending' },
  { id: '3', status: 'In Progress' },
  { id: '4', status: 'Closed' }
]

const mockTasks = [
  { id: '1', status: 'Pending' },
  { id: '2', status: 'In Progress' },
  { id: '3', status: 'Done' },
  { id: '4', status: 'Done' }
]

const store = createStore({
  modules: {
    leads: {
      namespaced: true,
      state: () => ({ leads: mockLeads }),
      actions: {
        fetchLeads: jest.fn()
      }
    },
    tasks: {
      namespaced: true,
      state: () => ({ tasks: mockTasks }),
      actions: {
        fetchTasks: jest.fn()
      }
    }
  }
})

describe('LeadDashboard.vue', () => {
  it('renders lead and task summary correctly', async () => {
    const wrapper = mount(LeadDashboard, {
      global: {
        plugins: [store]
      }
    })

    await flushPromises()
    expect(wrapper.text()).toContain('Total Leads')
    expect(wrapper.text()).toContain('4')
    expect(wrapper.text()).toContain('Total Tasks')
    expect(wrapper.text()).toContain('4')
    expect(wrapper.text()).toContain('Total Deals')
    expect(wrapper.text()).toContain('2')

    await wrapper.findAll('.small-box-footer')[0].trigger('click')
    expect(wrapper.html()).toContain('New: 1')
    expect(wrapper.html()).toContain('Pending: 1')
    expect(wrapper.html()).toContain('In Progress: 1')
    expect(wrapper.html()).toContain('Closed: 1')

    await wrapper.findAll('.small-box-footer')[1].trigger('click')
    expect(wrapper.html()).toContain('Done: 2')

    await wrapper.findAll('.small-box-footer')[2].trigger('click')
    expect(wrapper.html()).toContain('Deals (Done Tasks): 2')
  })
})
