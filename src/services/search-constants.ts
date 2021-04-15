export const FilterSearchTypes = {
  VARIABLES:"variables",
  STRING:"string",
  DATE:"date",
  NORMAL:"normal"
}
  
export const taskSearchFilters = [
  {"label": "Task Variables", "compares": [">", ">=", "=","!=", "<", "<="], "values": ["gt", "gte","eq", "neq","lt", "lte"], "type": FilterSearchTypes.VARIABLES},
  {"label": "Process Variables", "compares": [">", ">=", "=","!=", "<", "<="], "values": ["gt", "gte","eq", "neq","lt", "lte"], "type": FilterSearchTypes.VARIABLES},
  {"label": "Process Definition Name", "compares": ["like", "="], "values": ["processDefinitionNameLike", "processDefinitionName"], "type": FilterSearchTypes.STRING},
  {"label": "Assignee", "compares": ["like", "="], "values": ["assigneeLike", "assignee"], "type": FilterSearchTypes.STRING},
  {"label":"Candidate Group", "compares": ["="], "values": ["candidateGroup"], "type": FilterSearchTypes.NORMAL},
  {"label":"Candidate User", "compares": ["="], "values": ["candidateUser"], "type": FilterSearchTypes.NORMAL},
  {"label":"Name", "compares": ["like", "="], "values": ["nameLike", "name"], "type": FilterSearchTypes.STRING},
  {"label": "Description","compares": ["like", "="], "values": ["descriptionLike", "description"], "type": FilterSearchTypes.STRING },
  {"label":"Priority", "compares": ["="], "values": ["priority"], "type": FilterSearchTypes.NORMAL},
  {"label":"Due Date", "compares": ["before", "after"], "values": ["dueBefore", "dueAfter"], "type": FilterSearchTypes.DATE},
  {"label":"Follow up Date", "compares": ["before", "after"], "values": ["followUpBefore", "followUpAfter"], "type": FilterSearchTypes.DATE},
  {"label":"Created", "compares": ["before", "after"], "values": ["createdBefore", "createdAfter"], "type": FilterSearchTypes.DATE},
]
  
export const searchQuery: any = {
  "assignee": null,
  "assigneeLike": null,
  "created": null,
  "followUp": null,
  "due": null,
  "description": null,
  "descriptionLike": null,
  "processVariables": [],
  "taskVariables": [],
  "processDefinitionNameLike": null,
  "processDefinitionName": null,
  "priority": null,
  "name": null,
  "nameLike": null,
  "candidateGroup":null,
  "candidateUser": null
}

export const getVariableOperator = (operator: string)=>{
  switch(operator){
  case "=":
    return 'eq';
  case ">":
    return "gt";
  case ">=":
    return "gteq";
  case "!=":
    return "neq";
  case "<":
    return "lt";
  case "<=":
    return "lteq";
  case "like":
    return "like";
  default:
  } 
}



export const FILTER_OPERATOR_TYPES = {
  EQUAL:"=",
  LIKE:"like",
  BEFORE:"before",
  AFTER:"after"
}

export const FILTER_COMPARE_OPTIONS = {
  [FilterSearchTypes.VARIABLES]:[">", ">=", FILTER_OPERATOR_TYPES.EQUAL ,"!=", "<", "<=",FILTER_OPERATOR_TYPES.LIKE],
  [FilterSearchTypes.DATE]:[FILTER_OPERATOR_TYPES.BEFORE, FILTER_OPERATOR_TYPES.AFTER],
  [FilterSearchTypes.STRING]:[FILTER_OPERATOR_TYPES.EQUAL,FILTER_OPERATOR_TYPES.LIKE],
  [FilterSearchTypes.NORMAL]:[FILTER_OPERATOR_TYPES.EQUAL]
};

