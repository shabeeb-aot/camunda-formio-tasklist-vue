import {bpmAxios} from '../axios';

const CamundaRest = {   

  getProcessDefinitions(bearerToken: string) {
    return bpmAxios(bearerToken).get(`/process-definition?latestVersion=true`);
  },

  getProcessDefinitionById: (bearerToken: string, processDefinitionId: string) => {
    return bpmAxios(bearerToken).get(`process-definition/${processDefinitionId}`);
  },   
   
  startProcess(bearerToken: string, processDefinitionKey: string, values: string) {
    return bpmAxios(bearerToken).post(`/process-definition/key/${processDefinitionKey}/start`, values);
  },
    
  getTasks(bearerToken: string) {
    return bpmAxios(bearerToken).get(`/task?sortBy=created&sortOrder=desc&maxResults=10`);
  },
    
  getTaskById(bearerToken: string, taskId: string) {
    return bpmAxios(bearerToken).get(`/task/${taskId}`);
  },
    
  complete(bearerToken: string, taskId: string, values: string) {
    return bpmAxios(bearerToken).post(`/task/${taskId}/complete`, values);
  },    
  
  claim(bearerToken: string, taskId: string, values: any) {
    return bpmAxios(bearerToken).post(`/task/${taskId}/claim`, values);
  },
    
  unclaim(bearerToken: string, taskId: string) {
    return bpmAxios(bearerToken).post(`/task/${taskId}/unclaim`);
  },
    
  getVariablesByTaskId(bearerToken: string, taskId: string) {
    return bpmAxios(bearerToken).get(`/task/${taskId}/variables`);
  },

  getVariablesByProcessId(bearerToken: string, processInstanceId: string) {
    return bpmAxios(bearerToken).get(`/process-instance/${processInstanceId}/variables`);
  },

  getUsers(bearerToken: string) {
    return bpmAxios(bearerToken).get(`/user`)
  }      
}

export default CamundaRest;
