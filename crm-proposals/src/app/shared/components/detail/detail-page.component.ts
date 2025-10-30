import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidePanelComponent } from './side-panel.component';
import { ActivitiesTimelineComponent } from './timeline.component';

export interface DetailHeader {
  titulo: string;
  estado: string;
  propietario: string;
  monto?: number;
  fechaCierre?: string;
}

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, SidePanelComponent, ActivitiesTimelineComponent, DatePipe, DecimalPipe],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailPageComponent {
  @Input() header!: DetailHeader;
  @Input() properties: Array<{ label: string; value: string | number; editable?: boolean }> = [];
  @Input() timeline: Array<{ fecha: string; titulo: string; descripcion: string }> = [];
}
