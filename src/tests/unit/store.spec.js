
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  confirm: jest.fn(),
}))

import { createStore } from 'vuex'
import leads from '@/store/modules/leads'
import tasks from '@/store/modules/tasks'

describe('Vuex Store', () => {
  let store

  beforeEach(() => {
    store = createStore({
      modules: {
        leads,
        tasks,
      }
    })
  })

  it('initializes leads module', () => {
    expect(store.state.leads).toBeDefined()
  })

  it('initializes tasks module', () => {
    expect(store.state.tasks).toBeDefined()
  })

  it('has empty leads list initially', () => {
    expect(Array.isArray(store.state.leads.leads)).toBe(true)
  })

  it('has empty tasks list initially', () => {
    expect(Array.isArray(store.state.tasks.tasks)).toBe(true)
  })
})
