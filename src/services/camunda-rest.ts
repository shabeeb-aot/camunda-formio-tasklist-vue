import {bpmAxios} from '../axios';

const CamundaRest = {   

  getProcessDefinitions(bearerToken: string, CamundaUrl: string ) {
    return bpmAxios(bearerToken, CamundaUrl).get(`/engine-rest/process-definition`);
  },

  getProcessDefinitionById: (bearerToken: string, processDefinitionId: string, CamundaUrl: string) => {
    return bpmAxios(bearerToken, CamundaUrl).get(`/engine-rest/process-definition/${processDefinitionId}`);
  },   
  
  startProcess(bearerToken: string, processDefinitionKey: string, values: string, CamundaUrl: string) {
    return bpmAxios(bearerToken, CamundaUrl).post(`/engine-rest/process-definition/key/${processDefinitionKey}/start`, values);
  },
    
  getTaskById(bearerToken: string, taskId: string, CamundaUrl: string) {
    return bpmAxios(bearerToken, CamundaUrl).get(`/engine-rest/task/${taskId}`);
  },

  updateTasksByID(bearerToken: string, taskId: string, CamundaUrl: string, values: any) {
    return bpmAxios(bearerToken, CamundaUrl).put(`/engine-rest/task/${taskId}`, values);
  },

  getTaskGroupByID(bearerToken: string, taskId: string, CamundaUrl: string) {
    return bpmAxios(bearerToken, CamundaUrl).get(`/engine-rest/task/${taskId}/identity-links?type=candidate`);
  },

  createTaskGroupByID(bearerToken: string, taskId: string, CamundaUrl: string, values: any) {
    return bpmAxios(bearerToken, CamundaUrl).post(`/engine-rest/task/${taskId}/identity-links`, values);
  },

  deleteTaskGroupByID(bearerToken: string, taskId: string, CamundaUrl: string, values: any) {
    return bpmAxios(bearerToken, CamundaUrl).post(`/engine-rest/task/${taskId}/identity-links/delete`, values);
  },
    
  complete(bearerToken: string, taskId: string, values: string, CamundaUrl: string) {
    return bpmAxios(bearerToken, CamundaUrl).post(`/engine-rest/task/${taskId}/complete`, values);
  },  
  
  claim(bearerToken: string, taskId: string, values: any, CamundaUrl: string) {
    return bpmAxios(bearerToken, CamundaUrl).post(`/engine-rest/task/${taskId}/claim`, values);
  },
    
  unclaim(bearerToken: string, taskId: string, CamundaUrl: string) {
    return bpmAxios(bearerToken, CamundaUrl).post(`/engine-rest/task/${taskId}/unclaim`);
  },
    
  getVariablesByTaskId(bearerToken: string, taskId: string, CamundaUrl: string) {
    return bpmAxios(bearerToken, CamundaUrl).get(`/engine-rest/task/${taskId}/variables`);
  },

  getVariablesByProcessId(bearerToken: string, processInstanceId: string, CamundaUrl: string) {
    return bpmAxios(bearerToken, CamundaUrl).get(`/engine-rest/process-instance/${processInstanceId}/variables`);
  },

  getUsers(bearerToken: string, CamundaUrl: string) {
    return bpmAxios(bearerToken, CamundaUrl).get(`/engine-rest/user`)
  },
  
  filterList(bearerToken: string, CamundaUrl: string) {
    return bpmAxios(bearerToken, CamundaUrl).get('/engine-rest/filter?resourceType=Task&itemCount=true')
  },

  filterTaskList(bearerToken: string, filterId: string, values: any, CamundaUrl: string) {
    return bpmAxios(bearerToken, CamundaUrl).post(`/engine-rest/filter/${filterId}/list`, values)
  },

  formTaskSubmit(bearerToken: string, taskId: string, values: object, CamundaUrl: string) {
    return bpmAxios(bearerToken, CamundaUrl).post(`/engine-rest/task/${taskId}/submit-form`, values)
  },

  listForms(bearerToken: string, CamundaUrl: string) {
    return bpmAxios(bearerToken, CamundaUrl).get(`/engine-rest-ext/form`)
  }
}

export default CamundaRest;
