import {bpmAxios} from '../axios';

const CamundaRest = {   

    getProcessDefinitions(bearerToken: string, CamundaUrl: any ) {
        return bpmAxios(bearerToken, CamundaUrl).get(`/process-definition`);
    },

    getProcessDefinitionById: (bearerToken: string, processDefinitionId: string, CamundaUrl: any) => {
        return bpmAxios(bearerToken, CamundaUrl).get(`process-definition/${processDefinitionId}`);
    },   
    
    startProcess(bearerToken: string, processDefinitionKey: string, values: string, CamundaUrl: any) {
        return bpmAxios(bearerToken, CamundaUrl).post(`/process-definition/key/${processDefinitionKey}/start`, values);
    },
      
    getTasks(bearerToken: string, CamundaUrl: any) {
        return bpmAxios(bearerToken, CamundaUrl).get(`/task?sortBy=created&sortOrder=desc`);
    },
      
    getTaskById(bearerToken: string, taskId: string, CamundaUrl: any) {
        return bpmAxios(bearerToken, CamundaUrl).get(`/task/${taskId}`);
    },

    updateTasksByID(bearerToken: string, taskId: string, CamundaUrl: any, values: any) {
        return bpmAxios(bearerToken, CamundaUrl).put(`/task/${taskId}`, values)
    },
      
    complete(bearerToken: string, taskId: string, values: string, CamundaUrl: any) {
        return bpmAxios(bearerToken, CamundaUrl).post(`/task/${taskId}/complete`, values);
    },    
    
    claim(bearerToken: string, taskId: string, values: any, CamundaUrl: any) {
        return bpmAxios(bearerToken, CamundaUrl).post(`/task/${taskId}/claim`, values);
    },
      
    unclaim(bearerToken: string, taskId: string, CamundaUrl: any) {
        return bpmAxios(bearerToken, CamundaUrl).post(`/task/${taskId}/unclaim`);
    },
      
    getVariablesByTaskId(bearerToken: string, taskId: string, CamundaUrl: any) {
        return bpmAxios(bearerToken, CamundaUrl).get(`/task/${taskId}/variables`);
    },

    getVariablesByProcessId(bearerToken: string, processInstanceId: string, CamundaUrl: any) {
        return bpmAxios(bearerToken, CamundaUrl).get(`/process-instance/${processInstanceId}/variables`);
    },

    getUsers(bearerToken: string, CamundaUrl: any) {
        return bpmAxios(bearerToken, CamundaUrl).get(`/user`)
    },
    
    filterList(bearerToken: string, CamundaUrl: any) {
        return bpmAxios(bearerToken, CamundaUrl).get('/filter?resourceType=Task&itemCount=true')
    },

    filterTaskList(bearerToken: string, filterId: string, CamundaUrl: string) {
        return bpmAxios(bearerToken, CamundaUrl).get(`/filter/${filterId}/list?sortBy=created&sortOrder=desc`)
    }
  }

export default CamundaRest;
