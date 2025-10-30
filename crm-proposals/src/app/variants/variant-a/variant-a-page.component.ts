import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { DataTableComponent, DataTableColumn } from '../../shared/components/data-table/data-table.component';
import { OpportunityStateService } from '../../core/services/opportunity-state.service';
import { CsvService } from '../../core/services/csv.service';
import { I18nPipe } from '../../shared/utils/i18n.pipe';

@Component({
  selector: 'app-variant-a-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, I18nPipe],
  templateUrl: './variant-a-page.component.html',
  styleUrl: './variant-a-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VariantAPageComponent {
  private readonly state = inject(OpportunityStateService);
  private readonly csv = inject(CsvService);

  readonly columns: DataTableColumn[] = [
    { key: 'nombre', title: 'Nombre', sortable: true, filterable: true, pinned: 'left' },
    { key: 'cuenta', title: 'Cuenta', sortable: true, filterable: true },
    { key: 'etapa', title: 'Etapa', sortable: true, filterable: true, summary: 'count' },
    { key: 'monto', title: 'Monto', type: 'number', sortable: true, summary: 'sum' },
    { key: 'probabilidad', title: 'Probabilidad', type: 'number', sortable: true },
    { key: 'cierrePrevisto', title: 'Cierre previsto', type: 'date', sortable: true },
    { key: 'propietario', title: 'Propietario', sortable: true, filterable: true },
    { key: 'fuente', title: 'Fuente', sortable: true, filterable: true },
    { key: 'territorio', title: 'Territorio', sortable: true, filterable: true }
  ];

  readonly view$ = combineLatest([
    this.state.opportunities$,
    this.state.selectedIds()
  ]).pipe(
    map(([rows, selection]) => ({ rows, selection }))
  );

  exportCsv(rows: Record<string, unknown>[]): void {
    this.csv.exportToCsv('oportunidades.csv', rows);
  }

  onCellEdit(event: { rowIndex: number; key: string; value: unknown; row: Record<string, unknown> }): void {
    const id = String(event.row['id']);
    if (id) {
      this.state.update({ id, [event.key]: event.value } as never);
    }
  }
}
