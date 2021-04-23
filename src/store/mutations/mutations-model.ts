import { StateModelIF } from '@/interfaces'

export const commonMutation: any = {
  setFormsFlowTaskCurrentPage: (state: StateModelIF, payload: number) => (state.formsFlowTaskCurrentPage = payload),
  setformsFlowTaskId: (state: StateModelIF, payload: string) => (state.formsFlowTaskId = payload),
  setformsFlowactiveIndex: (state: StateModelIF, payload: number) => (state.formsFlowactiveIndex = payload),
}
