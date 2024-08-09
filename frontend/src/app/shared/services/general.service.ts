import { Task } from './../models/Task.model';
import { Injectable } from "@angular/core";
import { OnInit } from '@angular/core';
import { TaskCreator, Priority } from '../models/Task.model';
import { BehaviorSubject, Subject, take } from "rxjs";
import { APIService } from "./API.service";
import { TaskSerializer } from "../models/API.model";

// Service is Purposed to Implement DI pattern to global state managing among the components
// in the Application

@Injectable({
    providedIn: 'root'
})
export class GeneralService{

    // Observables from RxJs library for global messaging
    public DoneTasksSwitch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public _MainTasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
    public _DoneTasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

    public DeleteTask: Subject<boolean> = new Subject();
    public ShowModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private API: APIService) {
      this.API.MainTasks.subscribe(
        fetchedTasks => this._MainTasks.next(fetchedTasks)
      )

    }

    // Incapsulated methods to support the main methods

    private findAndGetTask(task: Task, from: Task[]): Task | undefined {
      const collectionReference = from;
      const index = this.findTaskInTasks(task, collectionReference);
      return index !== -1 ? collectionReference[index] : undefined;
    }

    private findTaskInTasks(task: Task, arr: Task[]): number{
      return arr.findIndex(item => item._title === task._title);
    }


    private moveTask(task: Task, from: Task[], to: Task[]){
      const taskToArrange = this.findAndGetTask(task, from);
      const taskIndex = this.findTaskInTasks(task, from);

      if (taskToArrange === undefined || taskIndex === -1) {
        return;
      }

      from.splice(taskIndex, 1);
      to.push(taskToArrange);
    }

    //The implementation to Add or Delete the Task in the Collections

    createTask(title: string | null): void {
        let task: Task;
        if (title) {
            task = TaskCreator.createTask(title, new Date(), Priority.LOW, '');
        } else {
            task = TaskCreator.createTemplateTask();
        }
        const currentTasks = this._MainTasks.value;
        currentTasks.push(task);
        this._MainTasks.next(currentTasks);
        this.API.saveTasks(this._MainTasks.value);
    }

    deleteTask(task: Task, typeOfTask: string): void {
      const removeTask = (arr: Task[]): void => {
          const index = this.findTaskInTasks(task, arr);
          if (index !== -1) {
              arr.splice(index, 1);
          }
      };

      this.DeleteTask.subscribe(value => {
        if(value){
          switch (typeOfTask) {
            case 'main':
                const mainTasks = this._MainTasks.value;
                removeTask(mainTasks);
                this._MainTasks.next(mainTasks);
                this.API.deleteTask(task);
                break;
            case 'done':
                const doneTasks = this._DoneTasks.value;
                removeTask(doneTasks);

                this._DoneTasks.next(doneTasks);
                this.API.deleteTask(task);
                break;
            default:
                console.warn('Unknown task type:', typeOfTask);
                break;
        }
        }
        this.ShowModal.next(false);
      })


  }


  //Methods of Service related to Task unit modifying
  //Changing its own properties: Priority, Due Date, Finished/Unfinished
  //Sorting Collections of Tasks by whether Priority or Due Date

    rearrangeTaskToDone(task: Task): void{
      this.moveTask(task, this._MainTasks.value, this._DoneTasks.value);
    }

    rearrangeTaskToDo(task: Task): void{
      this.moveTask(task, this._DoneTasks.value, this._MainTasks.value);

    }

    changePriority(task: Task): void {
        const taskToUpdate = this.findAndGetTask(task, this._MainTasks.value);
        if (taskToUpdate) {
            taskToUpdate.changePriority();
        }
        this.API.updateTask(task);
    }

    incrementDueDate(task: Task): void {
        const taskToUpdate = this.findAndGetTask(task, this._MainTasks.value);
        if (taskToUpdate) {
            taskToUpdate.incrementDate();
        }
        this.API.updateTask(task);
    }

    sortTasksByDate(): void {
      const tasks = this._MainTasks.value;
      tasks.sort((a, b) => a._dueTo.getTime() - b._dueTo.getTime());
      this._MainTasks.next(tasks);
    }

    sortTasksByPriority(): void {
        const tasks = this._MainTasks.value;
        tasks.sort((a, b) => {
            const priorityOrder = [ Priority.HIGH, Priority.MEDIUM,Priority.LOW, ];
            return priorityOrder.indexOf(a._priority) - priorityOrder.indexOf(b._priority);
        });
        this._MainTasks.next(tasks);
    }
}
