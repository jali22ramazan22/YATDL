import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ModalComponent } from "./shared/modal/modal.component";
import { GeneralService } from './shared/services/general.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private g: GeneralService){}


  get ShowModal(): boolean{
    return this.g.ShowModal.value;
  }
}
