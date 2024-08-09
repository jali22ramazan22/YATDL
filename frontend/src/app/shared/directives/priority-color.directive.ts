import { Directive, ElementRef, Renderer2, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Priority } from '../models/Task.model';

@Directive({
  selector: '[appPriorityColor]',
  standalone: true
})
export class PriorityColorDirective implements OnInit, OnChanges {
  @Input('appPriorityColor') value!: Priority;

  constructor(private renderer: Renderer2, private ref: ElementRef) {}

  ngOnInit(): void {
    this.updateColor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.updateColor();
    }
  }

  private updateColor(): void {
    let color: string | undefined;

    switch (this.value) {
      case Priority.LOW:
        color = 'green';
        break;
      case Priority.MEDIUM:
        color = 'yellow';
        break;
      case Priority.HIGH:
        color = 'red';
        break;
      default:
        color = 'black';
        break;
    }

    this.renderer.setStyle(this.ref.nativeElement, 'color', color);
  }
}
