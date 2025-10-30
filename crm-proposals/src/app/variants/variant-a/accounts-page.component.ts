import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';

import { AccountStateService } from '../../core/services/account-state.service';
import { DataTableComponent, DataTableColumn } from '../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-accounts-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  templateUrl: './accounts-page.component.html',
  styleUrl: './accounts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsPageComponent {
  readonly rows$ = this.state.accounts$.pipe(
    map((accounts) =>
      accounts.map((account) => ({
        ...account,
        ingresosAnuales: account.ingresosAnuales
      }))
    )
  );

  readonly columns: DataTableColumn[] = [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'nombre', title: 'Cuenta', sortable: true, filterable: true, pinned: 'left' },
    { key: 'sector', title: 'Sector', sortable: true, filterable: true },
    { key: 'segmento', title: 'Segmento', sortable: true },
    { key: 'territorio', title: 'Territorio', sortable: true },
    { key: 'ingresosAnuales', title: 'Ingresos', type: 'number', sortable: true, summary: 'sum' }
  ];

  constructor(private readonly state: AccountStateService) {}
}
