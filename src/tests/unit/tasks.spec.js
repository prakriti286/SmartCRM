import tasksModule from '@/store/modules/tasks'
import axios from 'axios'
import Swal from 'sweetalert2'

jest.mock('axios')
jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}))

describe('Vuex - tasks module', () => {
  let commit

  beforeEach(() => {
    commit = jest.fn()
    jest.clearAllMocks()
  })

  it('fetchTasks commits SET_TASKS on success', async () => {
    const mockTasks = [{ id: '1', title: 'Sample Task' }]
    axios.get.mockResolvedValue({ data: mockTasks })

    await tasksModule.actions.fetchTasks({ commit })

    expect(axios.get).toHaveBeenCalledWith('https://685fc35ec55df675589f31e1.mockapi.io/tasks')
    expect(commit).toHaveBeenCalledWith('SET_TASKS', mockTasks)
  })

  it('fetchTasks shows error alert on failure', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'))

    await tasksModule.actions.fetchTasks({ commit })

    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Failed to fetch tasks.', 'error')
  })

  it('addTask commits ADD_TASK and shows success alert on success', async () => {
    const newTask = { title: 'New Task' }
    const responseData = { id: '123', ...newTask }
    axios.post.mockResolvedValue({ data: responseData })

    await tasksModule.actions.addTask({ commit }, newTask)

    expect(axios.post).toHaveBeenCalledWith('https://685fc35ec55df675589f31e1.mockapi.io/tasks', newTask)
    expect(commit).toHaveBeenCalledWith('ADD_TASK', responseData)
    expect(Swal.fire).toHaveBeenCalledWith('Success', 'Task added successfully!', 'success')
  })

  it('addTask shows error alert on failure', async () => {
    axios.post.mockRejectedValue(new Error('Failed'))

    await tasksModule.actions.addTask({ commit }, { title: 'Failing Task' })

    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Failed to add task.', 'error')
  })

  it('deleteTask commits DELETE_TASK and shows success alert on success', async () => {
    axios.delete.mockResolvedValue({})

    await tasksModule.actions.deleteTask({ commit }, '1')

    expect(axios.delete).toHaveBeenCalledWith('https://685fc35ec55df675589f31e1.mockapi.io/tasks/1')
    expect(commit).toHaveBeenCalledWith('DELETE_TASK', '1')
    expect(Swal.fire).toHaveBeenCalledWith('Deleted', 'Task deleted successfully!', 'success')
  })

  it('deleteTask shows error alert on failure', async () => {
    axios.delete.mockRejectedValue(new Error('Error'))

    await tasksModule.actions.deleteTask({ commit }, '1')

    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Failed to delete task.', 'error')
  })
})
