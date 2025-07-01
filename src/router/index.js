// src/router/index.js

import { createRouter, createWebHashHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LeadsPage from '@/views/LeadsPage.vue'
import AddEditLead from '@/views/AddEditLead.vue'
import LeadTasksPage from '@/views/LeadTaskPage.vue'
import AllTasksPage from '@/views/AllTasksPage.vue'
import LeadDashboard from '@/views/LeadDashboard.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
         path: '',
          redirect: '/dashboard',
         },
      {
         path: 'dashboard',
          name: 'LeadDashboard',
           component: LeadDashboard,
           meta: { title: 'Dashboard'} },
      {
         path: 'leads',
          name: 'LeadsPage', 
          component: LeadsPage,
        meta: { title: 'Leads' } },
      {
         path: 'addlead', 
         name: 'AddLead', 
         component: AddEditLead,
       meta: { title: 'Add Lead' }  },
      {
         path: 'editlead/:id',
          name: 'EditLead', 
          component: AddEditLead,
           props: true,
            meta: { title: 'Edit Lead' }
           },
      {
         path: 'lead/:id/tasks',
          name: 'LeadTasksPage', 
          component: LeadTasksPage, 
          props: true,
       meta: { title: 'Lead Tasks' }  },
      {
         path: 'tasks', 
         name: 'AllTasksPage', 
         component: AllTasksPage,
        meta: { title: 'All Tasks' } }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
export { routes } 
