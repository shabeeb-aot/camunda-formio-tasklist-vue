import axios from 'axios';

class CamundaRest {
  static ENGINE_REST_ENDPOINT = '/engine-rest';
  
  static getProcessDefinitions() {
    return axios.get(`${CamundaRest.ENGINE_REST_ENDPOINT}/process-definition?latestVersion=true`);
  }

  static getProcessDefinitionById(processDefinitionId) {
    return axios.get(`${CamundaRest.ENGINE_REST_ENDPOINT}/process-definition/${processDefinitionId}`);
  }   
   
  static startProcess(processDefinitionKey, values) {
    return axios.post(`${CamundaRest.ENGINE_REST_ENDPOINT}/process-definition/key/${processDefinitionKey}/start`, values);
  }
    
  static getTasks() {
    return axios.get(`${CamundaRest.ENGINE_REST_ENDPOINT}/task?sortBy=created&sortOrder=desc&maxResults=10`);
  }
    
  static getTaskById(taskId) {
    return axios.get(`${CamundaRest.ENGINE_REST_ENDPOINT}/task/${taskId}`);
  }
    
  static complete(taskId, values) {
    return axios.post(`${CamundaRest.ENGINE_REST_ENDPOINT}/task/${taskId}/complete`, values);
  }    
  
  static claim(taskId, values) {
    return axios.post(`${CamundaRest.ENGINE_REST_ENDPOINT}/task/${taskId}/claim`, values);
  }
    
  static unclaim(taskId) {
    return axios.post(`${CamundaRest.ENGINE_REST_ENDPOINT}/task/${taskId}/unclaim`);
  }
    
  static getVariablesByTaskId(taskId) {
    return axios.get(`${CamundaRest.ENGINE_REST_ENDPOINT}/task/${taskId}/variables`);
  }

  static getVariablesByProcessId(processInstanceId) {
    return axios.get(`${CamundaRest.ENGINE_REST_ENDPOINT}/process-instance/${processInstanceId}/variables`);
  }

  static getUsers() {
    return axios.get(`${CamundaRest.ENGINE_REST_ENDPOINT}/user`)
  }      
}

export default CamundaRest;
