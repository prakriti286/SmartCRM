jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  toast: jest.fn(),
  showLoading: jest.fn(),
  close: jest.fn(),
}));

import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

describe('Main app initialization', () => {
  it('mounts the app with router and store', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router, store]
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
