import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-activities-timeline',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesTimelineComponent {
  @Input() items: Array<{ fecha: string; titulo: string; descripcion: string }> = [];
  @Output() addQuickAction = new EventEmitter<'llamada' | 'reunion' | 'tarea'>();

  add(tipo: 'llamada' | 'reunion' | 'tarea'): void {
    this.addQuickAction.emit(tipo);
  }
}
