import { TaskSerializer } from './../models/API.model';
import { Injectable, OnInit } from "@angular/core";
import { DeleteTask, GetEncodedTask, ReturnTasks, UpdateTask } from "../../../../wailsjs/go/main/App";
import { Task, TaskCreator } from "../models/Task.model";
import { Subject } from 'rxjs';

// The Service that Purposed to Communicate with the 'Backend' written in Golang
// Main approach is to structurize the API using adapter and load the cached or saved date
// from older sessions

@Injectable({
    providedIn: 'root'
})
export class APIService{

    private serializer = new TaskSerializer()
    public MainTasks: Subject<Task[]> = new Subject<Task[]>;

    constructor(){
      this.loadAllMainTasks();
    }


    loadAllMainTasks(): void{
      ReturnTasks().then((value)=> {
        let deserialized = this.serializer.deserialize(value, true);
        if(!deserialized || deserialized instanceof Task){
          return;
        }
        this.MainTasks.next(deserialized);
      })

    }

    updateTask(task: Task): void{
      if(!task){
        return
      }
      UpdateTask(this.serializer.serialize(task));
    }


    deleteTask(task: Task): void{
      DeleteTask(this.serializer.serialize(task));
    }

    saveTasks(tasks: Task[]): void {
      const serializedTasks = tasks.map(task => this.serializer.serialize(task));
      for(let i = 0; i < serializedTasks.length; i++){
        GetEncodedTask(serializedTasks[i]);
      }

  }

}
