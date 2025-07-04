import { mount } from '@vue/test-utils'
import AppSidebar from '@/components/AppSidebar.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

describe('AppSidebar.vue', () => {
  const routes = [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', name: 'Dashboard', component: { template: '<div>Dashboard</div>' } },
    { path: '/leads', name: 'LeadsPage', component: { template: '<div>Leads</div>' } },
    { path: '/addlead', name: 'AddLead', component: { template: '<div>Add Lead</div>' } },
    { path: '/tasks', name: 'Tasks', component: { template: '<div>Tasks</div>' } },
  ]

  const createWrapper = async (initialRoute = '/dashboard') => {
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    })

    await router.push(initialRoute)
    await router.isReady()

    return {
      wrapper: mount(AppSidebar, {
        global: {
          plugins: [router],
        },
      }),
      router,
    }
  }

  it('renders all sidebar links using their hrefs', async () => {
    const { wrapper } = await createWrapper()
    const links = wrapper.findAll('a.nav-link')

    expect(links.some(link => link.attributes('href') === '#/dashboard')).toBe(true)
    expect(links.some(link => link.attributes('href') === '#/leads')).toBe(true)
    expect(links.some(link => link.attributes('href') === '#/addlead')).toBe(true)
    expect(links.some(link => link.attributes('href') === '#/tasks')).toBe(true)
  })

  it('adds "active" class to the correct link (/leads)', async () => {
    const { wrapper } = await createWrapper('/leads')
    await wrapper.vm.$nextTick()

    const activeLink = wrapper.find('a[href="#/leads"]')
    expect(activeLink.exists()).toBe(true)
    expect(activeLink.classes()).toContain('active')

    const dashboardLink = wrapper.find('a[href="#/dashboard"]')
    expect(dashboardLink.classes()).not.toContain('active')
  })

  it('navigates to /tasks manually and applies active class', async () => {
    const { wrapper, router } = await createWrapper('/dashboard')

    await router.push('/tasks')
    await wrapper.vm.$nextTick()

    const tasksLink = wrapper.find('a[href="#/tasks"]')
    expect(tasksLink.exists()).toBe(true)
    expect(tasksLink.classes()).toContain('active')
  })
})
