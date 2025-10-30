import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { OpportunityStateService } from '../../core/services/opportunity-state.service';
import { DataTableComponent, DataTableColumn } from '../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-opportunities-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  templateUrl: './opportunities-page.component.html',
  styleUrl: './opportunities-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunitiesPageComponent {
  readonly view$ = combineLatest([
    this.state.opportunities$,
    this.state.selectedIds()
  ]).pipe(map(([rows, selection]) => ({ rows, selection })));

  readonly columns: DataTableColumn[] = [
    { key: 'id', title: 'ID', sortable: true, pinned: 'left' },
    { key: 'nombre', title: 'Nombre', sortable: true, filterable: true, pinned: 'left' },
    { key: 'cuenta', title: 'Cuenta', sortable: true, filterable: true },
    { key: 'etapa', title: 'Etapa', sortable: true, filterable: true },
    { key: 'monto', title: 'Monto', type: 'number', sortable: true, summary: 'sum' },
    { key: 'probabilidad', title: '%', type: 'number', sortable: true },
    { key: 'cierrePrevisto', title: 'Cierre', type: 'date', sortable: true },
    { key: 'propietario', title: 'Owner', sortable: true, filterable: true },
    { key: 'fuente', title: 'Fuente', sortable: true },
    { key: 'territorio', title: 'Territorio', sortable: true }
  ];

  constructor(private readonly state: OpportunityStateService) {}

  onCellEdit(event: { rowIndex: number; key: string; value: unknown; row: Record<string, unknown> }): void {
    const id = String(event.row['id']);
    if (id) {
      this.state.update({ id, [event.key]: event.value } as never);
    }
  }
}
