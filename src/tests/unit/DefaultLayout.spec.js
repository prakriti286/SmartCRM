import { mount } from '@vue/test-utils'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'

describe('DefaultLayout.vue', () => {
  it('renders AppSidebar, AppHeader and router-view', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: { template: '<div class="dummy-view">View content</div>' } }]
    })

    router.push('/')
    await router.isReady()

    const wrapper = mount(DefaultLayout, {
      global: {
        plugins: [router],
      }
    })

    expect(wrapper.findComponent(AppSidebar).exists()).toBe(true)
    expect(wrapper.findComponent(AppHeader).exists()).toBe(true)
    expect(wrapper.html()).toContain('View content')
  })
})
