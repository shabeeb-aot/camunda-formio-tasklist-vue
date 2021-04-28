import VueRouter, { RouteConfig } from 'vue-router'
import FormViewSubmission from '@/components/FormViewSubmission.vue'
// import FormViewSubmission from '../views/FormViewSubmission.vue'
// import Tasklist from '../views/TaskList.vue';
// import FormViewSubmission from '@/views/FormViewSubmission.vue'
import Tasklist from '@/views/TaskList.vue'

import Vue from 'vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/:taskIdName?',
    name: 'Tasklist',
    component: Tasklist,
    props: true
  },
  {
    path: '/form/:formId/submission/:submissionId',
    name: 'Formio forms list',
    component: FormViewSubmission
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
