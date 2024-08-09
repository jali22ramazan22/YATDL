import { GeneralService } from './../services/general.service';
import { Component, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  constructor(private g: GeneralService){}

  onHandleAnswer(value: string): void{
    this.g.DeleteTask.next(value === "yes");
  }
}
