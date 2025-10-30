import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { OpportunityStateService } from '../../core/services/opportunity-state.service';
import { DataTableComponent, DataTableColumn } from '../../shared/components/data-table/data-table.component';
import { DetailPageComponent } from '../../shared/components/detail/detail-page.component';
import { I18nPipe } from '../../shared/utils/i18n.pipe';

@Component({
  selector: 'app-variant-c-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, DetailPageComponent, I18nPipe],
  templateUrl: './variant-c-page.component.html',
  styleUrl: './variant-c-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VariantCPageComponent {
  private readonly state = inject(OpportunityStateService);

  readonly selection = signal<Record<string, unknown> | null>(null);
  readonly rows$ = this.state.opportunities$;

  readonly columns: DataTableColumn[] = [
    { key: 'nombre', title: 'Nombre', sortable: true, filterable: true, pinned: 'left' },
    { key: 'etapa', title: 'Etapa', sortable: true },
    { key: 'monto', title: 'Monto', type: 'number', sortable: true },
    { key: 'probabilidad', title: 'Probabilidad', type: 'number', sortable: true }
  ];

  select(row: Record<string, unknown>): void {
    this.selection.set(row);
  }

  asString(value: unknown): string {
    return String(value);
  }

  asNumber(value: unknown): number {
    return Number(value);
  }
}
