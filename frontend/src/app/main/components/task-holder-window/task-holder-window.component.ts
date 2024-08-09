import { GeneralService } from '../../../shared/services/general.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../../shared/models/Task.model';
import { ReactiveFormsModule } from '@angular/forms';
import { Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PriorityColorDirective } from '../../../shared/directives/priority-color.directive';
@Component({
  selector: 'app-task-holder-window',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, PriorityColorDirective, AsyncPipe],
  templateUrl: './task-holder-window.component.html',
  styleUrl: './task-holder-window.component.css'
})
export class TaskHolderWindowComponent implements OnInit, OnDestroy{
  @Input('DoneTasksSwitch') DoneTasksSwitch: boolean = false

  MainTaskSubscription: Subscription = new Subscription();
  DoneTaskSubscription: Subscription = new Subscription();


  MainTasksSlice: Task[] = [];
  DoneTasksSlice: Task[] = [];

  constructor(private generalService: GeneralService){
  }

  ngOnInit(): void{
    this.MainTaskSubscription = this.generalService._MainTasks
    .subscribe(value =>
      this.MainTasksSlice = value
    )
    this.DoneTaskSubscription = this.generalService._DoneTasks
    .subscribe(value => {
      this.DoneTasksSlice = value;
    })
  }

  onFinishTask(task: Task){
    task.finishTask();
    this.generalService.rearrangeTaskToDone(task);
  }

  onUndoFinishTask(task: Task){
    task.undoFinishTask();
    this.generalService.rearrangeTaskToDo(task);
  }

  onDelete(task: Task, type: string): void{
    if(task === null || type === ''){
      return;
    }
    this.generalService.ShowModal.next(true);
    this.generalService.deleteTask(task, type);
  }

  ngOnDestroy(): void {
    this.MainTaskSubscription.unsubscribe();
    this.DoneTaskSubscription.unsubscribe();
  }

  onChangePriority(task: Task){
    this.generalService.changePriority(task);
  }
  onIncrementDate(task: Task){
    this.generalService.incrementDueDate(task);
  }

}
