import Vue from 'vue'
import Vuex from 'vuex'

import  serviceFlowModule from './modules/serviceFlow-module'


import { FormsFlowstateModel } from './state'




Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...FormsFlowstateModel
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    serviceFlowModule,
  },
  getters: {
  },
})
