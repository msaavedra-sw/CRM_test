import { Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[appDragDropColumns]',
  standalone: true
})
export class DragDropColumnsDirective {
  @Input() enabled = true;
  @Output() orderChanged = new EventEmitter<number[]>();

  onDrop(previousIndex: number, currentIndex: number): void {
    if (!this.enabled) {
      return;
    }
    this.orderChanged.emit([previousIndex, currentIndex]);
  }
}
