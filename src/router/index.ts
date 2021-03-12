import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Tasklist from '@/views/tasklist.vue';
import FormList from '@/components/formlist.vue';

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
