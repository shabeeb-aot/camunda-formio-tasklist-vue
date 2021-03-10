import moment from "moment";

export const timedifference = (date: Date) => {
  return moment(date).fromNow();
}

export const getProcessDataFromList = (processList: any[] ,processId: any,dataKey: string) => {
  const process = processList.find(process=>process.id===processId);
  return process && process[dataKey] ;
}

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