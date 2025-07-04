import { mount } from '@vue/test-utils'
import CombinedDonutChart from '@/components/CombinedDonutChart.vue'
import { createStore } from 'vuex'

//  Mock Chart.js to avoid rendering real chart
jest.mock('chart.js/auto', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    destroy: jest.fn()
  }))
}))

describe('CombinedDonutChart.vue', () => {
  let store
  let leadsModule
  let tasksModule

  beforeEach(() => {
    leadsModule = {
      namespaced: true,
      state: () => ({
        leads: [
          { status: 'New' },
          { status: 'Pending' },
          { status: 'In Progress' },
          { status: 'Closed' },
          { status: 'New' }
        ]
      }),
      actions: {
        fetchLeads: jest.fn()
      }
    }

    tasksModule = {
      namespaced: true,
      state: () => ({
        tasks: [
          { status: 'pending' },
          { status: 'done' },
          { status: 'in progress' },
          { status: 'done' }
        ]
      }),
      actions: {
        fetchTasks: jest.fn()
      }
    }

    store = createStore({
      modules: {
        leads: leadsModule,
        tasks: tasksModule
      }
    })
  })

  it('renders the chart container and dispatches fetch actions', async () => {
    const wrapper = mount(CombinedDonutChart, {
      global: {
        plugins: [store]
      },
      attachTo: document.body 
    })

    await new Promise(resolve => setTimeout(resolve, 50))

    const canvas = wrapper.find('#combinedDonutChart')
    expect(canvas.exists()).toBe(true)
    expect(leadsModule.actions.fetchLeads).toHaveBeenCalled()
    expect(tasksModule.actions.fetchTasks).toHaveBeenCalled()
  })
})
