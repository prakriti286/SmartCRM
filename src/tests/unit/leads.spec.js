import leads from '@/store/modules/leads'
import axios from 'axios'

jest.mock('axios')

describe('leads Vuex module', () => {
  it('fetches leads and commits them', async () => {
    const commit = jest.fn()
    const fakeLeads = [{ id: 1, name: 'Test Lead' }]
    axios.get.mockResolvedValue({ data: fakeLeads })

    await leads.actions.fetchLeads({ commit })

    expect(commit).toHaveBeenCalledWith('SET_LEADS', fakeLeads)
  })

  it('adds a lead and commits it', async () => {
    const commit = jest.fn()
    const newLead = { name: 'New Lead' }
    axios.post.mockResolvedValue({ data: newLead })

    const result = await leads.actions.addLead({ commit }, newLead)

    expect(commit).toHaveBeenCalledWith('ADD_LEAD', newLead)
    expect(result).toEqual(newLead)
  })

  it('updates a lead and commits it', async () => {
    const commit = jest.fn()
    const updatedLead = { id: 2, name: 'Updated Lead' }
    axios.put.mockResolvedValue({ data: updatedLead })

    const result = await leads.actions.updateLead({ commit }, updatedLead)

    expect(commit).toHaveBeenCalledWith('UPDATE_LEAD', updatedLead)
    expect(result).toEqual(updatedLead)
  })

  it('deletes a lead and commits it', async () => {
    const commit = jest.fn()
    axios.delete.mockResolvedValue({})

    const result = await leads.actions.deleteLead({ commit }, 3)

    expect(commit).toHaveBeenCalledWith('DELETE_LEAD', 3)
    expect(result).toBe(true)
  })
})
