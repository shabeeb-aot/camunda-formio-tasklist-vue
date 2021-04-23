import Vue from 'vue'
import Vuex from 'vuex'

import { stateModel } from './state'
import { commonMutation } from './mutations'
import { commonGetters } from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...stateModel
  },
  mutations: {
    ...commonMutation
  },
  actions: {
  },
  modules: {
  },
  getters: {
    ...commonGetters
  },
})
