import Vue from 'vue'
import Vuex from 'vuex'

import  serviceFlowModule from './modules/serviceFlow-module'



Vue.use(Vuex)

const store = new Vuex.Store({  })
export default function install (store: any) {
  store.registerModule('serviceFlowModule', serviceFlowModule)
}

