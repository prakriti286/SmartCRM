import axios from 'axios'
import Swal from 'sweetalert2'

const API_URL = 'https://685fc35ec55df675589f31e1.mockapi.io/tasks'

export default {
  namespaced: true,

  state: () => ({
    tasks: []
  }),

  mutations: {
    SET_TASKS(state, tasks) {
      state.tasks = tasks
    },
    ADD_TASK(state, task) {
      state.tasks.push(task)
    },
    DELETE_TASK(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId)
    }
  },

  actions: {
    async fetchTasks({ commit }) {
      try {
        const res = await axios.get(API_URL)
        commit('SET_TASKS', res.data)
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch tasks.', 'error')
      }
    },

    async addTask({ commit }, task) {
      try {
        const res = await axios.post(API_URL, task)
        commit('ADD_TASK', res.data)
        Swal.fire('Success', 'Task added successfully!', 'success')
      } catch (error) {
        Swal.fire('Error', 'Failed to add task.', 'error')
      }
    },

    async deleteTask({ commit }, taskId) {
      try {
        await axios.delete(`${API_URL}/${taskId}`)
        commit('DELETE_TASK', taskId)
        Swal.fire('Deleted', 'Task deleted successfully!', 'success')
      } catch (error) {
        Swal.fire('Error', 'Failed to delete task.', 'error')
      }
    }
  }
}
