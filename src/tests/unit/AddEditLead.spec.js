import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import AddEditLead from '@/views/AddEditLead.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import flushPromises from 'flush-promises'

jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}))

const addLeadMock = jest.fn()
const updateLeadMock = jest.fn()
const fetchLeadsMock = jest.fn()

describe('AddEditLead.vue', () => {
  let store
  let router

  const createWrapper = async (mode = 'add', leadData = []) => {
    const leadsModule = {
      namespaced: true,
      state: () => ({
        leads: leadData
      }),
      actions: {
        fetchLeads: fetchLeadsMock,
        addLead: addLeadMock,
        updateLead: updateLeadMock
      }
    }

    store = createStore({
      modules: {
        leads: leadsModule
      }
    })

    router = createRouter({
      history: createWebHashHistory(),
      routes: [
        {
          path: '/leads/:id?',
          name: 'AddEditLead',
          component: AddEditLead
        },
        {
          path: '/leads',
          name: 'Leads',
          component: { template: '<div>Leads</div>' }
        }
      ]
    })

    if (mode === 'edit') {
      await router.push({ name: 'AddEditLead', params: { id: '1' } })
    } else {
      await router.push({ name: 'AddEditLead' })
    }

    await router.isReady()

    const wrapper = mount(AddEditLead, {
      global: {
        plugins: [store, router]
      },
      data() {
        return {
          formReady: true
        }
      },
      attachTo: document.body
    })

    await flushPromises()
    return wrapper
  }

  it('renders Add Lead title in add mode', async () => {
    const wrapper = await createWrapper()
    expect(wrapper.text()).toContain('Add Lead')
  })

  it('renders Edit Lead title and fills form in edit mode', async () => {
    const lead = {
      id: '1',
      name: 'rohan',
      company: 'swagEasy',
      contact: '1234567890',
      budget: '5000',
      status: 'New'
    }

    const wrapper = await createWrapper('edit', [lead])
    await flushPromises()

    expect(wrapper.text()).toContain('Edit Lead')
    expect(wrapper.find('#name').element.value).toBe('rohan')
    expect(wrapper.find('#company').element.value).toBe('swagEasy')
    expect(wrapper.find('#contact').element.value).toBe('1234567890')
    expect(wrapper.find('#budget').element.value).toBe('5000')
    expect(wrapper.find('#status').element.value).toBe('New')
  })

  it('shows validation errors when form is submitted empty', async () => {
    const wrapper = await createWrapper()

    await wrapper.vm.submitForm()
    await flushPromises()

    const errors = wrapper.findAll('.invalid-feedback')
    expect(errors.map(e => e.text())).toEqual([
      'Name is required',
      'Company is required',
      'Contact is required',
      'Budget is required',
      'Status is required'
    ])
  })

  it('submits valid form and calls addLead + shows success alert', async () => {
    const wrapper = await createWrapper()

    await wrapper.find('#name').setValue('Amit')
    await flushPromises()
    await wrapper.find('#company').setValue('TechX')
    await flushPromises()
    await wrapper.find('#contact').setValue('9876543210')
    await flushPromises()
    await wrapper.find('#budget').setValue('10000')
    await flushPromises()
    await wrapper.find('#status').setValue('New')
    await flushPromises()

    await wrapper.vm.submitForm()
    await flushPromises()

    expect(addLeadMock).toHaveBeenCalled()
    expect(require('sweetalert2').fire).toHaveBeenCalledWith('Saved!', 'Lead added successfully.', 'success')
  })

  it('submits updated form in edit mode and calls updateLead', async () => {
    const lead = {
      id: '1',
      name: 'old name',
      company: 'old company',
      contact: '1111111111',
      budget: '5000',
      status: 'Pending'
    }

    const wrapper = await createWrapper('edit', [lead])
    await flushPromises()

    await wrapper.find('#name').setValue('New Name')
    await flushPromises()
    await wrapper.find('#company').setValue('New Co')
    await flushPromises()
    await wrapper.find('#contact').setValue('9999999999')
    await flushPromises()
    await wrapper.find('#budget').setValue('8000')
    await flushPromises()
    await wrapper.find('#status').setValue('Closed')
    await flushPromises()

    await wrapper.vm.submitForm()
    await flushPromises()

    expect(updateLeadMock).toHaveBeenCalled()
    expect(require('sweetalert2').fire).toHaveBeenCalledWith('Updated!', 'Lead updated successfully.', 'success')
  })
})
