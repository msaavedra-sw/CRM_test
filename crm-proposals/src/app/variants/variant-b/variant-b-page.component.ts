import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';

import { OpportunityStateService } from '../../core/services/opportunity-state.service';
import { DataTableComponent, DataTableColumn } from '../../shared/components/data-table/data-table.component';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'app-variant-b-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, KpiCardComponent],
  templateUrl: './variant-b-page.component.html',
  styleUrl: './variant-b-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VariantBPageComponent {
  readonly rows$ = this.state.opportunities$;
  readonly swimlanes$ = this.rows$.pipe(
    map((rows) =>
      rows.reduce<Record<string, number>>((acc, row) => {
        acc[row.etapa] = (acc[row.etapa] ?? 0) + 1;
        return acc;
      }, {})
    )
  );

  readonly columns: DataTableColumn[] = [
    { key: 'nombre', title: 'Oportunidad', sortable: true, filterable: true },
    { key: 'etapa', title: 'Etapa', sortable: true },
    { key: 'monto', title: 'Monto', type: 'number', sortable: true, summary: 'sum' },
    { key: 'probabilidad', title: 'Probabilidad', type: 'number', sortable: true },
    { key: 'cierrePrevisto', title: 'Cierre', type: 'date', sortable: true }
  ];

  constructor(private readonly state: OpportunityStateService) {}
}
