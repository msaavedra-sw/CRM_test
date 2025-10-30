import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidePanelComponent {
  @Input() properties: Array<{ label: string; value: string | number; editable?: boolean }> = [];
  @Output() propertyChange = new EventEmitter<{ label: string; value: string | number }>();

  update(label: string, value: string | number): void {
    this.propertyChange.emit({ label, value });
  }
}
