import { StateModelIF } from '@/interfaces'

export const commonMutation: any = {
  setFormsFlowTaskCurrentPage: (state: StateModelIF, payload: number) => (state.formsFlowTaskCurrentPage = payload),
  setFormsFlowTaskId: (state: StateModelIF, payload: string) => (state.formsFlowTaskId = payload),
  setFormsFlowactiveIndex: (state: StateModelIF, payload: number) => (state.formsFlowactiveIndex = payload),
}
