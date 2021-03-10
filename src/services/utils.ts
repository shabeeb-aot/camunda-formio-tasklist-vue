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