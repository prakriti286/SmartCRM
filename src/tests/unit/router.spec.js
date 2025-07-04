import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from '@/router'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

// Dummy layout
const RouterTestWrapper = defineComponent({
  template: '<router-view />'
})

describe('Vue Router', () => {
  let router

  beforeEach(() => {
    router = createRouter({
      history: createWebHashHistory(),
      routes
    })
  })

  it('redirects / to /dashboard', async () => {
    router.push('/')
    await router.isReady()
    expect(router.currentRoute.value.fullPath).toBe('/dashboard')
  })

  it('navigates to /leads and renders LeadsPage', async () => {
    router.push('/leads')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('LeadsPage')
  })

  it('navigates to AddEditLead and uses correct route meta', async () => {
    router.push('/addlead')
    await router.isReady()
    expect(router.currentRoute.value.meta.title).toBe('Add Lead')
  })

  it('navigates to EditLead with dynamic id param', async () => {
    router.push('/editlead/123')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('EditLead')
    expect(router.currentRoute.value.params.id).toBe('123')
  })

  it('navigates to lead task page with ID param', async () => {
    router.push('/lead/5/tasks')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('LeadTasksPage')
    expect(router.currentRoute.value.params.id).toBe('5')
  })

  it('navigates to all tasks page and has correct title', async () => {
    router.push('/tasks')
    await router.isReady()
    expect(router.currentRoute.value.meta.title).toBe('All Tasks')
  })
})
