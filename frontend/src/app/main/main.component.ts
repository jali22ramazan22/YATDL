import { Component, OnDestroy, OnInit} from '@angular/core';
import { GeneralService } from '../shared/services/general.service';
import { Task } from '../shared/models/Task.model';
import { Subscription } from 'rxjs';
import { DatePipe, NgStyle } from '@angular/common';
import { FormControl, FormGroup, NgModel, ReactiveFormsModule } from '@angular/forms';
import { TaskHolderWindowComponent } from "./components/task-holder-window/task-holder-window.component";
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    TaskHolderWindowComponent,
    TaskHolderWindowComponent,
    NgStyle],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, OnDestroy{
  doneTaskSwitchSub: Subscription = new Subscription();

  inputForm = new FormGroup({
    title: new FormControl(''),
  })
  DoneTasksSwitch: boolean = false;

  constructor(private generalService: GeneralService){}

  ngOnInit(): void {
    this.doneTaskSwitchSub = this.generalService.DoneTasksSwitch
    .subscribe(value => this.DoneTasksSwitch = value);

  }

  onCreateTask(){
    const title = this.inputForm.get('title')?.value;
    if(title === '' || title === undefined){
      return;
    }
    this.inputForm.patchValue({ title: '' });
    this.generalService.createTask(title);
  }

  onSortByPriority(){
    this.generalService.sortTasksByPriority();
  }

  onSortByDate(){
    this.generalService.sortTasksByDate();
  }

  onSwitchTasksList(){
    let value = this.generalService.DoneTasksSwitch.value;
    this.generalService.DoneTasksSwitch.next(!value);
  }

  ngOnDestroy(): void {
    this.doneTaskSwitchSub.unsubscribe();
  }
}
