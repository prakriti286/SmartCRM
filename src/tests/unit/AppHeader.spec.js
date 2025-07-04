import { mount } from '@vue/test-utils'
import AppHeader from '@/components/AppHeader.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: AppHeader,
    meta: { title: 'Dashboard' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

describe('AppHeader.vue', () => {
  it('renders the page title from route meta', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.html()).toContain('Dashboard')
  })

  it('renders fallback title if no route meta', async () => {
    router.addRoute({
      path: '/no-title',
      component: AppHeader
    })
    router.push('/no-title')
    await router.isReady()

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.html()).toContain('SmartCRM')
  })

  it('displays SmartCRM on the right side of navbar', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router]
      }
    })

    const rightSpan = wrapper.findAll('span').find(span => span.text() === 'SmartCRM')
    expect(rightSpan.exists()).toBe(true)
  })
})
