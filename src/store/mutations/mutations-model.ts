import { FormsFlowStateModelIF } from '@/interfaces'

export const FormsFlowcommonMutation: any = {
  setFormsFlowTaskCurrentPage: (state: FormsFlowStateModelIF, payload: number) => (state.formsFlowTaskCurrentPage = payload),
  setFormsFlowTaskId: (state: FormsFlowStateModelIF, payload: string) => (state.formsFlowTaskId = payload),
  setFormsFlowactiveIndex: (state: FormsFlowStateModelIF, payload: number) => (state.formsFlowactiveIndex = payload),
}
