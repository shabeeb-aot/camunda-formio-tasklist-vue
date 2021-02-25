import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Tasklist from '@/views/tasklist.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Tasklist',
    component: Tasklist
  },
  {
    path: '/:taskId',
    name: 'Tasklist for specific Task',
    component: Tasklist
  }
]

const router = new VueRouter({
  routes
})

export default router
