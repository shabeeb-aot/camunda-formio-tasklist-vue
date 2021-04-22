export const FilterSearchTypes = {
  VARIABLES:"variables",
  STRING:"string",
  DATE:"date",
  NORMAL:"normal"
}
  
export const taskSearchFilters = [
  {"label": "Task Variables", "key": "taskVariables", "compares": [">", ">=", "=","!=", "<", "<="], "values": ["gt", "gte","eq", "neq","lt", "lte"], "type": FilterSearchTypes.VARIABLES},
  {"label": "Process Variables", "key": "processVariables" ,"compares": [">", ">=", "=","!=", "<", "<="], "values": ["gt", "gte","eq", "neq","lt", "lte"], "type": FilterSearchTypes.VARIABLES},
  {"label": "Process Definition Name", "key": "processDefinitionName", "compares": ["like", "="], "values": ["processDefinitionNameLike", "processDefinitionName"], "type": FilterSearchTypes.STRING},
  {"label": "Assignee", "compares": ["like", "="],"key": "assignee", "values": ["assigneeLike", "assignee"], "type": FilterSearchTypes.STRING},
  {"label":"Candidate Group", "compares": ["="],"key": "candidateGroup", "values": ["candidateGroup"], "type": FilterSearchTypes.NORMAL},
  {"label":"Candidate User", "compares": ["="], "key": "candidateUser","values": ["candidateUser"], "type": FilterSearchTypes.NORMAL},
  {"label":"Name", "compares": ["like", "="], "key": "name","values": ["nameLike", "name"], "type": FilterSearchTypes.STRING},
  {"label": "Description","compares": ["like", "="], "key": "description","values": ["descriptionLike", "description"], "type": FilterSearchTypes.STRING },
  {"label":"Priority", "compares": ["="],"key": "priority", "values": ["priority"], "type": FilterSearchTypes.NORMAL},
  {"label":"Due Date", "compares": ["before", "after"], "key": "due", "values": ["dueBefore", "dueAfter"], "type": FilterSearchTypes.DATE},
  {"label":"Follow up Date", "compares": ["before", "after"],"key": "followUp", "values": ["followUpBefore", "followUpAfter"], "type": FilterSearchTypes.DATE},
  {"label":"Created", "compares": ["before", "after"], "key": "created","values": ["createdBefore", "createdAfter"], "type": FilterSearchTypes.DATE},
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

export const searchValueObject = (searchValue: string, operator: string) => {

  if (operator === FILTER_OPERATOR_TYPES.EQUAL) {
    return searchValue
  }
  else if(operator===FILTER_OPERATOR_TYPES.LIKE) {
    return `${searchValue}Like`
  }

  else if(operator===FILTER_OPERATOR_TYPES.BEFORE) {
    return `${searchValue}Before`
  }
  else if(operator===FILTER_OPERATOR_TYPES.AFTER) {
    return `${searchValue}After`
  }
  else {
    return `cft-none`
  }
}

