import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import FormList from '@/components/formlist.vue';
import Tasklist from '@/views/tasklist.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Tasklist',
    component: Tasklist
  },
  {
    path: '/form',
    name: 'Formio forms list',
    component: FormList
  }
]

const router = new VueRouter({
  routes
})

export default router
