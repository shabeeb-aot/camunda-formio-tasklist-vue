import Vue from 'vue'
import Vuex from 'vuex'

import { FormsFlowstateModel } from './state'
import { FormsFlowcommonMutation } from './mutations'
import { FormsFlowcommonGetters } from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...FormsFlowstateModel
  },
  mutations: {
    ...FormsFlowcommonMutation
  },
  actions: {
  },
  modules: {
  },
  getters: {
    ...FormsFlowcommonGetters
  },
})
