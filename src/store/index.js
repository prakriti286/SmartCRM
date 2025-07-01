//@ts-ignore

import { createStore } from 'vuex'
import leads from './modules/leads'
import tasks from './modules/tasks'
export default createStore({
  modules: {
    leads,
    tasks 
  }
})
