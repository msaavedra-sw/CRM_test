import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inline-edit-cell',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inline-edit-cell.component.html',
  styleUrl: './inline-edit-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineEditCellComponent {
  @Input() value: unknown;
  @Input() type: 'text' | 'number' | 'date' | 'select' = 'text';
  @Input() options: Array<{ label: string; value: unknown }> = [];
  @Output() valueChange = new EventEmitter<unknown>();

  isEditing = false;

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  commit(value: unknown): void {
    this.valueChange.emit(value);
    this.isEditing = false;
  }

  cancel(): void {
    this.isEditing = false;
  }
}
