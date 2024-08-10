import { Priority, Task } from "./Task.model";

export interface BaseSerializer {
  serialize(cls: any): string;
  deserialize(json: string, many: boolean): any;
}

export class TaskSerializer implements BaseSerializer {


  constructor() {

  }

  serialize(task: Task): string {
    const priority = task._priority;
    let finalize_priority = null;
    switch(priority){
      case Priority.LOW:
        finalize_priority = 0
        break;
      case Priority.MEDIUM:
        finalize_priority = 1
        break;
      case Priority.HIGH:
        finalize_priority = 2
        break;
    }


    return JSON.stringify({
      _title: task._title,
      _dueTo: task._dueTo.toISOString(),
      _priority: finalize_priority,
      _whenFinished: task._whenFinished instanceof Date ? task._whenFinished.toISOString() : task._whenFinished,
      _description: task._description
    });
  }

  deserialize(json: string, many = false): Task[] | Task | null{
    let parsed = JSON.parse(json);
    if(many){
      let Tasks = [];
      if(!(parsed instanceof Array)){
        return null;
      }
      for(let i = 0; i < parsed.length; i++){
        let task = parsed[i] as Task
        Tasks.push(Task.deepCopy(task));
      }

      return Tasks;
    }
    return parsed as Task;
  }
}
