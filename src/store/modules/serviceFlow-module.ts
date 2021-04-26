import { FormsFlowStateModelIF } from '../../interfaces'
import { FormsFlowstateModel } from '../state'

export default {
  namespaced: true,
  state: {
    ...FormsFlowstateModel
  },
  getters: {
    getFormsFlowTaskCurrentPage (state: any) {
      return state.formsFlowTaskCurrentPage
    },
    getFormsFlowTaskId (state: any) {
      return state.formsFlowTaskId
    },
    getFormsFlowactiveIndex (state: any) {
      return state.formsFlowactiveIndex
    },
  },
  actions: {
  },
  mutations: {
    setFormsFlowTaskCurrentPage: (state: FormsFlowStateModelIF, payload: number) => (state.formsFlowTaskCurrentPage = payload),
    setFormsFlowTaskId: (state: FormsFlowStateModelIF, payload: string) => (state.formsFlowTaskId = payload),
    setFormsFlowactiveIndex: (state: FormsFlowStateModelIF, payload: number) => (state.formsFlowactiveIndex = payload),
  }
}
