export const getTaskFromList = (tasks: any[], taskId: string) =>{
  const task = tasks.find(task=>task.id===taskId);
  return task;
}

export const findFilterKeyOfAllTask = (array: string|any[], key: string|number, value: any) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i]["id"];
    }
  }
  return null;
}

export const TASK_FILTER_LIST_DEFAULT_PARAM =  [{sortBy: "created",
  sortOrder: "desc",
  label:"Created"
}];

export const sortingList = [
  {"sortOrder": "desc" ,"label": "Created" , "sortBy": "created"},
  {"sortOrder": "desc" ,"label": "Due Date" , "sortBy": "dueDate"},
  {"sortOrder": "desc" ,"label": "Follow-up Date" , "sortBy": "followUpDate"},
  {"sortOrder": "desc" ,"label": "Task Name" , "sortBy": "name"},
  {"sortOrder": "desc" ,"label": "Assignee" , "sortBy": "assignee"},
  {"sortOrder": "desc", "label": "Priority", "sortBy": "priority"}
]

export const decodeTokenValues = (token: any, userName: any, formIOUserRoles: any) =>{
  const decodeToken = JSON.parse(atob(token.split('.')[1]))
  localStorage.setItem("UserDetails", JSON.stringify(decodeToken))
  userName = !userName ? decodeToken && decodeToken["preferred_username"] : userName
  const userEmail = decodeToken["email"] || "external"
  const resourceacess = decodeToken && decodeToken["resource_access"]
  let Resourceaud: any = null;
  if(resourceacess && resourceacess[decodeToken["aud"]]&&resourceacess[decodeToken["aud"][0]]==="forms-flow-web"){
    Resourceaud= resourceacess[decodeToken["aud"][0]];
  }
  else if(resourceacess){
    Resourceaud = resourceacess['forms-flow-web']
  }
  else{
    console.error("Unable to set formio Userroles");
  }
  
  if(Resourceaud && Array.isArray(Resourceaud["roles"]) && Resourceaud["roles"].length){
    formIOUserRoles = !formIOUserRoles ? Resourceaud["roles"] : formIOUserRoles
  }
  else{
    console.error("Unable to set formioUserRoles")
  }
  return {userName, userEmail, formIOUserRoles};
}

export const getFormattedDateAndTime = (date: Date)=>{

  return new Date(date).toLocaleDateString('en-us',  {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour: '2-digit', minute: '2-digit', hour12: true});

};

export const searchData = [
  {"label": "Task Variables", "compares": [">", ">=", "=","!=", "<", "<="]},
  {"label": "Process Variables", "compares": [">", ">=", "=","!=", "<", "<="]},
  {"label": "Process Definition Name", "compares": ["likes", "="], "values": ["processDefinitionNameLike", "processDefinitionName"]},
  {"label": "Assignee", "compares": ["likes", "="], "values": ["assigneeLike", "assignee"]},
  {"label":"Candidate Group", "compares": ["="], "values": ["candidateGroup"]},
  {"label":"Candidate User", "compares": ["="], "values": ["candidateUser"]},
  {"label":"Name", "compares": ["likes", "="], "values": ["nameLike", "name"]},
  {"label": "Description","compares": ["likes", "="], "values": ["descriptionLike", "description"] },
  {"label":"Priority", "compares": ["="], "values": ["priority"]},
  {"label":"Due Date", "compares": ["="], "values": ["due"]},
  {"label":"Follow up Date", "compares": ["="], "values": ["followUp"]},
  {"label":"Created", "compares": ["="], "values": ["created"]},
]

export const searchQuery = [
  {
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
]
